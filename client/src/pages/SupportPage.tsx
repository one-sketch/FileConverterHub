import React from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

const SupportPage: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-grow py-8 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="max-w-5xl mx-auto space-y-8">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-2">Support Center</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Get help with FileFlux and find answers to common questions.
            </p>
          </div>

          <div className="bg-white rounded-xl shadow-md p-6">
            <h3 className="text-xl font-semibold mb-4">Frequently Asked Questions</h3>
            <Accordion type="single" collapsible className="w-full">
              <AccordionItem value="item-1">
                <AccordionTrigger>What file formats does FileFlux support?</AccordionTrigger>
                <AccordionContent>
                  <p>Currently, FileFlux supports the following conversions:</p>
                  <ul className="list-disc pl-5 mt-2 space-y-1 text-gray-600">
                    <li>PDF to TXT conversion</li>
                    <li>TXT to PDF conversion</li>
                    <li>YouTube videos to MP4 download</li>
                  </ul>
                  <p className="mt-2">We plan to add more formats in the future.</p>
                </AccordionContent>
              </AccordionItem>
              
              <AccordionItem value="item-2">
                <AccordionTrigger>Is there a file size limit?</AccordionTrigger>
                <AccordionContent>
                  Yes, the maximum file size for uploads is 25MB. For YouTube videos, there's no specific size limit, but very long videos may take more time to process.
                </AccordionContent>
              </AccordionItem>
              
              <AccordionItem value="item-3">
                <AccordionTrigger>Are my files secure?</AccordionTrigger>
                <AccordionContent>
                  Yes, we prioritize your privacy and security. Your files are processed securely and are automatically deleted from our servers after conversion. We don't store or analyze the content of your files.
                </AccordionContent>
              </AccordionItem>
              
              <AccordionItem value="item-4">
                <AccordionTrigger>Do I need to create an account?</AccordionTrigger>
                <AccordionContent>
                  No, FileFlux doesn't require any account creation or registration. You can immediately use all our conversion tools without signing up.
                </AccordionContent>
              </AccordionItem>
              
              <AccordionItem value="item-5">
                <AccordionTrigger>How long does the conversion process take?</AccordionTrigger>
                <AccordionContent>
                  The conversion time depends on the file size and the type of conversion. Most conversions complete within a few seconds to a minute. Larger files or YouTube video downloads may take longer.
                </AccordionContent>
              </AccordionItem>
              
              <AccordionItem value="item-6">
                <AccordionTrigger>Is downloading YouTube videos legal?</AccordionTrigger>
                <AccordionContent>
                  The legality of downloading YouTube videos varies by country and depends on factors such as copyright status and intended use. Always ensure you have the right to download content and comply with YouTube's terms of service. Our tool is intended for downloading content that you have permission to download, such as videos under Creative Commons licenses or your own content.
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>

          <div className="bg-white rounded-xl shadow-md p-6">
            <h3 className="text-xl font-semibold mb-4">Contact Support</h3>
            <p className="text-gray-700 mb-6">
              Can't find an answer to your question? Reach out to our support team and we'll get back to you as soon as possible.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-gray-50 p-4 rounded-lg flex flex-col items-center text-center">
                <div className="w-12 h-12 bg-primary/10 text-primary rounded-full flex items-center justify-center mb-3">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-6 h-6">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <h4 className="font-medium mb-1">Email Support</h4>
                <p className="text-gray-600 mb-3">Get help via email</p>
                <a href="mailto:support@fileflux.example" className="text-primary hover:underline">
                  support@fileflux.example
                </a>
              </div>
              
              <div className="bg-gray-50 p-4 rounded-lg flex flex-col items-center text-center">
                <div className="w-12 h-12 bg-primary/10 text-primary rounded-full flex items-center justify-center mb-3">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-6 h-6">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                  </svg>
                </div>
                <h4 className="font-medium mb-1">Live Chat</h4>
                <p className="text-gray-600 mb-3">Chat with our support team</p>
                <button className="text-primary hover:underline">
                  Start Chat
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default SupportPage;
