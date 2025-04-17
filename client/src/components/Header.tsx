import React from 'react';
import { Link } from 'wouter';

const Header: React.FC = () => {
  return (
    <header className="bg-white shadow-sm">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
        <Link href="/" className="flex items-center space-x-2">
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            className="h-6 w-6 text-primary" 
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
          <h1 className="text-xl font-bold text-gray-800">FileFlux</h1>
        </Link>
        <div className="hidden sm:flex space-x-4">
          <Link href="/how-it-works" className="text-gray-600 hover:text-primary transition">
            How it works
          </Link>
          <Link href="/support" className="text-gray-600 hover:text-primary transition">
            Support
          </Link>
        </div>
      </div>
    </header>
  );
};

export default Header;
