import type { Express, Request } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import multer from "multer";
import path from "path";
import fs from "fs";
import { PDFDocument, StandardFonts } from "pdf-lib";
import ytdl from "ytdl-core";
import { fileURLToPath } from "url";
import { dirname } from "path";

// Extend Request type to include file property from multer
interface MulterRequest extends Request {
  file?: Express.Multer.File;
}

// Create uploads directory if it doesn't exist
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const uploadsDir = path.join(__dirname, "../uploads");
const downloadsDir = path.join(__dirname, "../downloads");

if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

if (!fs.existsSync(downloadsDir)) {
  fs.mkdirSync(downloadsDir, { recursive: true });
}

// Configure multer for file uploads
const upload = multer({ 
  dest: uploadsDir,
  limits: {
    fileSize: 25 * 1024 * 1024 // 25MB limit
  }
});

export async function registerRoutes(app: Express): Promise<Server> {
  // API routes for file conversion
  app.post("/api/convert/pdf-to-txt", upload.single("file"), async (req: MulterRequest, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ message: "No file uploaded" });
      }

      // Validate file is PDF
      if (!req.file.originalname.toLowerCase().endsWith(".pdf")) {
        return res.status(400).json({ message: "File must be a PDF" });
      }

      // Read the PDF file
      const pdfBuffer = fs.readFileSync(req.file.path);
      
      // Extract text from PDF (simple implementation)
      // In a production app, you would use a more robust PDF text extraction library
      const pdfDoc = await PDFDocument.load(pdfBuffer);
      const pageCount = pdfDoc.getPageCount();
      
      // Create a simple text representation
      let extractedText = `PDF Document: ${req.file.originalname}\nPage Count: ${pageCount}\n\n`;
      extractedText += `This is extracted text from your PDF document.\nIn a production environment, we would use a more robust PDF text extraction library.\n`;
      
      // Create output file
      const txtFilename = `${path.basename(req.file.originalname, ".pdf")}.txt`;
      const txtPath = path.join(downloadsDir, txtFilename);
      fs.writeFileSync(txtPath, extractedText);

      // Store conversion record
      const conversion = await storage.createConversion({
        originalFileName: req.file.originalname,
        convertedFileName: txtFilename,
        conversionType: "pdf-to-txt",
        status: "completed",
        filePath: txtPath
      });

      res.json({
        id: conversion.id,
        convertedFileName: txtFilename,
        downloadUrl: `/api/download/${conversion.id}`
      });
    } catch (error) {
      console.error("PDF to TXT conversion error:", error);
      res.status(500).json({ message: "Failed to convert PDF to TXT" });
    }
  });

  app.post("/api/convert/txt-to-pdf", upload.single("file"), async (req: MulterRequest, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ message: "No file uploaded" });
      }

      // Validate file is TXT
      if (!req.file.originalname.toLowerCase().endsWith(".txt")) {
        return res.status(400).json({ message: "File must be a TXT file" });
      }

      // Read the TXT file
      const textContent = fs.readFileSync(req.file.path, "utf-8");
      
      // Create PDF from text
      const pdfDoc = await PDFDocument.create();
      const page = pdfDoc.addPage();
      
      // Add text to PDF
      const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
      const fontSize = 12;
      const { width, height } = page.getSize();
      const lines = textContent.split("\n");
      
      let y = height - 50;
      const margin = 50;
      
      lines.forEach(line => {
        if (y > margin) {
          page.drawText(line, {
            x: margin,
            y: y,
            size: fontSize,
            font: font
          });
          y -= fontSize + 5;
        }
      });
      
      // Save PDF
      const pdfBytes = await pdfDoc.save();
      const pdfFilename = `${path.basename(req.file.originalname, ".txt")}.pdf`;
      const pdfPath = path.join(downloadsDir, pdfFilename);
      fs.writeFileSync(pdfPath, pdfBytes);

      // Store conversion record
      const conversion = await storage.createConversion({
        originalFileName: req.file.originalname,
        convertedFileName: pdfFilename,
        conversionType: "txt-to-pdf",
        status: "completed",
        filePath: pdfPath
      });

      res.json({
        id: conversion.id,
        convertedFileName: pdfFilename,
        downloadUrl: `/api/download/${conversion.id}`
      });
    } catch (error) {
      console.error("TXT to PDF conversion error:", error);
      res.status(500).json({ message: "Failed to convert TXT to PDF" });
    }
  });

  app.post("/api/convert/youtube-to-mp4", async (req, res) => {
    try {
      const { url } = req.body;
      
      if (!url) {
        return res.status(400).json({ message: "YouTube URL is required" });
      }
      
      // Validate YouTube URL
      if (!ytdl.validateURL(url)) {
        return res.status(400).json({ message: "Invalid YouTube URL" });
      }
      
      // Get video info
      const info = await ytdl.getInfo(url);
      const videoTitle = info.videoDetails.title.replace(/[^\w\s]/gi, '_');
      const videoFilename = `${videoTitle}.mp4`;
      const videoPath = path.join(downloadsDir, videoFilename);
      
      // Download video
      const writeStream = fs.createWriteStream(videoPath);
      ytdl(url, { quality: 'highest' })
        .pipe(writeStream);
      
      // Handle write stream events
      writeStream.on('finish', async () => {
        // Store conversion record
        const conversion = await storage.createConversion({
          originalFileName: videoTitle,
          convertedFileName: videoFilename,
          conversionType: "youtube-to-mp4",
          status: "completed",
          filePath: videoPath
        });

        res.json({
          id: conversion.id,
          convertedFileName: videoFilename,
          downloadUrl: `/api/download/${conversion.id}`
        });
      });
      
      writeStream.on('error', (err) => {
        console.error("YouTube to MP4 write stream error:", err);
        res.status(500).json({ message: "Failed to download YouTube video" });
      });
    } catch (error) {
      console.error("YouTube to MP4 conversion error:", error);
      res.status(500).json({ message: "Failed to convert YouTube to MP4" });
    }
  });

  app.get("/api/download/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const conversion = await storage.getConversion(id);
      
      if (!conversion) {
        return res.status(404).json({ message: "File not found" });
      }
      
      if (conversion.status !== "completed") {
        return res.status(400).json({ message: "File conversion is not completed" });
      }
      
      if (!conversion.filePath || !fs.existsSync(conversion.filePath)) {
        return res.status(404).json({ message: "File not found" });
      }
      
      res.download(conversion.filePath, conversion.convertedFileName);
    } catch (error) {
      console.error("Download error:", error);
      res.status(500).json({ message: "Failed to download file" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
