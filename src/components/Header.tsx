import React, { useState } from 'react';
import { LogIn, Menu, X } from 'lucide-react';

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="border-b relative">
      <div className="max-w-7xl mx-auto px-2 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-3 sm:py-4">
          <div className="flex items-center">
            <a href="/" className="flex items-center">
              <svg 
                className="h-6 w-6 sm:h-8 sm:w-8" 
                viewBox="0 0 32 32" 
                fill="none" 
                xmlns="http://www.w3.org/2000/svg"
              >
                <rect x="4" y="8" width="6" height="16" rx="1" fill="#6366F1"/>
                <rect x="13" y="4" width="6" height="24" rx="1" fill="#818CF8"/>
                <rect x="22" y="8" width="6" height="16" rx="1" fill="#6366F1"/>
              </svg>
              <span className="ml-2 text-base sm:text-xl font-bold truncate">PromptSideBySide</span>
            </a>
          </div>
          
          {/* Navigation - visible at 351px and above */}
          <nav className="flex items-center space-x-4 sm:space-x-8 max-[350px]:hidden">
            <a href="#pricing" className="text-sm sm:text-base text-gray-600 hover:text-gray-900 font-medium">Pricing</a>
            <a href="#faq" className="text-sm sm:text-base text-gray-600 hover:text-gray-900">FAQ</a>
          </nav>

          {/* Menu button - only visible at 350px and below */}
          <button 
            className="hidden max-[350px]:block p-1 text-gray-600 hover:text-gray-900 focus:outline-none"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>

          {/* Dropdown menu for small screens */}
          {isMenuOpen && (
            <div className="hidden max-[350px]:block absolute top-full right-0 mt-1 w-40 bg-white rounded-md shadow-lg border border-gray-200 py-1 z-50">
              <a 
                href="#pricing" 
                className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                onClick={() => setIsMenuOpen(false)}
              >
                Pricing
              </a>
              <a 
                href="#faq" 
                className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                onClick={() => setIsMenuOpen(false)}
              >
                FAQ
              </a>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}