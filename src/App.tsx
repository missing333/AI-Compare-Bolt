import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { ModelSelector } from './components/ModelSelector';
import { PromptInput } from './components/PromptInput';
import { ComparisonResults } from './components/ComparisonResults';
import { PaymentModal } from './components/PaymentModal';
import { Footer } from './components/Footer';
import type { ComparisonResult, SelectedModelInstance } from './types';
import { Toaster, toast } from 'react-hot-toast';
import { AI_MODELS } from './data/models';
import { loadStripe } from '@stripe/stripe-js';

const STRIPE_PRODUCT_ID = 'prod_S45beS0xV3JGII';
const API_URL = import.meta.env.PROD 
  ? '/.netlify/functions/server'  // Production API endpoint
  : 'http://localhost:3000';      // Development API endpoint
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY);

function App() {
  const [selectedModels, setSelectedModels] = useState<SelectedModelInstance[]>(() => {
    // Initialize with GPT-4 and Claude pre-selected
    const gpt4 = AI_MODELS.find(m => m.id === 'gpt-4');
    const claude = AI_MODELS.find(m => m.id === 'claude');
    
    const initialModels: SelectedModelInstance[] = [];
    
    if (gpt4) {
      initialModels.push({
        instanceId: `gpt-4-${Date.now()}`,
        modelId: 'gpt-4',
        version: gpt4.versions[0]
      });
    }
    
    if (claude) {
      initialModels.push({
        instanceId: `claude-${Date.now()}`,
        modelId: 'claude',
        version: claude.versions[0]
      });
    }
    
    return initialModels;
  });
  const [prompt, setPrompt] = useState('');
  const [results, setResults] = useState<ComparisonResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showPayment, setShowPayment] = useState(false);

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

    setShowPayment(true);
  };

  const handlePaymentSuccess = (results: ComparisonResult[]) => {
    setResults(results);
    setShowPayment(false);
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Toaster position="top-right" />
      <Header />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 flex-grow">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Compare AI Outputs Side-by-Side
          </h1>
          <p className="text-xl text-gray-600">
            Enter one prompt and see how different AI models respond. Compare ChatGPT, Claude,
            Gemini, Deepseek and more in real-time.
          </p>
        </div>

        <div className="space-y-8">
          <div>
            <h2 className="text-xl font-semibold mb-4">1. Select AI Models to Compare</h2>
            <ModelSelector
              selectedModels={selectedModels}
              onModelSelect={handleModelSelect}
              onModelRemove={handleModelRemove}
              onVersionChange={handleVersionChange}
            />
          </div>

          <div>
            <h2 className="text-xl font-semibold mb-4">2. Enter Your Prompt</h2>
            <PromptInput
              prompt={prompt}
              onPromptChange={setPrompt}
              isLoading={isLoading}
            />
            <div className="mt-4 flex justify-center">
              <button
                onClick={handleCompare}
                disabled={isLoading}
                className={`inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white ${
                  isLoading ? 'bg-gray-400' : 'bg-blue-600 hover:bg-blue-700'
                }`}
              >
                {isLoading ? 'Processing...' : 'Compare'}
              </button>
            </div>
          </div>

          <div>
            <h2 className="text-xl font-semibold mb-4">3. View Results</h2>
            <ComparisonResults results={results} />
          </div>
        </div>
      </main>

      <Footer />

      <PaymentModal
        isOpen={showPayment}
        onClose={() => setShowPayment(false)}
        selectedModels={selectedModels}
        prompt={prompt}
        onPaymentSuccess={handlePaymentSuccess}
      />
    </div>
  );
}

export default App;