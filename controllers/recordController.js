import initKnex from "knex";
import configuration from "../knexfile.js";
import { minioClient } from "../middlewares/upload.js";
import { v4 as uuidv4 } from "uuid";
import { processDocument } from "../utils/documentProcessor.js";
import { findTestResults } from "../utils/stiTestUtils.js";
import sharp from "sharp";

const knex = initKnex(configuration);

const formatDateForMySQL = (dateString) => {
  const monthAbbrRegex =
    /(\d{2})-(JAN|FEB|MAR|APR|MAY|JUN|JUL|AUG|SEP|OCT|NOV|DEC)-(\d{4})/i;
  const monthAbbrMatch = dateString.match(monthAbbrRegex);

  if (monthAbbrMatch) {
    const monthMap = {
      JAN: "01",
      FEB: "02",
      MAR: "03",
      APR: "04",
      MAY: "05",
      JUN: "06",
      JUL: "07",
      AUG: "08",
      SEP: "09",
      OCT: "10",
      NOV: "11",
      DEC: "12",
    };
    const day = monthAbbrMatch[1];
    const month = monthMap[monthAbbrMatch[2].toUpperCase()];
    const year = monthAbbrMatch[3];

    const date = new Date(`${year}-${month}-${day}T00:00:00Z`);
    return date.toISOString().slice(0, 19).replace("T", " ");
  }

  // Check if the date is in the MM/DD/YYYY or MM-DD-YYYY format
  const slashOrHyphenRegex = /(\d{2})[\/-](\d{2})[\/-](\d{4})/;
  const slashOrHyphenMatch = dateString.match(slashOrHyphenRegex);

  if (slashOrHyphenMatch) {
    const month = slashOrHyphenMatch[1];
    const day = slashOrHyphenMatch[2];
    const year = slashOrHyphenMatch[3];

    // Create a date object and format it for MySQL
    const date = new Date(`${year}-${month}-${day}T00:00:00Z`);
    return date.toISOString().slice(0, 19).replace("T", " ");
  }

  // Fallback for ISO and short date formats
  const date = new Date(dateString);
  if (isNaN(date.getTime())) {
    throw new Error(`Invalid date string: ${dateString}`);
  }
  return date.toISOString().slice(0, 19).replace("T", " ");
};

