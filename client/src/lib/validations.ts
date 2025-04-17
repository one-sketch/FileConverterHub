import { z } from 'zod';

// Validate file upload
export const validateFileUpload = (file: File | null): string | null => {
  if (!file) return 'No file selected';
  
  // Check file size (25MB limit)
  if (file.size > 25 * 1024 * 1024) {
    return 'File size exceeds the 25MB limit. Please upload a smaller file.';
  }
  
  // Check file type
  const fileExtension = file.name.split('.').pop()?.toLowerCase();
  if (fileExtension !== 'pdf' && fileExtension !== 'txt') {
    return 'Unsupported file format. Please upload a PDF or TXT file.';
  }
  
  return null;
};

// Validate YouTube URL
export const validateYoutubeUrl = (url: string): string | null => {
  if (!url.trim()) return 'Please enter a YouTube URL';
  
  try {
    const result = z.string()
      .url('Please enter a valid URL')
      .refine(url => url.includes('youtube.com') || url.includes('youtu.be'), {
        message: 'Must be a valid YouTube URL'
      })
      .safeParse(url);
    
    if (!result.success) {
      return result.error.errors[0].message;
    }
    
    return null;
  } catch (error) {
    return 'Invalid YouTube URL';
  }
};

// Format file size for display
export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};
