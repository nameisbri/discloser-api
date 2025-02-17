import initKnex from "knex";
import configuration from "../knexfile.js";
import { minioClient } from "../middlewares/upload.js";
import { v4 as uuidv4 } from "uuid";
import { processDocument } from "../utils/documentProcessor.js";
import { findTestResults } from "../utils/stiTestUtils.js";
import sharp from "sharp";

const knex = initKnex(configuration);

export const uploadRecord = async (req, res) => {
  const trx = await knex.transaction();

  try {
    const { user_id, test_date } = req.body;

    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }
    if (!user_id) {
      return res.status(400).json({ error: "User ID is required" });
    }
    if (!test_date) {
      return res.status(400).json({ error: "Test date is required" });
    }

    const { extractedTexts, originalBuffer, isImage } = await processDocument(
      req.file.buffer,
      req.file.mimetype
    );

    const fileExtension =
      req.file.mimetype === "application/pdf"
        ? "pdf"
        : req.file.mimetype.split("/")[1];
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
        "Content-Type": req.file.mimetype,
        ...additionalMetadata,
      }
    );

    const [recordId] = await trx("test_record").insert({
      user_id,
      test_date,
      file_path: `${bucketName}/${filename}`,
      file_type: req.file.mimetype,
      file_metadata: JSON.stringify(additionalMetadata),
      created_at: knex.fn.now(),
      updated_at: knex.fn.now(),
    });

    if (extractedTexts && extractedTexts.length > 0) {
      const resultsToInsert = [];

      extractedTexts.forEach(({ text, page }) => {
        const testResults = findTestResults(text);

        testResults.forEach((testResult) => {
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
        await trx("test_result").insert(resultsToInsert);
      }
    }

    // Commit transaction
    await trx.commit();

    // Fetch complete record with results
    const record = await knex("test_record").where("id", recordId).first();
    const results = await knex("test_result")
      .where("test_record_id", recordId)
      .select();

    res.status(201).json({
      message: "File uploaded and processed successfully",
      record: {
        ...record,
        results,
      },
    });
  } catch (error) {
    await trx.rollback();
    console.error("Upload error:", error);
    res.status(500).json({
      error: "Error uploading and processing record",
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
