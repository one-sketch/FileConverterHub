import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { AlertTriangle } from 'lucide-react';

interface ErrorMessageProps {
  message: string;
  onRetry: () => void;
}

const ErrorMessage: React.FC<ErrorMessageProps> = ({ message, onRetry }) => {
  return (
    <Card>
      <CardContent className="p-6">
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center h-16 w-16 rounded-full bg-red-100 text-red-500 mb-4">
            <AlertTriangle className="h-8 w-8" />
          </div>
          <h3 className="text-lg font-semibold mb-1">Conversion Failed</h3>
          <p className="text-gray-600">{message || 'There was an error processing your file. Please try again.'}</p>
        </div>
        
        <div className="flex justify-center">
          <Button 
            onClick={onRetry}
            className="px-6"
          >
            Try Again
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default ErrorMessage;
