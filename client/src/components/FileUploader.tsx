import React, { useCallback, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { Upload, X } from 'lucide-react';

interface FileUploaderProps {
  selectedFile: File | null;
  onFileSelected: (file: File | null) => void;
}

const FileUploader: React.FC<FileUploaderProps> = ({ selectedFile, onFileSelected }) => {
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files && files.length > 0) {
      validateAndSetFile(files[0]);
    }
  };
  
  const validateAndSetFile = (file: File) => {
    // Check file size (25MB limit)
    if (file.size > 25 * 1024 * 1024) {
      toast({
        title: 'File too large',
        description: 'File size exceeds the 25MB limit. Please upload a smaller file.',
        variant: 'destructive',
      });
      return;
    }
    
    // Check file type
    const fileType = file.name.split('.').pop()?.toLowerCase();
    if (fileType !== 'pdf' && fileType !== 'txt') {
      toast({
        title: 'Unsupported file format',
        description: 'Please upload a PDF or TXT file.',
        variant: 'destructive',
      });
      return;
    }
    
    onFileSelected(file);
  };
  
  const handleDragOver = useCallback((event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.currentTarget.classList.add('border-primary');
  }, []);
  
  const handleDragLeave = useCallback((event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.currentTarget.classList.remove('border-primary');
  }, []);
  
  const handleDrop = useCallback((event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.currentTarget.classList.remove('border-primary');
    
    if (event.dataTransfer.files.length > 0) {
      validateAndSetFile(event.dataTransfer.files[0]);
    }
  }, []);
  
  const handleRemoveFile = () => {
    onFileSelected(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };
  
  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };
  
  return (
    <Card>
      <CardContent className="p-6">
        <div
          className={`border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:bg-gray-50 transition cursor-pointer ${
            selectedFile ? 'bg-gray-50' : ''
          }`}
          onClick={() => fileInputRef.current?.click()}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          <input 
            type="file" 
            ref={fileInputRef}
            className="hidden" 
            onChange={handleFileChange}
            accept=".pdf,.txt"
          />
          
          <div className="mb-4">
            <Upload className="h-12 w-12 text-primary mx-auto" />
          </div>
          <h3 className="text-lg font-semibold mb-1">Drag & drop your file here</h3>
          <p className="text-gray-500 mb-4">or click to browse</p>
          <div className="flex justify-center">
            <span className="inline-flex text-xs bg-gray-100 px-2.5 py-1 rounded-full text-gray-600">
              Max file size: 25MB
            </span>
          </div>
        </div>
        
        {selectedFile && (
          <div className="mt-4">
            <div className="flex items-center p-3 bg-blue-50 rounded-lg text-blue-700">
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                className="h-5 w-5 mr-3" 
                fill="none" 
                viewBox="0 0 24 24" 
                stroke="currentColor" 
                strokeWidth={2}
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" 
                />
              </svg>
              <div className="flex-grow">
                <div className="font-medium">{selectedFile.name}</div>
                <div className="text-sm text-blue-600">{formatFileSize(selectedFile.size)}</div>
              </div>
              <Button 
                variant="ghost" 
                size="icon"
                onClick={(e) => {
                  e.stopPropagation();
                  handleRemoveFile();
                }}
                className="text-gray-500 hover:text-red-500 transition"
              >
                <X className="h-5 w-5" />
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default FileUploader;
