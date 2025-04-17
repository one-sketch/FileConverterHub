import React from 'react';
import { Link } from 'wouter';

const Footer: React.FC = () => {
  return (
    <footer className="bg-white border-t border-gray-200 py-6">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-4 md:mb-0">
            <Link href="/">
              <a className="flex items-center space-x-2">
                <svg 
                  xmlns="http://www.w3.org/2000/svg" 
                  className="h-5 w-5 text-primary" 
                  fill="none" 
                  viewBox="0 0 24 24" 
                  stroke="currentColor" 
                  strokeWidth={2}
                >
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M9 19l3 3m0 0l3-3m-3 3V10" 
                  />
                </svg>
                <span className="font-bold text-gray-800">FileFlux</span>
              </a>
            </Link>
            <p className="text-sm text-gray-500 mt-1">Fast & secure file conversions</p>
          </div>
          <div className="flex flex-wrap justify-center gap-x-6 gap-y-2">
            <a href="#" className="text-sm text-gray-600 hover:text-primary transition">Privacy Policy</a>
            <a href="#" className="text-sm text-gray-600 hover:text-primary transition">Terms of Service</a>
            <Link href="/support">
              <a className="text-sm text-gray-600 hover:text-primary transition">Contact Us</a>
            </Link>
          </div>
        </div>
        <div className="mt-6 text-center text-sm text-gray-500">
          &copy; {new Date().getFullYear()} FileFlux. All rights reserved.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
