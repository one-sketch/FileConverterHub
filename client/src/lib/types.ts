import { z } from 'zod';

export const fileSchema = z.object({
  file: z.instanceof(File)
    .refine(file => file.size <= 25 * 1024 * 1024, {
      message: 'File size must be less than 25MB'
    })
    .refine(file => {
      const extension = file.name.split('.').pop()?.toLowerCase();
      return extension === 'pdf' || extension === 'txt';
    }, {
      message: 'Only PDF and TXT files are supported'
    })
});

export const youtubeUrlSchema = z.object({
  url: z.string()
    .url('Please enter a valid URL')
    .refine(url => url.includes('youtube.com') || url.includes('youtu.be'), {
      message: 'Must be a valid YouTube URL'
    })
});

export type FileUpload = z.infer<typeof fileSchema>;
export type YouTubeUrl = z.infer<typeof youtubeUrlSchema>;

export interface ConversionResult {
  id: number;
  convertedFileName: string;
  downloadUrl: string;
}
