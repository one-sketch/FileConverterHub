import React from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

const HowItWorks: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-grow py-8 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="max-w-5xl mx-auto space-y-8">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-2">How FileFlux Works</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Learn how our file conversion service operates and what makes it simple and secure.
            </p>
          </div>

          <div className="bg-white rounded-xl shadow-md p-6 space-y-6">
            <section>
              <h3 className="text-xl font-semibold mb-3">Simple File Conversion Process</h3>
              <ol className="space-y-4 pl-5">
                <li className="flex gap-3">
                  <div className="flex-shrink-0 w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center font-semibold">1</div>
                  <div>
                    <h4 className="font-medium">Upload Your File</h4>
                    <p className="text-gray-600">Drag and drop your file or use the file browser to select the file you want to convert.</p>
                  </div>
                </li>
                <li className="flex gap-3">
                  <div className="flex-shrink-0 w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center font-semibold">2</div>
                  <div>
                    <h4 className="font-medium">Choose Conversion Type</h4>
                    <p className="text-gray-600">Select the type of conversion you want to perform (PDF to TXT, TXT to PDF, or YouTube to MP4).</p>
                  </div>
                </li>
                <li className="flex gap-3">
                  <div className="flex-shrink-0 w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center font-semibold">3</div>
                  <div>
                    <h4 className="font-medium">Start Conversion</h4>
                    <p className="text-gray-600">Click the convert button and wait for the process to complete.</p>
                  </div>
                </li>
                <li className="flex gap-3">
                  <div className="flex-shrink-0 w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center font-semibold">4</div>
                  <div>
                    <h4 className="font-medium">Download Result</h4>
                    <p className="text-gray-600">Once conversion is complete, download your converted file.</p>
                  </div>
                </li>
              </ol>
            </section>

            <section>
              <h3 className="text-xl font-semibold mb-3">Technology Behind FileFlux</h3>
              <p className="text-gray-700 mb-4">
                FileFlux uses modern web technologies to provide fast and reliable file conversions. Here's a bit about the technology that powers our service:
              </p>
              <ul className="space-y-3 pl-5 list-disc text-gray-600">
                <li>Secure file handling that respects your privacy</li>
                <li>Real-time conversion progress tracking</li>
                <li>High-quality conversion algorithms for accurate results</li>
                <li>Automatic cleanup of files after processing</li>
                <li>Optimized for both desktop and mobile devices</li>
              </ul>
            </section>

            <section>
              <h3 className="text-xl font-semibold mb-3">File Security & Privacy</h3>
              <p className="text-gray-700 mb-4">
                At FileFlux, we take your privacy seriously. Here's how we handle your files:
              </p>
              <ul className="space-y-3 pl-5 list-disc text-gray-600">
                <li>Files are processed on our secure servers</li>
                <li>Files are automatically deleted after conversion</li>
                <li>We don't store or analyze the content of your files</li>
                <li>No account creation required to use our service</li>
                <li>We use HTTPS to encrypt all data transfers</li>
              </ul>
            </section>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default HowItWorks;
