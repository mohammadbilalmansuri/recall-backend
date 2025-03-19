import fs from "fs";
import axios from "axios";
import pdf from "pdf-parse";
import Tesseract from "tesseract.js";
import { fromBuffer } from "pdf2pic";
import { tmpdir } from "os";

const TEMP_DIR = tmpdir();

const downloadPdfAsBuffer = async (url: string): Promise<Buffer> => {
  try {
    const response = await axios.get(url, { responseType: "arraybuffer" });
    return Buffer.from(response.data);
  } catch {
    throw new Error("Server could not retrieve the document content.");
  }
};

const convertPdfToImages = async (pdfBuffer: Buffer): Promise<string[]> => {
  const converter = fromBuffer(pdfBuffer, {
    density: 300,
    savePath: TEMP_DIR,
    format: "png",
  });

  const { numpages } = await pdf(pdfBuffer);

  const imagePromises = Array.from({ length: numpages }, (_, i) =>
    converter(i + 1).catch(() => null)
  );

  const images = (await Promise.all(imagePromises)).filter(Boolean);
  return images.map((img) => img?.path).filter(Boolean) as string[];
};

const extractTextFromImage = async (imagePath: string): Promise<string> => {
  try {
    const { data } = await Tesseract.recognize(imagePath, "eng");
    return data.text.trim();
  } catch {
    return "";
  } finally {
    if (fs.existsSync(imagePath)) fs.unlinkSync(imagePath);
  }
};

const cleanText = (text: string): string =>
  text
    .replace(/\r/g, "")
    .replace(/ {2,}/g, " ")
    .replace(/\n{3,}/g, "\n\n")
    .trim();

const getPdfData = async (input: string): Promise<string> => {
  let pdfBuffer: Buffer;

  try {
    pdfBuffer = input.startsWith("http")
      ? await downloadPdfAsBuffer(input)
      : fs.readFileSync(input);

    const pdfData = await pdf(pdfBuffer);
    if (pdfData.text.trim()) return cleanText(pdfData.text);

    const images = await convertPdfToImages(pdfBuffer);
    if (images.length === 0)
      return "Server could not retrieve the document content.";

    const ocrTexts = await Promise.all(images.map(extractTextFromImage));
    const extractedText = ocrTexts.filter(Boolean).join("\n");

    return extractedText
      ? cleanText(extractedText)
      : "Server could not retrieve the document content.";
  } catch {
    return "Server could not retrieve the document content.";
  }
};

export default getPdfData;
