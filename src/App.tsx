import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { ModelSelector } from './components/ModelSelector';
import { PromptInput } from './components/PromptInput';
import { ComparisonResults } from './components/ComparisonResults';
import { PaymentModal } from './components/PaymentModal';
import { LoadingModal } from './components/LoadingModal';
import { PricingPage } from './components/PricingPage';
import { FAQPage } from './components/FAQPage';
import { Footer } from './components/Footer';
import type { ComparisonResult, SelectedModelInstance } from './types';
import { Toaster, toast } from 'react-hot-toast';
import { AI_MODELS } from './data/models';
import { API_URL } from './config/api';

// Declare global gtag and dataLayer
declare global {
  interface Window {
    dataLayer: any[];
    gtag: (...args: any[]) => void;
  }
}

// Initialize dataLayer and gtag if not already present
if (typeof window !== 'undefined') {
  window.dataLayer = window.dataLayer || [];
  window.gtag = function() { window.dataLayer.push(arguments); }
}

interface MainContentProps {
  selectedModels: SelectedModelInstance[];
  handleModelSelect: (modelId: string) => void;
  handleModelRemove: (instanceId: string) => void;
  handleVersionChange: (instanceId: string, version: string) => void;
  prompt: string;
  setPrompt: (prompt: string) => void;
  handleCompare: () => void;
  isLoading: boolean;
  results: ComparisonResult[];
}

function MainContent({ 
  selectedModels, 
  handleModelSelect, 
  handleModelRemove, 
  handleVersionChange, 
  prompt, 
  setPrompt, 
  handleCompare, 
  isLoading, 
  results 
}: MainContentProps) {
  return (
    <div className="flex flex-col items-center w-full py-12">
      {/* Regular width container for header and non-results sections */}
      <div className="max-w-4xl w-full px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h1 className="text-6xl font-bold text-gray-900 mb-6 tracking-tight">
            Save before you subscribe!
          </h1>
          <h1 className="text-2xl font-bold text-gray-900 mb-6 tracking-tight">
            Compare AI Outputs Side-by-Side
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
            Enter one prompt and see how different AI models respond. Compare ChatGPT, Claude,
            Gemini, and more in real-time.
          </p>
        </div>

        <div className="space-y-12">
          <div className="rounded-xl shadow-sm p-6 border border-gray-100">
            <h2 className="text-2xl font-semibold text-gray-900 mb-6">1. Select AI Models to Compare</h2>
            <ModelSelector
              selectedModels={selectedModels}
              onModelSelect={handleModelSelect}
              onModelRemove={handleModelRemove}
              onVersionChange={handleVersionChange}
            />
          </div>

          <div className="rounded-xl shadow-sm p-6 border border-gray-100">
            <h2 className="text-2xl font-semibold text-gray-900 mb-6">2. Enter Your Prompt</h2>
            <PromptInput
              prompt={prompt}
              onPromptChange={setPrompt}
              isLoading={isLoading}
            />
            <div className="mt-6 flex justify-center">
              <button
                onClick={handleCompare}
                disabled={isLoading}
                className={`inline-flex items-center px-8 py-4 border border-transparent text-lg font-medium rounded-xl text-white shadow-sm transition-all duration-200 ${
                  isLoading 
                    ? 'bg-gray-400 cursor-not-allowed' 
                    : 'bg-blue-600 hover:bg-blue-700 hover:shadow-md transform hover:-translate-y-0.5'
                }`}
              >
                {isLoading ? 'Processing...' : 'Compare'}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Wider container (80%) for results section */}
      <div className="w-full px-4 sm:px-6 lg:px-8 mt-12">
        <div className="w-[80%] mx-auto">
          <div className="rounded-xl shadow-sm p-6 border border-gray-100">
            <h2 className="text-2xl font-semibold text-gray-900 mb-6">3. View Results</h2>
            <ComparisonResults results={results} />
          </div>
        </div>
      </div>
    </div>
  );
}

