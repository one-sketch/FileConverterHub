import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { FileText, File, Youtube } from 'lucide-react';

const SupportedFormats: React.FC = () => {
  return (
    <Card>
      <CardContent className="p-6">
        <h3 className="text-lg font-semibold mb-4">Supported Formats</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 bg-gray-50 rounded-lg">
            <div className="flex items-center mb-2">
              <File className="h-5 w-5 text-red-500 mr-2" />
              <h4 className="font-medium">PDF</h4>
            </div>
            <p className="text-sm text-gray-600">Support for standard PDF files up to 25MB.</p>
          </div>
          <div className="p-4 bg-gray-50 rounded-lg">
            <div className="flex items-center mb-2">
              <FileText className="h-5 w-5 text-blue-500 mr-2" />
              <h4 className="font-medium">TXT</h4>
            </div>
            <p className="text-sm text-gray-600">Plain text files with UTF-8 encoding up to 25MB.</p>
          </div>
          <div className="p-4 bg-gray-50 rounded-lg">
            <div className="flex items-center mb-2">
              <Youtube className="h-5 w-5 text-red-500 mr-2" />
              <h4 className="font-medium">YouTube</h4>
            </div>
            <p className="text-sm text-gray-600">Standard YouTube video URLs for MP4 conversion.</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default SupportedFormats;
