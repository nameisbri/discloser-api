import { fromBuffer } from "pdf2pic";
import Tesseract from "tesseract.js";
import fs from "fs";
import { PDFDocument } from "pdf-lib";

const TEMP_DIR = "./temp/images";

const options = {
  density: 300,
  saveFilename: "page",
  savePath: TEMP_DIR,
  format: "png",
  width: 2400,
  height: 3200,
};

// Helper function to clean up temporary files
const cleanupTempFiles = (filePath) => {
  try {
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
      console.log(`Deleted temporary file: ${filePath}`);
    }
  } catch (error) {
    console.error(`Error deleting temporary file ${filePath}:`, error);
  }
};

const parsePDF = async (pdfBuffer) => {
  const tempFiles = [];

  try {
    // Ensure the temp directory exists
    if (!fs.existsSync(TEMP_DIR)) {
      fs.mkdirSync(TEMP_DIR, { recursive: true });
    }

    // Load the PDF and get the total number of pages
    const pdfDoc = await PDFDocument.load(pdfBuffer);
    const totalPages = pdfDoc.getPageCount();

    // Convert PDF to images
    const convert = fromBuffer(pdfBuffer, options);
    const extractedTexts = [];

    for (let page = 1; page <= totalPages; page++) {
      console.log(`Processing page ${page}...`);

      // Convert page to image
      const image = await convert(page, { responseType: "image" });
      tempFiles.push(image.path);

      // Extract text from image with improved settings
      const {
        data: { text },
      } = await Tesseract.recognize(image.path, "eng", {
        logger: (m) => console.log(m),
        tessedit_char_whitelist:
          "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789.,:/- ()",
        tessedit_pageseg_mode: "1",
        preserve_interword_spaces: "1",
      });

      extractedTexts.push({ page, text });

      // Clean up the current page's temporary file immediately
      cleanupTempFiles(image.path);
    }

    return {
      extractedTexts,
      originalBuffer: pdfBuffer,
      isImage: false,
    };
  } catch (error) {
    console.error("Error parsing PDF:", error);
    throw error;
  } finally {
    // Clean up any remaining temporary files
    tempFiles.forEach(cleanupTempFiles);

    // Try to remove temp directory if empty
    try {
      fs.rmdirSync(TEMP_DIR);
    } catch (error) {
      console.log("Note: Temp directory not empty or already removed");
    }
  }
};

export default parsePDF;
