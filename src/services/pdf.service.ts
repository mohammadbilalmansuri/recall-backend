import fs from "fs";
import pdf from "pdf-parse";
import Tesseract from "tesseract.js";
import { fromPath } from "pdf2pic";

const loadPdfBuffer = (filePath: string): Buffer => {
  return fs.readFileSync(filePath);
};

const convertPdfToImages = async (filePath: string): Promise<string[]> => {
  const converter = fromPath(filePath, {
    density: 300,
    savePath: "./",
    format: "png",
  });

  const pages = await pdf(loadPdfBuffer(filePath));
  const imagePaths: string[] = [];

  for (let i = 1; i <= pages.numpages; i++) {
    const image = await converter(i);
    imagePaths.push(image.path!);
  }
  return imagePaths;
};

const extractTextFromImage = async (imagePath: string): Promise<string> => {
  const { data } = await Tesseract.recognize(imagePath, "eng");
  fs.unlinkSync(imagePath);
  return data.text;
};

const cleanText = (text: string): string => {
  return text
    .replace(/\s+/g, " ")
    .replace(/[^a-zA-Z0-9.,!?'"()\-\s]/g, "")
    .trim();
};

const getPdfData = async (filePath: string): Promise<string> => {
  try {
    const pdfBuffer = loadPdfBuffer(filePath);
    const pdfData = await pdf(pdfBuffer);
    if (pdfData.text.trim()) {
      return cleanText(pdfData.text);
    }

    console.log("No extractable text found, using OCR...");

    // Step 2: Convert PDF to images & apply OCR
    const images = await convertPdfToImages(filePath);
    const ocrTexts = await Promise.all(images.map(extractTextFromImage));

    return cleanText(ocrTexts.join("\n"));
  } catch (error) {
    console.error("Error processing PDF:", error);
    return "Error processing PDF!";
  }
};

export default getPdfData;
