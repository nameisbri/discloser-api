import initKnex from "knex";
import configuration from "../knexfile.js";
import { minioClient, upload } from "../middlewares/upload.js";
import { v4 as uuidv4 } from "uuid";

const knex = initKnex(configuration);

export const uploadRecord = async (req, res) => {
  try {
    console.log("Request Body:", req.body); // Log the request body
    console.log("Request File:", req.file); // Log the uploaded file

    const { user_id, test_date } = req.body;

    // Check if file exists in request
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    // Validate required fields
    if (!user_id) {
      return res.status(400).json({ error: "User ID is required" });
    }

    if (!test_date) {
      return res.status(400).json({ error: "Test date is required" });
    }

    // Generate unique filename
    const filename = `${uuidv4()}.pdf`;
    const bucketName = process.env.MINIO_BUCKET_NAME;

    console.log("Attempting to upload file:", {
      bucketName,
      filename,
      fileSize: req.file.size,
      mimeType: req.file.mimetype,
    });

    // Upload file to MinIO
    await minioClient.putObject(
      bucketName,
      filename,
      req.file.buffer,
      req.file.size,
      { "Content-Type": "application/pdf" }
    );

    console.log("File uploaded to MinIO successfully");

    // Create record in database
    const [newRecordId] = await knex("test_record").insert({
      user_id,
      test_date,
      file_path: `${bucketName}/${filename}`,
      created_at: knex.fn.now(),
      updated_at: knex.fn.now(),
    });

    console.log("Database record created:", newRecordId);

    // Fetch the newly created record
    const newRecord = await knex("test_record")
      .where({ id: newRecordId })
      .first();

    res.status(201).json({
      message: "File uploaded successfully",
      record: newRecord,
    });
  } catch (error) {
    console.error("Upload error:", error);
    res
      .status(500)
      .json({ error: `Error uploading test record: ${error.message}` });
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

    res.json(records);
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

    res.json(record);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error retrieving test record" });
  }
};
