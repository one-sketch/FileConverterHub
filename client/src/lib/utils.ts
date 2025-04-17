import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Formats a file size in bytes to a human-readable string
 * @param bytes The file size in bytes
 * @param decimals Number of decimal places to include
 * @returns Formatted string (e.g., "1.5 MB")
 */
export function formatFileSize(bytes: number | undefined, decimals = 2): string {
  if (!bytes || bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
  
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
}

/**
 * Formats milliseconds to a human-readable string
 * @param ms The time in milliseconds
 * @returns Formatted string (e.g., "1.2 seconds" or "34 milliseconds")
 */
export function formatTime(ms: number | undefined): string {
  if (!ms) return 'N/A';
  
  if (ms < 1000) {
    return `${ms} milliseconds`;
  } else if (ms < 60000) {
    return `${(ms / 1000).toFixed(1)} seconds`;
  } else {
    return `${(ms / 60000).toFixed(1)} minutes`;
  }
}

/**
 * Estimates download time based on file size and connection speed
 * @param fileSizeBytes File size in bytes
 * @param connectionSpeedMbps Average connection speed in Mbps (default: 10)
 * @returns Estimated download time in seconds
 */
export function estimateDownloadTime(fileSizeBytes: number | undefined, connectionSpeedMbps = 10): number | undefined {
  if (!fileSizeBytes) return undefined;
  
  // Convert bytes to bits
  const fileSizeBits = fileSizeBytes * 8;
  
  // Convert Mbps to bps
  const connectionSpeedBps = connectionSpeedMbps * 1000000;
  
  // Calculate time in seconds
  return fileSizeBits / connectionSpeedBps;
}

/**
 * Generates a user-friendly estimate description
 * @param fileSize File size in bytes
 * @returns String describing the estimated conversion time
 */
export function getConversionTimeEstimate(fileSize: number | undefined): string {
  if (!fileSize) return 'Unknown';
  
  if (fileSize < 500000) { // < 500KB
    return 'A few seconds';
  } else if (fileSize < 5000000) { // < 5MB
    return 'Less than 30 seconds';
  } else if (fileSize < 25000000) { // < 25MB
    return 'About 1 minute';
  } else {
    return 'Several minutes';
  }
}
