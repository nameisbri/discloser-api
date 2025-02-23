import sharp from "sharp";
import Tesseract from "tesseract.js";
import { promises as fs } from "fs";
import { fromBuffer } from "pdf2pic";
import { PDFDocument } from "pdf-lib";
import { extractDateFromText } from "../utils/stiTestUtils.js"; // Import the date extraction function

const TEMP_DIR = "./temp/images";

const parsePDF = async (pdfBuffer) => {
  const tempFiles = [];

  try {
    // Ensure the temp directory exists
    await fs.mkdir(TEMP_DIR, { recursive: true });

    // Load the PDF and get the total number of pages
    const pdfDoc = await PDFDocument.load(pdfBuffer);
    const totalPages = pdfDoc.getPageCount();

    console.log(`Processing PDF with ${totalPages} pages`);

    // Set up PDF to image conversion options
    const options = {
      density: 300,
      saveFilename: "page",
      savePath: TEMP_DIR,
      format: "png",
      width: 2400,
      height: 3200,
    };

    // Convert PDF to images
    const convert = fromBuffer(pdfBuffer, options);
    const extractedTexts = [];
    let extractedDate = null;

    for (let page = 1; page <= totalPages; page++) {
      console.log(`Processing page ${page}...`);

      // Convert page to image
      const image = await convert(page, { responseType: "image" });
      tempFiles.push(image.path); // Add the file path to the cleanup list

      // Extract text from image
      const {
        data: { text },
      } = await Tesseract.recognize(image.path, "eng", {
        logger: (m) => console.log(m),
        tessedit_char_whitelist:
          "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789.,:/- ()",
        tessedit_pageseg_mode: "1",
        preserve_interword_spaces: "1",
      });

      console.log(`Extracted text from page ${page}:`, text); // Log the extracted text
      extractedTexts.push({ page, text });

      // Extract date from the text if not already found
      if (!extractedDate) {
        extractedDate = extractDateFromText(text);
      }
    }

    return {
      extractedTexts,
      originalBuffer: pdfBuffer,
      isImage: false,
      extractedDate,
    };
  } catch (error) {
    console.error("Error parsing PDF:", error);
    throw error;
  } finally {
    // Clean up any remaining temporary files
    for (const filePath of tempFiles) {
      try {
        await fs.unlink(filePath);
        console.log(`Deleted temporary file: ${filePath}`);
      } catch (error) {
        if (error.code !== "ENOENT") {
          // Ignore "file not found" errors
          console.error(`Error deleting temporary file ${filePath}:`, error);
        }
      }
    }

    // Try to remove temp directory if empty
    try {
      await fs.rmdir(TEMP_DIR);
      console.log("Temp directory removed");
    } catch (error) {
      console.log("Note: Temp directory not empty or already removed");
    }
  }
};

const processImage = async (imageBuffer) => {
  const tempFiles = [];

  try {
    await fs.mkdir(TEMP_DIR, { recursive: true });

    const tempPath = `${TEMP_DIR}/processed_${Date.now()}.png`;
    tempFiles.push(tempPath);

    console.log("Starting image processing...");

    // Process image with sharp
    await sharp(imageBuffer)
      .resize(2400, null, {
        withoutEnlargement: true,
        fit: "inside",
      })
      .normalize()
      .sharpen()
      .toFormat("png") // Explicitly convert to PNG for better OCR
      .toFile(tempPath);

    console.log("Image processed and saved to temp file");

    // Configure Tesseract with more optimal settings for medical documents
    const config = {
      lang: "eng",
      logger: (m) => console.log(m),
      tessedit_char_whitelist:
        "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789.,:/- ()",
      tessedit_pageseg_mode: "6", // Assume uniform text block
      preserve_interword_spaces: "1",
      tessedit_ocr_engine_mode: "3", // Use Legacy + LSTM engines
    };

    console.log("Starting OCR with Tesseract...");

    const {
      data: { text },
    } = await Tesseract.recognize(tempPath, "eng", config);

    console.log("OCR completed. Text length:", text.length);
    console.log("Sample of extracted text:", text.substring(0, 200));

    // Extract date from the text
    const extractedDate = extractDateFromText(text);

    return {
      extractedTexts: [
        {
          page: 1,
          text: text,
        },
      ],
      originalBuffer: imageBuffer,
      isImage: true,
      extractedDate, // Return the extracted date
    };
  } catch (error) {
    console.error("Error in image processing:", error);
    throw error;
  } finally {
    // Clean up temporary files
    for (const filePath of tempFiles) {
      try {
        await fs.unlink(filePath);
      } catch (error) {
        console.error(`Error deleting temporary file ${filePath}:`, error);
      }
    }

    // Try to remove temp directory if empty
    try {
      await fs.rmdir(TEMP_DIR);
    } catch (error) {
      console.log("Note: Temp directory not empty or already removed");
    }
  }
};

export const processDocument = async (buffer, mimeType) => {
  const supportedImageTypes = ["image/jpeg", "image/png", "image/webp"];

  console.log("Processing document of type:", mimeType);

  if (mimeType === "application/pdf") {
    console.log("Processing as PDF...");
    return parsePDF(buffer);
  } else if (supportedImageTypes.includes(mimeType)) {
    console.log("Processing as Image...");
    return processImage(buffer);
  } else {
    throw new Error(`Unsupported file type: ${mimeType}`);
  }
};
