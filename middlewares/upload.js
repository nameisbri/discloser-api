import multer from "multer";
import * as Minio from "minio";

// Configure Multer to store files in memory
const storage = multer.memoryStorage();
const upload = multer({ storage });

// Configure MinIO client using environment variables
const minioClient = new Minio.Client({
  endPoint: process.env.MINIO_ENDPOINT, // e.g., "127.0.0.1"
  port: parseInt(process.env.MINIO_PORT), // MinIO server port (convert to number)
  useSSL: process.env.MINIO_USE_SSL === "true", // Convert string to boolean
  accessKey: process.env.MINIO_ACCESS_KEY, // e.g., "minioadmin"
  secretKey: process.env.MINIO_SECRET_KEY, // e.g., "minioadmin"
});

// Test MinIO connection
const testMinioConnection = async () => {
  try {
    const bucketName = process.env.MINIO_BUCKET_NAME || "test-records";

    // Check if the bucket exists
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

// Run the test function
testMinioConnection();

export { upload, minioClient };
