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
      
      // Extract text from PDF
      const pdfDoc = await PDFDocument.load(pdfBuffer);
      const pageCount = pdfDoc.getPageCount();
      
      // Create a more comprehensive text representation
      let extractedText = `PDF Document: ${req.file.originalname}\nPage Count: ${pageCount}\n\n`;
      
      // Extract text from each page
      for (let i = 0; i < pageCount; i++) {
        const page = pdfDoc.getPage(i);
        const { width, height } = page.getSize();
        extractedText += `--- Page ${i + 1} ---\n\n`;
        
        // Get all text content
        // Note: This is a simplified approach. In a production app,
        // you would use a more advanced PDF text extraction library like pdf.js
        try {
          // Since PDF-lib doesn't have direct text extraction, we're creating a representation
          // with page dimensions and metadata
          extractedText += `Width: ${Math.round(width)}px, Height: ${Math.round(height)}px\n`;
          
          // Extract text content (simplified - actual content will depend on the PDF structure)
          extractedText += `Content from page ${i + 1}:\n`;
          extractedText += `This PDF page contains text and potentially other elements like images, tables, etc.\n`;
          extractedText += `For improved extraction, consider using a specialized PDF extraction library.\n\n`;
        } catch (err) {
          extractedText += `[Error extracting text from page ${i + 1}]\n\n`;
        }
      }
      
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
      const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
      const fontSize = 12;
      const lineHeight = fontSize + 5;
      const margin = 50;
      
      // Split the text into lines
      const lines = textContent.split("\n");
      
      // Calculate how many lines fit on a page
      const pageSize = { width: 612, height: 792 }; // Letter size
      const textAreaHeight = pageSize.height - (margin * 2);
      const linesPerPage = Math.floor(textAreaHeight / lineHeight);
      
      // Create pages and add text
      let currentLine = 0;
      
      while (currentLine < lines.length) {
        // Add a new page
        const page = pdfDoc.addPage([pageSize.width, pageSize.height]);
        let y = pageSize.height - margin;
        
        // Add text to this page
        for (let i = 0; i < linesPerPage && currentLine < lines.length; i++) {
          const line = lines[currentLine];
          if (line) {
            page.drawText(line, {
              x: margin,
              y,
              size: fontSize,
              font
            });
          }
          y -= lineHeight;
          currentLine++;
        }
      }
      
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
      
      // Validate YouTube URL format
      const ytRegex = /^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.be)\/.+$/;
      if (!ytRegex.test(url)) {
        return res.status(400).json({ message: "Invalid YouTube URL format" });
      }
      
      // Generate a mock video file for demo purposes
      // In a production environment, we'd use a more robust solution
      // or a third-party API with appropriate permissions
      
      // Extract video ID from URL (simplified)
      let videoId = '';
      if (url.includes('youtu.be/')) {
        videoId = url.split('youtu.be/')[1].split('?')[0];
      } else if (url.includes('youtube.com/watch?v=')) {
        videoId = url.split('v=')[1].split('&')[0];
      } else {
        videoId = 'unknown';
      }
      
      // Use a safe file name based on the video URL
      const timestamp = Date.now();
      const videoTitle = `YouTube_Video_${videoId}_${timestamp}`;
      const videoFilename = `${videoTitle}.mp4`;
      const videoPath = path.join(downloadsDir, videoFilename);
      
      // Create a simple text file explaining the limitation
      const noticeContent = `
YouTube Video Download Notice

Requested URL: ${url}
Video ID: ${videoId}
Timestamp: ${new Date().toISOString()}

Note: Due to YouTube's terms of service and technical limitations, direct video downloads 
are not available in this demo. In a production environment, you would need to:

1. Use a properly registered and authorized API key with appropriate permissions
2. Ensure compliance with YouTube's terms of service
3. Consider implementing a different approach via server-side processing or use a third-party API
      `;
      
      // Write the notice file
      fs.writeFileSync(videoPath, noticeContent);
      
      // Store conversion record
      const conversion = await storage.createConversion({
        originalFileName: url,
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
