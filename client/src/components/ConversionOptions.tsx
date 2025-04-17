import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { FileText, File, Youtube, Image } from 'lucide-react';
import { ConversionType } from '@shared/schema';

interface ConversionOptionsProps {
  selectedFile: File | null;
  youtubeUrl: string;
  onYoutubeUrlChange: (url: string) => void;
  onConvert: () => void;
  conversionType: ConversionType | null;
  isPending: boolean;
}

const ConversionOptions: React.FC<ConversionOptionsProps> = ({
  selectedFile,
  youtubeUrl,
  onYoutubeUrlChange,
  onConvert,
  conversionType,
  isPending
}) => {
  const isPdfFile = selectedFile?.name.toLowerCase().endsWith('.pdf');
  const isTxtFile = selectedFile?.name.toLowerCase().endsWith('.txt');
  const isHeicFile = selectedFile?.name.toLowerCase().endsWith('.heic');
  
  const isYoutubeUrlValid = youtubeUrl.trim() !== '' && 
    (youtubeUrl.includes('youtube.com') || youtubeUrl.includes('youtu.be'));
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {/* PDF to TXT Conversion */}
      <Card className="overflow-hidden transition hover:shadow-lg">
        <CardContent className="p-6">
          <div className="flex items-center mb-4">
            <div className="h-12 w-12 flex items-center justify-center rounded-full bg-blue-100 text-primary">
              <FileText className="h-6 w-6" />
            </div>
            <h3 className="ml-4 text-lg font-semibold">PDF to TXT</h3>
          </div>
          <p className="text-gray-600 mb-6">Extract all text content from your PDF documents into plain text format.</p>
          <Button 
            className="w-full py-6"
            onClick={onConvert}
            disabled={!isPdfFile || isPending}
          >
            Convert to TXT
          </Button>
        </CardContent>
      </Card>

      {/* TXT to PDF Conversion */}
      <Card className="overflow-hidden transition hover:shadow-lg">
        <CardContent className="p-6">
          <div className="flex items-center mb-4">
            <div className="h-12 w-12 flex items-center justify-center rounded-full bg-red-100 text-red-600">
              <File className="h-6 w-6" />
            </div>
            <h3 className="ml-4 text-lg font-semibold">TXT to PDF</h3>
          </div>
          <p className="text-gray-600 mb-6">Convert your plain text files into well-formatted PDF documents.</p>
          <Button 
            className="w-full py-6"
            onClick={onConvert}
            disabled={!isTxtFile || isPending}
          >
            Convert to PDF
          </Button>
        </CardContent>
      </Card>

      {/* HEIC to PNG Conversion */}
      <Card className="overflow-hidden transition hover:shadow-lg">
        <CardContent className="p-6">
          <div className="flex items-center mb-4">
            <div className="h-12 w-12 flex items-center justify-center rounded-full bg-green-100 text-green-600">
              <Image className="h-6 w-6" />
            </div>
            <h3 className="ml-4 text-lg font-semibold">HEIC to PNG</h3>
          </div>
          <p className="text-gray-600 mb-6">Convert iPhone/iOS HEIC images to standard PNG format.</p>
          <Button 
            className="w-full py-6"
            onClick={onConvert}
            disabled={!isHeicFile || isPending}
          >
            Convert to PNG
          </Button>
        </CardContent>
      </Card>

      {/* YouTube to MP4 Conversion */}
      <Card className="overflow-hidden transition hover:shadow-lg">
        <CardContent className="p-6">
          <div className="flex items-center mb-4">
            <div className="h-12 w-12 flex items-center justify-center rounded-full bg-red-100 text-red-600">
              <Youtube className="h-6 w-6" />
            </div>
            <h3 className="ml-4 text-lg font-semibold">YouTube to MP4</h3>
          </div>
          <p className="text-gray-600 mb-5">Download videos from YouTube as MP4 files.</p>
          
          <div className="flex flex-col sm:flex-row gap-3 mb-4">
            <Input 
              type="text" 
              placeholder="Paste YouTube URL here" 
              value={youtubeUrl}
              onChange={(e) => onYoutubeUrlChange(e.target.value)}
              className="flex-grow py-6"
            />
            <Button 
              onClick={onConvert}
              disabled={!isYoutubeUrlValid || isPending}
              className="sm:w-auto w-full"
            >
              Download MP4
            </Button>
          </div>
          <div className="text-xs text-gray-500">
            By using this service, you confirm that you have the right to download this video and will comply with YouTube's terms of service.
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ConversionOptions;
