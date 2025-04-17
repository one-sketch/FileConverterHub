import { pgTable, text, serial, integer, boolean, json } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const conversions = pgTable("conversions", {
  id: serial("id").primaryKey(),
  originalFileName: text("original_file_name").notNull(),
  convertedFileName: text("converted_file_name").notNull(),
  conversionType: text("conversion_type").notNull(), // pdf-to-txt, txt-to-pdf, youtube-to-mp4, heic-to-png
  status: text("status").notNull().default("pending"), // pending, processing, completed, failed
  filePath: text("file_path"),
  error: text("error"),
  createdAt: text("created_at").notNull().default("NOW()"),
  originalFileSize: integer("original_file_size"), // Size in bytes
  convertedFileSize: integer("converted_file_size"), // Size in bytes
  conversionTimeMs: integer("conversion_time_ms"), // Time in milliseconds
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export const insertConversionSchema = createInsertSchema(conversions).pick({
  originalFileName: true,
  conversionType: true,
}).extend({
  file: z.instanceof(File).optional(),
  youtubeUrl: z.string().url().optional(),
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

export type InsertConversion = z.infer<typeof insertConversionSchema>;
export type Conversion = typeof conversions.$inferSelect;

export type ConversionType = "pdf-to-txt" | "txt-to-pdf" | "youtube-to-mp4" | "heic-to-png";

export const youtubeUrlSchema = z.object({
  url: z.string().url().refine(
    (url) => url.includes("youtube.com") || url.includes("youtu.be"),
    { message: "Must be a valid YouTube URL" }
  )
});

export type YoutubeUrl = z.infer<typeof youtubeUrlSchema>;
