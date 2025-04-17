import React from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import FileUploader from '@/components/FileUploader';
import ConversionOptions from '@/components/ConversionOptions';
import ConversionProgress from '@/components/ConversionProgress';
import ConversionResult from '@/components/ConversionResult';
import ErrorMessage from '@/components/ErrorMessage';
import SupportedFormats from '@/components/SupportedFormats';
import { useToast } from '@/hooks/use-toast';
import { useMutation } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';
import { ConversionType } from '@shared/schema';

const Home: React.FC = () => {
  const { toast } = useToast();
  const [selectedFile, setSelectedFile] = React.useState<File | null>(null);
  const [youtubeUrl, setYoutubeUrl] = React.useState<string>('');
  const [conversionType, setConversionType] = React.useState<ConversionType | null>(null);
  const [conversionState, setConversionState] = React.useState<'idle' | 'processing' | 'success' | 'error'>('idle');
  const [progress, setProgress] = React.useState<number>(0);
  const [conversionResult, setConversionResult] = React.useState<{
    id: number;
    convertedFileName: string;
    downloadUrl: string;
  } | null>(null);
  const [errorMessage, setErrorMessage] = React.useState<string>('');

  // Conversion Progress Simulation
  React.useEffect(() => {
    let progressInterval: NodeJS.Timeout;
    
    if (conversionState === 'processing') {
      progressInterval = setInterval(() => {
        setProgress(prevProgress => {
          const newProgress = prevProgress + Math.random() * 15;
          return newProgress >= 95 ? 95 : newProgress;
        });
      }, 500);
    }
    
    return () => {
      if (progressInterval) clearInterval(progressInterval);
    };
  }, [conversionState]);

  // File conversion mutations
  const pdfToTxtMutation = useMutation({
    mutationFn: async () => {
      if (!selectedFile) throw new Error('No file selected');
      
      const formData = new FormData();
      formData.append('file', selectedFile);
      
      const response = await fetch('/api/convert/pdf-to-txt', {
        method: 'POST',
        body: formData,
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to convert PDF to TXT');
      }
      
      return await response.json();
    },
    onSuccess: (data) => {
      setProgress(100);
      setConversionResult(data);
      setConversionState('success');
    },
    onError: (error: Error) => {
      setErrorMessage(error.message);
      setConversionState('error');
      toast({
        title: 'Conversion Failed',
        description: error.message,
        variant: 'destructive',
      });
    }
  });

  const txtToPdfMutation = useMutation({
    mutationFn: async () => {
      if (!selectedFile) throw new Error('No file selected');
      
      const formData = new FormData();
      formData.append('file', selectedFile);
      
      const response = await fetch('/api/convert/txt-to-pdf', {
        method: 'POST',
        body: formData,
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to convert TXT to PDF');
      }
      
      return await response.json();
    },
    onSuccess: (data) => {
      setProgress(100);
      setConversionResult(data);
      setConversionState('success');
    },
    onError: (error: Error) => {
      setErrorMessage(error.message);
      setConversionState('error');
      toast({
        title: 'Conversion Failed',
        description: error.message,
        variant: 'destructive',
      });
    }
  });

  const youtubeToMp4Mutation = useMutation({
    mutationFn: async () => {
      if (!youtubeUrl) throw new Error('No YouTube URL provided');
      
      const response = await apiRequest('POST', '/api/convert/youtube-to-mp4', { url: youtubeUrl });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to convert YouTube to MP4');
      }
      
      return await response.json();
    },
    onSuccess: (data) => {
      setProgress(100);
      setConversionResult(data);
      setConversionState('success');
    },
    onError: (error: Error) => {
      setErrorMessage(error.message);
      setConversionState('error');
      toast({
        title: 'Conversion Failed',
        description: error.message,
        variant: 'destructive',
      });
    }
  });

  const handleFileSelected = (file: File | null) => {
    setSelectedFile(file);
    
    if (file) {
      // Determine conversion type based on file extension
      if (file.name.toLowerCase().endsWith('.pdf')) {
        setConversionType('pdf-to-txt');
      } else if (file.name.toLowerCase().endsWith('.txt')) {
        setConversionType('txt-to-pdf');
      } else {
        setConversionType(null);
        toast({
          title: 'Unsupported File Format',
          description: 'Please upload a PDF or TXT file.',
          variant: 'destructive',
        });
      }
    } else {
      setConversionType(null);
    }
  };

  const handleYoutubeUrlChange = (url: string) => {
    setYoutubeUrl(url);
    if (url.trim()) {
      setConversionType('youtube-to-mp4');
    }
  };

  const handleConvert = () => {
    setConversionState('processing');
    setProgress(0);
    
    switch (conversionType) {
      case 'pdf-to-txt':
        pdfToTxtMutation.mutate();
        break;
      case 'txt-to-pdf':
        txtToPdfMutation.mutate();
        break;
      case 'youtube-to-mp4':
        youtubeToMp4Mutation.mutate();
        break;
      default:
        setConversionState('error');
        setErrorMessage('Please select a valid file or provide a YouTube URL');
    }
  };

  const handleRetry = () => {
    setConversionState('idle');
    handleConvert();
  };

  const handleNewConversion = () => {
    setSelectedFile(null);
    setYoutubeUrl('');
    setConversionType(null);
    setConversionState('idle');
    setProgress(0);
    setConversionResult(null);
    setErrorMessage('');
  };

  const isPending = 
    pdfToTxtMutation.isPending || 
    txtToPdfMutation.isPending || 
    youtubeToMp4Mutation.isPending;

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-grow py-8 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="max-w-5xl mx-auto space-y-8">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-2">File Conversion Made Simple</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Convert between various file formats quickly and easily. No account required.
            </p>
          </div>

          <FileUploader 
            selectedFile={selectedFile} 
            onFileSelected={handleFileSelected} 
          />

          <ConversionOptions 
            selectedFile={selectedFile}
            youtubeUrl={youtubeUrl}
            onYoutubeUrlChange={handleYoutubeUrlChange}
            onConvert={handleConvert}
            conversionType={conversionType}
            isPending={isPending}
          />
          
          {conversionState === 'processing' && (
            <ConversionProgress progress={progress} />
          )}
          
          {conversionState === 'success' && conversionResult && (
            <ConversionResult 
              fileName={conversionResult.convertedFileName}
              downloadUrl={conversionResult.downloadUrl}
              conversionType={conversionType || 'pdf-to-txt'}
              onNewConversion={handleNewConversion}
            />
          )}
          
          {conversionState === 'error' && (
            <ErrorMessage 
              message={errorMessage} 
              onRetry={handleRetry} 
            />
          )}

          <SupportedFormats />
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Home;
