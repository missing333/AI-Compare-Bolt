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
                viewBox="0 0 32 32" 
                fill="none" 
                xmlns="http://www.w3.org/2000/svg"
              >
                <rect x="4" y="8" width="6" height="16" rx="1" fill="#6366F1"/>
                <rect x="13" y="4" width="6" height="24" rx="1" fill="#818CF8"/>
                <rect x="22" y="8" width="6" height="16" rx="1" fill="#6366F1"/>
              </svg>
              <span className="ml-2 text-xl font-bold">PromptSideBySide</span>
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