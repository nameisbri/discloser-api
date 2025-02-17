import { fromBuffer } from "pdf2pic";
import Tesseract from "tesseract.js";
import fs from "fs";
import { PDFDocument } from "pdf-lib";
import sharp from "sharp";

const TEMP_DIR = "./temp/images";

const options = {
  density: 300,
  saveFilename: "page",
  savePath: TEMP_DIR,
  format: "png",
  width: 2400,
  height: 3200,
};

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

const processImage = async (imageBuffer) => {
  const tempFiles = [];

  try {
    if (!fs.existsSync(TEMP_DIR)) {
      fs.mkdirSync(TEMP_DIR, { recursive: true });
    }

    const tempPath = `${TEMP_DIR}/processed_${Date.now()}.png`;
    tempFiles.push(tempPath);

    await sharp(imageBuffer)
      .resize(2400, null, {
        withoutEnlargement: true,
        fit: "inside",
      })
      .normalize()
      .sharpen()
      .toFile(tempPath);

    const {
      data: { text },
    } = await Tesseract.recognize(tempPath, "eng", {
      logger: (m) => console.log(m),
      tessedit_char_whitelist:
        "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789.,:/- ()",
      tessedit_pageseg_mode: "1",
      preserve_interword_spaces: "1",
    });

    return {
      extractedTexts: [{ page: 1, text }],
      originalBuffer: imageBuffer,
      isImage: true,
    };
  } catch (error) {
    console.error("Error processing image:", error);
    throw error;
  } finally {
    tempFiles.forEach(cleanupTempFiles);
    try {
      fs.rmdirSync(TEMP_DIR);
    } catch (error) {
      console.log("Note: Temp directory not empty or already removed");
    }
  }
};

const processPDF = async (pdfBuffer) => {
  const tempFiles = [];

  try {
    if (!fs.existsSync(TEMP_DIR)) {
      fs.mkdirSync(TEMP_DIR, { recursive: true });
    }

    const pdfDoc = await PDFDocument.load(pdfBuffer);
    const totalPages = pdfDoc.getPageCount();
    const convert = fromBuffer(pdfBuffer, options);
    const extractedTexts = [];

    for (let page = 1; page <= totalPages; page++) {
      console.log(`Processing PDF page ${page}...`);
      const image = await convert(page, { responseType: "image" });
      tempFiles.push(image.path);

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
      cleanupTempFiles(image.path);
    }

    return {
      extractedTexts,
      originalBuffer: pdfBuffer, // Return the original PDF buffer for storage
      isImage: false,
    };
  } catch (error) {
    console.error("Error processing PDF:", error);
    throw error;
  } finally {
    tempFiles.forEach(cleanupTempFiles);
    try {
      fs.rmdirSync(TEMP_DIR);
    } catch (error) {
      console.log("Note: Temp directory not empty or already removed");
    }
  }
};

export const processDocument = async (buffer, mimeType) => {
  const supportedImageTypes = ["image/jpeg", "image/png", "image/webp"];

  if (mimeType === "application/pdf") {
    return processPDF(buffer);
  } else if (supportedImageTypes.includes(mimeType)) {
    return processImage(buffer);
  } else {
    throw new Error(`Unsupported file type: ${mimeType}`);
  }
};
