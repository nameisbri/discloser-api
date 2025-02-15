import { fromBuffer } from "pdf2pic";
import Tesseract from "tesseract.js";
import fs from "fs";
import { PDFDocument } from "pdf-lib";

const options = {
  density: 100,
  saveFilename: "page",
  savePath: "./temp/images", // Temporary folder for images
  format: "png",
  width: 800,
  height: 1200,
};

const parsePDF = async (pdfBuffer) => {
  try {
    // Ensure the temp/images directory exists
    if (!fs.existsSync("./temp/images")) {
      fs.mkdirSync("./temp/images", { recursive: true });
    }

    // Load the PDF and get the total number of pages
    const pdfDoc = await PDFDocument.load(pdfBuffer);
    const totalPages = pdfDoc.getPageCount();

    // Convert PDF to images
    const convert = fromBuffer(pdfBuffer, options);
    const extractedTexts = [];

    for (let page = 1; page <= totalPages; page++) {
      console.log(`Converting page ${page} to image...`);
      const image = await convert(page, { responseType: "image" });

      // Extract text from image
      const {
        data: { text },
      } = await Tesseract.recognize(image.path, "eng");
      console.log(`Text from page ${page}:\n`, text);

      // Save extracted text
      extractedTexts.push({ page, text });

      // Delete temporary image
      fs.unlinkSync(image.path);
      console.log(`Deleted temporary image: ${image.path}`);
    }

    return extractedTexts;
  } catch (error) {
    console.error("Error parsing PDF:", error);
    throw error;
  }
};

export default parsePDF;
