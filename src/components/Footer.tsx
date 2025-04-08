import { Twitter, Linkedin, Github, Phone } from 'lucide-react';

export const Footer = () => {
  return (
    <footer className="bg-white border-t border-gray-200 pt-12 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          {/* About Section */}
          <div>
            <h3 className="text-lg font-semibold mb-4">About</h3>
            <ul className="space-y-3">
              <li><a href="/our-story" className="text-gray-600 hover:text-gray-900">Our Story</a></li>
              <li><a href="/how-it-works" className="text-gray-600 hover:text-gray-900">How It Works</a></li>
              <li><a href="/pricing" className="text-gray-600 hover:text-gray-900">Pricing</a></li>
              <li><a href="/faq" className="text-gray-600 hover:text-gray-900">FAQ</a></li>
            </ul>
          </div>

          {/* AI Models Section */}
          <div>
            <h3 className="text-lg font-semibold mb-4">AI Models</h3>
            <ul className="space-y-3">
              <li><a href="/models/chatgpt" className="text-gray-600 hover:text-gray-900">ChatGPT</a></li>
              <li><a href="/models/claude" className="text-gray-600 hover:text-gray-900">Claude</a></li>
              <li><a href="/models/gemini" className="text-gray-600 hover:text-gray-900">Gemini</a></li>
              <li><a href="/models/deepseak" className="text-gray-600 hover:text-gray-900">Deepseak</a></li>
              <li><a href="/models" className="text-gray-600 hover:text-gray-900">All Models</a></li>
            </ul>
          </div>

          {/* Resources Section */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Resources</h3>
            <ul className="space-y-3">
              <li><a href="/blog" className="text-gray-600 hover:text-gray-900">Blog</a></li>
              <li><a href="/guides" className="text-gray-600 hover:text-gray-900">Guides</a></li>
              <li><a href="/api-documentation" className="text-gray-600 hover:text-gray-900">API Documentation</a></li>
              <li><a href="/community" className="text-gray-600 hover:text-gray-900">Community</a></li>
            </ul>
          </div>

          {/* Contact Section */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Contact</h3>
            <ul className="space-y-3">
              <li><a href="/support" className="text-gray-600 hover:text-gray-900">Support</a></li>
              <li><a href="/sales" className="text-gray-600 hover:text-gray-900">Sales</a></li>
              <li><a href="/partnerships" className="text-gray-600 hover:text-gray-900">Partnerships</a></li>
            </ul>

            {/* Subscribe Section */}
            <div className="mt-8">
              <h3 className="text-lg font-semibold mb-4">Subscribe</h3>
              <div className="flex gap-2">
                <input
                  type="email"
                  placeholder="Your email"
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
                  Subscribe
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-gray-200 pt-8 flex flex-col md:flex-row justify-between items-center">
          <div className="flex space-x-6 mb-4 md:mb-0">
            <a href="https://twitter.com" className="text-gray-400 hover:text-gray-600">
              <Twitter size={20} />
            </a>
            <a href="https://linkedin.com" className="text-gray-400 hover:text-gray-600">
              <Linkedin size={20} />
            </a>
            <a href="https://github.com" className="text-gray-400 hover:text-gray-600">
              <Github size={20} />
            </a>
            <a href="tel:" className="text-gray-400 hover:text-gray-600">
              <Phone size={20} />
            </a>
          </div>
          <p className="text-gray-500 text-sm">
            © {new Date().getFullYear()} PromptComparison. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer; 