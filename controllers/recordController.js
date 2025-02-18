import initKnex from "knex";
import configuration from "../knexfile.js";
import { minioClient } from "../middlewares/upload.js";
import { v4 as uuidv4 } from "uuid";
import { processDocument } from "../utils/documentProcessor.js";
import { findTestResults } from "../utils/stiTestUtils.js";
import sharp from "sharp";

const knex = initKnex(configuration);

// Add date formatting helper
const formatDateForMySQL = (dateString) => {
  const date = new Date(dateString);
  return date.toISOString().slice(0, 19).replace("T", " ");
};

export const uploadRecords = async (req, res) => {
  const trx = await knex.transaction();

  try {
    const { user_id, test_date } = req.body;
    console.log("Starting upload process with:", {
      filesCount: req.files?.length,
      user_id,
      test_date,
    });

    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ error: "No files uploaded" });
    }
    if (!user_id) {
      return res.status(400).json({ error: "User ID is required" });
    }
    if (!test_date) {
      return res.status(400).json({ error: "Test date is required" });
    }

    const uploadResults = [];

    // Process each file
    for (const file of req.files) {
      try {
        console.log(`\nProcessing file: ${file.originalname}`);
        console.log("File details:", {
          mimetype: file.mimetype,
          size: file.size,
          encoding: file.encoding,
        });

        const { extractedTexts, originalBuffer, isImage } =
          await processDocument(file.buffer, file.mimetype);

        console.log("Document processing complete");
        console.log("Extracted text count:", extractedTexts?.length);
        if (extractedTexts?.[0]?.text) {
          console.log(
            "First page text sample:",
            extractedTexts[0].text.substring(0, 200)
          );
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

        console.log("Uploading to MinIO...");
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
        console.log("MinIO upload complete");

        // Create record with formatted date
        const [recordId] = await trx("test_record").insert({
          user_id,
          test_date: formatDateForMySQL(test_date),
          file_path: `${bucketName}/${filename}`,
          file_type: file.mimetype,
          file_metadata: JSON.stringify(additionalMetadata),
          created_at: knex.fn.now(),
          updated_at: knex.fn.now(),
        });
        console.log("Record created with ID:", recordId);

        // Process extracted test results
        if (extractedTexts && extractedTexts.length > 0) {
          const resultsToInsert = [];

          extractedTexts.forEach(({ text, page }) => {
            console.log(`\nProcessing text from page ${page}`);
            const testResults = findTestResults(text);
            console.log(
              `Found ${testResults.length} test results on page ${page}`
            );

            testResults.forEach((testResult) => {
              console.log("Test result found:", {
                type: testResult.test_type,
                result: testResult.result,
              });

              resultsToInsert.push({
                test_record_id: recordId,
                test_type: testResult.test_type,
                result: testResult.result,
                notes: `Page ${page} | ${testResult.notes}`,
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
        console.error("Full error details:", {
          message: error.message,
          stack: error.stack,
          cause: error.cause,
        });

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
    console.error("Full error details:", {
      message: error.message,
      stack: error.stack,
      cause: error.cause,
    });

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
