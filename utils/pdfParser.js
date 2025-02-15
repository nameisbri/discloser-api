import { PDFDocument } from "pdf-lib";
import { fromBuffer } from "pdf2pic";
import Tesseract from "tesseract.js";
import fs from "fs";
import { parse } from "path";

if (!fs.existsSync("./utils/images")) {
  fs.mkdirSync("./utils/images");
}

// Options for converting PDF to images
const options = {
  density: 100, // Image quality
  saveFilename: "page", // Prefix for saved images
  savePath: "./utils/images", // Folder to save images
  format: "png", // Image format
  width: 800, // Image width
  height: 1200, // Image height
};

/**
 * Extracts text from a PDF using OCR.
 * @param {string} pdfPath - Path to the PDF file.
 * @returns {Promise<Array<{ page: number, text: string }>>} - Array of extracted text for each page.
 */
const parseTest = async (pdfPath) => {
  try {
    // Read the PDF file
    const pdfBuffer = fs.readFileSync(pdfPath);

    // Load the PDF and get the total number of pages
    const pdfDoc = await PDFDocument.load(pdfBuffer);
    const totalPages = pdfDoc.getPageCount();
    console.log(`Total pages in PDF: ${totalPages}`);

    // Initialize pdf2pic
    const convert = fromBuffer(pdfBuffer, options);

    // Array to store extracted text for each page
    const extractedTexts = [];

    // Loop through all pages
    for (let page = 1; page <= totalPages; page++) {
      console.log(`Converting page ${page} to image...`);
      const image = await convert(page, { responseType: "image" });

      console.log(`Image saved at: ${image.path}`);

      // Perform OCR on the image
      const {
        data: { text },
      } = await Tesseract.recognize(image.path, "eng");
      console.log(`Text from page ${page}:\n`, text);

      // Save the extracted text for this page
      extractedTexts.push({ page, text });
    }

    // Return the extracted texts
    return extractedTexts;
  } catch (error) {
    console.error("Error processing PDF:", error);
    throw error; // Re-throw the error for handling in the calling code
  }
};

export default parseTest;
