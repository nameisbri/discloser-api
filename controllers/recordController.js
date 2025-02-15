import initKnex from "knex";
import configuration from "../knexfile.js";
import { minioClient } from "../middlewares/upload.js";
import { v4 as uuidv4 } from "uuid";

const knex = initKnex(configuration);

export const uploadRecord = async (req, res) => {
  const trx = await knex.transaction();

  try {
    const { user_id } = req.body;

    // Validate request
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }
    if (!user_id) {
      return res.status(400).json({ error: "User ID is required" });
    }

    // Log file details
    console.log("File details:", {
      originalname: req.file.originalname,
      mimetype: req.file.mimetype,
      size: req.file.size,
      bufferLength: req.file.buffer?.length,
    });

    // Generate unique filename and set up MinIO parameters
    const filename = `${uuidv4()}.pdf`;
    const bucketName = process.env.MINIO_BUCKET_NAME;

    // Upload file to MinIO
    await minioClient.putObject(
      bucketName,
      filename,
      req.file.buffer,
      req.file.size,
      {
        "Content-Type": "application/pdf",
        "X-Lab-Name": pdfData.labName,
        "X-Accession-Number": pdfData.accessionNumber,
      }
    );

    // Create record in database
    const [recordId] = await trx("test_record").insert({
      user_id,
      test_date,
      file_path: `${bucketName}/${filename}`,
      created_at: knex.fn.now(),
      updated_at: knex.fn.now(),
    });

    // Insert test results if valid
    if (pdfData.results && pdfData.results.length > 0) {
      const resultsToInsert = pdfData.results.map((result) => ({
        test_record_id: recordId,
        test_type: result.test_type,
        result: result.result,
        notes: result.notes,
        created_at: knex.fn.now(),
        updated_at: knex.fn.now(),
      }));

      await trx("test_result").insert(resultsToInsert);
    }

    // Commit transaction
    await trx.commit();

    // Fetch the complete record with results
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
      error: "Error uploading and processing test record",
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