export const uploadRecords = async (req, res) => {
  const trx = await knex.transaction();

  try {
    const { user_id } = req.body;

    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ error: "No files uploaded" });
    }
    if (!user_id) {
      return res.status(400).json({ error: "User ID is required" });
    }

    const uploadResults = [];

    for (const file of req.files) {
      try {
        const {
          extractedTexts,
          originalBuffer,
          isImage,
          extractedDate: initialExtractedDate,
        } = await processDocument(file.buffer, file.mimetype);

        let extractedDate = initialExtractedDate;

        if (!extractedDate) {
          console.warn(
            "No date found in the document. Using current date as fallback."
          );
          extractedDate = new Date().toISOString();
        }

        const fileExtension =
          file.mimetype === "application/pdf"
            ? "pdf"
            : file.mimetype.split("/")[1];
        const filename = `${uuidv4()}.${fileExtension}`;
        const bucketName = process.env.MINIO_BUCKET_NAME;

        let additionalMetadata = {};
        if (isImage) {
          const metadata = await sharp(originalBuffer).metadata();
          additionalMetadata = {
            width: metadata.width,
            height: metadata.height,
            format: metadata.format,
          };
        }

        await minioClient.putObject(
          bucketName,
          filename,
          originalBuffer,
          originalBuffer.length,
          {
            "Content-Type": file.mimetype,
            ...additionalMetadata,
          }
        );

        const formattedTestDate = formatDateForMySQL(extractedDate);

        const [recordId] = await trx("test_record").insert({
          user_id,
          test_date: formattedTestDate,
          file_path: `${bucketName}/${filename}`,
          file_type: file.mimetype,
          file_metadata: JSON.stringify(additionalMetadata),
          created_at: knex.fn.now(),
          updated_at: knex.fn.now(),
        });

        if (extractedTexts && extractedTexts.length > 0) {
          const resultsToInsert = [];

          extractedTexts.forEach(({ text, page }) => {
            const testResults = findTestResults(text);
            console.log(
              `Found ${testResults.length} test results on page ${page}`
            );

            testResults.forEach((testResult) => {
              resultsToInsert.push({
                test_record_id: recordId,
                test_type: testResult.test_type,
                result: testResult.result,
                notes: `${testResult.notes}`,
                created_at: knex.fn.now(),
                updated_at: knex.fn.now(),
              });
            });
          });

          if (resultsToInsert.length > 0) {
            console.log(`Inserting ${resultsToInsert.length} test results`);
            await trx("test_result").insert(resultsToInsert);
          } else {
            console.log("No test results to insert");
          }
        } else {
          console.log("No extracted texts to process");
        }

        // Fetch complete record with results
        const record = await trx("test_record").where("id", recordId).first();
        const results = await trx("test_result")
          .where("test_record_id", recordId)
          .select();

        console.log(
          `Record ${recordId} completed with ${results.length} results`
        );

        uploadResults.push({
          originalName: file.originalname,
          record: {
            ...record,
            results,
          },
        });
      } catch (error) {
        console.error(`Error processing file ${file.originalname}:`, error);
        uploadResults.push({
          originalName: file.originalname,
          error: `Failed to process file: ${error.message}`,
        });
      }
    }

    // Commit transaction
    await trx.commit();

    // Check if any files were processed successfully
    const successfulUploads = uploadResults.filter((result) => result.record);
    if (successfulUploads.length === 0) {
      return res.status(500).json({
        error: "Failed to process any files",
        details: uploadResults,
      });
    }

    // Return results
    res.status(201).json({
      message: `Successfully processed ${successfulUploads.length} out of ${req.files.length} files`,
      results: uploadResults,
    });
  } catch (error) {
    await trx.rollback();
    console.error("Upload error:", error);
    res.status(500).json({
      error: "Error uploading and processing records",
      details: error.message,
    });
  }
};

export const getAllRecords = async (req, res) => {
  try {
    const { user_id } = req.query;

    if (!user_id) {
      return res.status(400).json({ error: "User ID is required" });
    }

    const records = await knex("test_record")
      .where({ user_id })
      .orderBy("test_date", "desc")
      .select(["id", "test_date", "file_path", "created_at"]);

    // Get results for each record
    const recordsWithResults = await Promise.all(
      records.map(async (record) => {
        const results = await knex("test_result")
          .where("test_record_id", record.id)
          .select();
        return { ...record, results };
      })
    );

    res.json(recordsWithResults);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error retrieving test records" });
  }
};

export const getRecord = async (req, res) => {
  try {
    const { id } = req.params;
    const { user_id } = req.query;

    if (!user_id) {
      return res.status(400).json({ error: "User ID is required" });
    }

    const record = await knex("test_record")
      .where({
        id,
        user_id,
      })
      .first();

    if (!record) {
      return res.status(404).json({ error: "Record not found" });
    }

    // Get results for the record
    const results = await knex("test_result")
      .where("test_record_id", id)
      .select();

    res.json({
      ...record,
      results,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error retrieving test record" });
  }
};

export const updateRecords = async (req, res) => {
  const trx = await knex.transaction();

  try {
    const { records } = req.body;

    if (!records || !Array.isArray(records)) {
      return res.status(400).json({ error: "Invalid records data" });
    }

    for (const record of records) {
      const { id, results } = record;

      const existingRecord = await trx("test_record").where({ id }).first();

      if (!existingRecord) {
        throw new Error(`Record ${id} not found`);
      }

      const currentResults = await trx("test_result")
        .where({ test_record_id: id })
        .select("id");

      const keepResultIds = results.map((r) => r.id);

      await trx("test_result")
        .where({ test_record_id: id })
        .whereNotIn("id", keepResultIds)
        .delete();
    }

    await trx.commit();

    res.json({
      message: "Records updated successfully",
      updatedRecords: records.length,
    });
  } catch (error) {
    await trx.rollback();
    console.error("Update error:", error);
    res.status(500).json({
      error: "Error updating records",
      details: error.message,
    });
  }
};
