import React from 'react';
import { LogIn } from 'lucide-react';

export function Header() {
  return (
    <header className="border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          <div className="flex items-center">
            <a href="/" className="flex items-center">
              <svg 
                className="h-8 w-8" 
                viewBox="0 0 24 24" 
                fill="none" 
                xmlns="http://www.w3.org/2000/svg"
              >
                <path 
                  d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" 
                  fill="#6366F1" 
                  stroke="#4F46E5" 
                  strokeWidth="1.5" 
                  strokeLinecap="round" 
                  strokeLinejoin="round"
                />
                <circle cx="12" cy="12" r="5" fill="#818CF8" />
                <path 
                  d="M9 12H15" 
                  stroke="white" 
                  strokeWidth="1.5" 
                  strokeLinecap="round"
                />
                <path 
                  d="M12 9V15" 
                  stroke="white" 
                  strokeWidth="1.5" 
                  strokeLinecap="round"
                />
              </svg>
              <span className="ml-2 text-xl font-bold">PromptCurious</span>
            </a>
          </div>
          <nav className="flex items-center space-x-8">
            <a href="#pricing" className="text-gray-600 hover:text-gray-900 font-medium">Pricing</a>
            <a href="#faq" className="text-gray-600 hover:text-gray-900">FAQ</a>
            {/* <button className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700">
              <LogIn className="h-4 w-4 mr-2" />
              Sign In
            </button> */}
          </nav>
        </div>
      </div>
    </header>
  );
}