function App() {
  const [selectedModels, setSelectedModels] = useState<SelectedModelInstance[]>(() => {
    // Initialize with GPT-4, Claude, Gemini, and Perplexity pre-selected
    const gpt4 = AI_MODELS.find(m => m.id === 'gpt');
    const claude = AI_MODELS.find(m => m.id === 'claude');
    const gemini = AI_MODELS.find(m => m.id === 'gemini');
    const perplexity = AI_MODELS.find(m => m.id === 'perplexity');
    
    const initialModels: SelectedModelInstance[] = [];
    const now = Date.now();
    
    if (gpt4) {
      initialModels.push({
        instanceId: `gpt-4-${now}`,
        modelId: 'gpt',
        version: gpt4.versions[0]
      });
    }
    
    if (claude) {
      initialModels.push({
        instanceId: `claude-${now}`,
        modelId: 'claude',
        version: claude.versions[0]
      });
    }

    if (gemini) {
      initialModels.push({
        instanceId: `gemini-${now}`,
        modelId: 'gemini',
        version: gemini.versions[0]
      });
    }

    if (perplexity) {
      initialModels.push({
        instanceId: `perplexity-${now}`,
        modelId: 'perplexity',
        version: perplexity.versions[0]
      });
    }
    
    return initialModels;
  });
  const [prompt, setPrompt] = useState('');
  const [results, setResults] = useState<ComparisonResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showPayment, setShowPayment] = useState(false);
  const [showLoadingModal, setShowLoadingModal] = useState(false);
  const [currentPage, setCurrentPage] = useState('main');

  useEffect(() => {
    const handleHashChange = () => {
      if (window.location.hash === '#pricing') {
        setCurrentPage('pricing');
      } else if (window.location.hash === '#faq') {
        setCurrentPage('faq');
      } else {
        setCurrentPage('main');
      }
    };

    window.addEventListener('hashchange', handleHashChange);
    handleHashChange(); // Handle initial hash

    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const handleModelSelect = async (modelId: string) => {
    const model = AI_MODELS.find(m => m.id === modelId);
    if (!model) return;

    const newInstance: SelectedModelInstance = {
      instanceId: `${modelId}-${Date.now()}`,
      modelId: modelId,
      version: model.versions[0]
    };

    setSelectedModels(prev => [...prev, newInstance]);
  };

  const handleModelRemove = async (instanceId: string) => {
    setSelectedModels(prev => prev.filter(instance => instance.instanceId !== instanceId));
  };

  const handleVersionChange = (instanceId: string, version: string) => {
    setSelectedModels(prev => prev.map(instance => 
      instance.instanceId === instanceId 
        ? { ...instance, version } 
        : instance
    ));
  };

  const handleCompare = async () => {
    if (selectedModels.length === 0) {
      toast.error('Please select at least one AI model');
      return;
    }

    if (!prompt.trim()) {
      toast.error('Please enter a prompt');
      return;
    }

    // Track Click Compare event
    window.gtag('event', 'conversion', {
      'send_to': 'AW-980072147/9YbJCMajproaENPtqtMD',
      'event_callback': () => {
        setShowPayment(true);
      }
    });
  };

  const fetchComparisonResults = async () => {
    setShowPayment(false);
    setShowLoadingModal(true);
    setIsLoading(true);
    
    const apiEndpoint = `${API_URL}/compare`;
    console.log('App.tsx: Fetching comparison results from:', apiEndpoint);
    console.log('App.tsx: Selected models:', selectedModels);
    console.log(JSON.stringify({
      models: selectedModels.map(model => ({
        id: model.modelId,
        version: model.version
      })),
      prompt: prompt
    }));
    
    try {
      const response = await fetch(apiEndpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          models: selectedModels.map(model => ({
            id: model.modelId,
            version: model.version
          })),
          prompt,
        }),
        credentials: 'same-origin'
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Comparison API error:', {
          status: response.status,
          statusText: response.statusText,
          url: apiEndpoint,
          errorText
        });
        throw new Error(`Comparison API error: ${response.status} ${response.statusText}`);
      }

      const results = await response.json();
      console.log('Comparison results received successfully');
      setResults(results);
      toast.success('Comparison complete!');
    } catch (err: any) {
      console.error('Comparison error details:', err);
      console.error('Error stack:', err.stack);
      toast.error(err.message || 'Failed to process AI comparison');
    } finally {
      setIsLoading(false);
      setShowLoadingModal(false);
    }
  };

  const handlePaymentSuccess = () => {
    // Track conversion event
    window.gtag('event', 'conversion', {
      'send_to': 'AW-980072147/hPgiCJvZ0rgaENPtqtMD',
      'value': 1.0,
      'currency': 'USD',
      'transaction_id': '',
      'event_callback': () => {
        fetchComparisonResults();
      }
    });
  };

  const handlePaymentError = () => {
    // Keep payment modal open for retry
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-sans">
      <Toaster position="top-right" />
      <Header />
      
      {currentPage === 'main' ? (
        <MainContent 
          selectedModels={selectedModels}
          handleModelSelect={handleModelSelect}
          handleModelRemove={handleModelRemove}
          handleVersionChange={handleVersionChange}
          prompt={prompt}
          setPrompt={setPrompt}
          handleCompare={handleCompare}
          isLoading={isLoading}
          results={results}
        />
      ) : currentPage === 'pricing' ? (
        <PricingPage />
      ) : (
        <FAQPage />
      )}

      <Footer />

      <PaymentModal
        isOpen={showPayment}
        onClose={() => setShowPayment(false)}
        selectedModels={selectedModels}
        prompt={prompt}
        onPaymentSuccess={handlePaymentSuccess}
        onPaymentError={handlePaymentError}
      />

      <LoadingModal isOpen={showLoadingModal} />
    </div>
  );
}

export default App;