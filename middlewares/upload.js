import multer from "multer";
import * as Minio from "minio";

const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
  const allowedTypes = [
    "application/pdf",
    "image/jpeg",
    "image/png",
    "image/webp",
  ];

  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
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
    fileSize: 10 * 1024 * 1024, // 10MB limit
  },
});

const minioClient = new Minio.Client({
  endPoint: process.env.MINIO_ENDPOINT,
  port: parseInt(process.env.MINIO_PORT),
  useSSL: process.env.MINIO_USE_SSL === "true",
  accessKey: process.env.MINIO_ACCESS_KEY,
  secretKey: process.env.MINIO_SECRET_KEY,
});

const testMinioConnection = async () => {
  try {
    const bucketName = process.env.MINIO_BUCKET_NAME || "test-records";
    const bucketExists = await minioClient.bucketExists(bucketName);

    if (!bucketExists) {
      console.log(`Bucket "${bucketName}" does not exist. Creating it...`);
      await minioClient.makeBucket(bucketName, "us-east-1");
    }

    console.log("MinIO connection successful!");
  } catch (error) {
    console.error("MinIO connection error:", error);
  }
};

const downloadFile = async (bucketName, objectName, filePath) => {
  try {
    await minioClient.fGetObject(bucketName, objectName, filePath);
    console.log(`File downloaded from ${bucketName}/${objectName}`);
  } catch (error) {
    console.error("Error downloading file from MinIO:", error);
    throw error;
  }
};

testMinioConnection();

export { upload, downloadFile, minioClient };
