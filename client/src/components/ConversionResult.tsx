import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle, Download } from 'lucide-react';
import { ConversionType } from '@shared/schema';

interface ConversionResultProps {
  fileName: string;
  downloadUrl: string;
  conversionType: ConversionType;
  onNewConversion: () => void;
}

const ConversionResult: React.FC<ConversionResultProps> = ({
  fileName,
  downloadUrl,
  conversionType,
  onNewConversion
}) => {
  const getResultDescription = () => {
    switch (conversionType) {
      case 'pdf-to-txt':
        return 'Your PDF has been converted to TXT successfully.';
      case 'txt-to-pdf':
        return 'Your TXT file has been converted to PDF successfully.';
      case 'youtube-to-mp4':
        return 'Your YouTube URL request has been processed. A notice file has been generated.';
      default:
        return 'Your file has been successfully converted.';
    }
  };
  
  const getButtonText = () => {
    if (conversionType === 'youtube-to-mp4') {
      return 'Download Notice';
    }
    return 'Download File';
  };

  return (
    <Card>
      <CardContent className="p-6">
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center h-16 w-16 rounded-full bg-green-100 text-green-600 mb-4">
            <CheckCircle className="h-8 w-8" />
          </div>
          <h3 className="text-lg font-semibold mb-1">Conversion Complete!</h3>
          <p className="text-gray-600">{getResultDescription()}</p>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Button 
            className="bg-green-600 hover:bg-green-700 gap-2"
            asChild
          >
            <a href={downloadUrl} download={fileName}>
              <Download className="h-4 w-4" /> {getButtonText()}
            </a>
          </Button>
          <Button 
            variant="outline"
            onClick={onNewConversion}
          >
            Convert Another File
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default ConversionResult;
