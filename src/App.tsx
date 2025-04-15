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
          <h1 className="text-4xl font-bold text-gray-900 mb-6 tracking-tight">
            Prompt SideBySide: Compare AI Outputs Side-by-Side
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
    const gpt4 = AI_MODELS.find(m => m.id === 'gpt-4');
    const claude = AI_MODELS.find(m => m.id === 'claude');
    const gemini = AI_MODELS.find(m => m.id === 'gemini');
    const perplexity = AI_MODELS.find(m => m.id === 'perplexity');
    
    const initialModels: SelectedModelInstance[] = [];
    const now = Date.now();
    
    if (gpt4) {
      initialModels.push({
        instanceId: `gpt-4-${now}`,
        modelId: 'gpt-4',
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

    setIsLoading(true);
    setResults([]);

    try {
      // Initial request to start background processing
      const response = await fetch(`${API_URL}/compare`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          models: selectedModels.map(instance => ({
            id: instance.modelId,
            version: instance.version
          })),
          prompt: prompt.trim()
        })
      });

      if (!response.ok) {
        throw new Error('Failed to start comparison');
      }

      const data = await response.json();
      
      if (data.status === 'processing') {
        // Start polling for results
        const pollInterval = setInterval(async () => {
          try {
            const statusResponse = await fetch(data.statusUrl, {
              method: 'GET',
              headers: {
                'Content-Type': 'application/json',
              }
            });

            if (!statusResponse.ok) {
              throw new Error('Failed to check status');
            }

            const statusData = await statusResponse.json();

            if (statusData.status === 'complete') {
              clearInterval(pollInterval);
              setResults(statusData.results);
              setIsLoading(false);
              toast.success('Comparison complete!');
            } else if (statusData.status === 'error') {
              throw new Error(statusData.error || 'An error occurred while processing');
            }
            // If status is still 'processing', continue polling
          } catch (error) {
            clearInterval(pollInterval);
            console.error('Error checking status:', error);
            toast.error(error instanceof Error ? error.message : 'Failed to check comparison status');
            setIsLoading(false);
          }
        }, 2000); // Poll every 2 seconds

        // Clean up interval after 15 minutes (maximum background function duration)
        setTimeout(() => {
          clearInterval(pollInterval);
          if (isLoading) {
            setIsLoading(false);
            toast.error('Request timed out after 15 minutes');
          }
        }, 15 * 60 * 1000);
      } else {
        // Handle immediate response (error case)
        throw new Error('Unexpected response from server');
      }
    } catch (error) {
      console.error('Error starting comparison:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to start comparison');
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Toaster position="top-center" />
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
    </div>
  );
}

export default App;