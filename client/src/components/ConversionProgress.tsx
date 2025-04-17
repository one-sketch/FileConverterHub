import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';

interface ConversionProgressProps {
  progress: number;
}

const ConversionProgress: React.FC<ConversionProgressProps> = ({ progress }) => {
  return (
    <Card>
      <CardContent className="p-6">
        <h3 className="text-lg font-semibold mb-4">Converting your file...</h3>
        
        <div className="mb-6">
          <Progress value={progress} className="h-2.5" />
          <div className="flex justify-between mt-2 text-sm text-gray-600">
            <span>{Math.round(progress)}%</span>
            <span>Processing...</span>
          </div>
        </div>
        
        <div className="text-sm text-gray-600">
          <p>This may take a few moments depending on the file size and complexity.</p>
        </div>
      </CardContent>
    </Card>
  );
};

export default ConversionProgress;
