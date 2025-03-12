import fs from "fs";
import pdf from "pdf-parse";
import axios from "axios";
import Tesseract from "tesseract.js";
import { fromBuffer } from "pdf2pic";

const loadPdfBuffer = async (url: string): Promise<Buffer> => {
  if (url.startsWith("http")) {
    const response = await axios.get(url, { responseType: "arraybuffer" });
    return Buffer.from(response.data);
  } else {
    return fs.readFileSync(url);
  }
};

const convertPdfToImages = async (pdfBuffer: Buffer): Promise<string[]> => {
  const converter = fromBuffer(pdfBuffer, {
    density: 300,
    savePath: "./",
    format: "png",
  });
  const pages = await pdf(pdfBuffer);
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

const getPdfData = async (url: string): Promise<string> => {
  try {
    // Step 1: Load PDF
    const dataBuffer = await loadPdfBuffer(url);

    // Step 2: Try extracting text directly
    const pdfData = await pdf(dataBuffer);
    if (pdfData.text.trim()) {
      return cleanText(pdfData.text);
    }

    console.log("No extractable text found, using OCR...");

    // Step 3: Convert PDF to images & apply OCR
    const images = await convertPdfToImages(dataBuffer);
    const ocrTexts = await Promise.all(images.map(extractTextFromImage));

    return cleanText(ocrTexts.join("\n"));
  } catch (error) {
    console.error("Error processing PDF:", error);
    return "Error processing PDF!";
  }
};

export default getPdfData;
