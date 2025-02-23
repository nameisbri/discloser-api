import multer from "multer";
import { S3Client } from "@aws-sdk/client-s3";
import { Upload } from "@aws-sdk/lib-storage"; //For multipart uploads
import { v4 as uuidv4 } from "uuid";

const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
  console.log(
    "upload.js: File filter called for:",
    file.originalname,
    "Mimetype:",
    file.mimetype
  );
  const allowedTypes = [
    "application/pdf",
    "image/jpeg",
    "image/png",
    "image/webp",
  ];

  if (allowedTypes.includes(file.mimetype)) {
    console.log("upload.js: File type allowed:", file.mimetype);
    cb(null, true);
  } else {
    console.log("upload.js: File type not allowed:", file.mimetype);
    cb(
      new Error(
        "Invalid file type. Only PDF, JPEG, PNG, and WebP files are allowed."
      ),
      false
    );
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit per file
    files: 5, // Maximum 5 files per request
  },
});

const s3Client = new S3Client({
  region: process.env.AWS_REGION,
  endpoint: process.env.AWS_ENDPOINT_URL,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

const uploadToWasabi = async (
  bucketName,
  filename,
  buffer,
  contentType,
  metadata
) => {
  console.log("upload.js: Starting Wasabi upload:", filename);
  try {
    const upload = new Upload({
      client: s3Client,
      params: {
        Bucket: bucketName,
        Key: filename,
        Body: buffer,
        ContentType: contentType,
        Metadata: metadata,
      },
    });

    await upload.done();
    console.log("upload.js: Wasabi upload successful:", filename);
  } catch (error) {
    console.error("upload.js: Wasabi upload failed:", filename, error);
    throw error;
  }
};
export { upload, s3Client, uploadToWasabi };
