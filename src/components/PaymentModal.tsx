import React, { useState, useEffect } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, PaymentElement, useStripe, useElements } from '@stripe/react-stripe-js';
import type { SelectedModelInstance, ComparisonResult } from '../types';
import { toast } from 'react-hot-toast';

const API_URL = import.meta.env.PROD 
  ? '/.netlify/functions/server'  // Production API endpoint
  : 'http://localhost:3000';      // Development API endpoint
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY);

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedModels: SelectedModelInstance[];
  prompt: string;
  onPaymentSuccess: (results: ComparisonResult[]) => void;
}

const PRICE_PER_MODEL = 0.5; // $0.50 per model

function CheckoutForm({ selectedModels, prompt, onPaymentSuccess, onClose }: Omit<PaymentModalProps, 'isOpen'>) {
  const stripe = useStripe();
  const elements = useElements();
  const [isProcessing, setIsProcessing] = useState(false);
  const totalAmount = selectedModels.length * PRICE_PER_MODEL;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    setIsProcessing(true);

    try {
      const { error } = await stripe.confirmPayment({
        elements,
        confirmParams: {
          return_url: window.location.origin,
        },
        redirect: 'if_required',
      });

      if (error) {
        toast.error(error.message || 'Payment failed');
        setIsProcessing(false);
      } else {
        // Payment successful, now call the AI endpoints
        try {
          const response = await fetch(`${API_URL}/api/compare`, {
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
          });

          if (!response.ok) {
            throw new Error('Failed to fetch AI comparison results');
          }

          const results = await response.json();
          toast.success('Payment successful! Processing your comparison...');
          onPaymentSuccess(results);
          onClose();
        } catch (err: any) {
          toast.error(err.message || 'Failed to process AI comparison');
          console.error('AI comparison error:', err);
        }
      }
    } catch (err: any) {
      toast.error(err.message || 'An unexpected error occurred');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="mb-6">
        <p className="text-gray-600">Selected Models: {selectedModels.length}</p>
        <p className="text-gray-600">Price per model: ${PRICE_PER_MODEL.toFixed(2)}</p>
        <p className="text-xl font-bold mt-2">Total: ${totalAmount.toFixed(2)}</p>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Card Details
          </label>
          <PaymentElement />
        </div>

        <div className="flex justify-end space-x-4">
          <button
            type="button"
            className="px-4 py-2 text-gray-600 hover:text-gray-900"
            onClick={onClose}
            disabled={isProcessing}
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
            disabled={!stripe || isProcessing}
          >
            {isProcessing ? 'Processing...' : `Pay $${totalAmount.toFixed(2)}`}
          </button>
        </div>
      </div>
    </form>
  );
}

export function PaymentModal({ isOpen, onClose, selectedModels, prompt, onPaymentSuccess }: PaymentModalProps) {
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [key, setKey] = useState(0); // Add a key to force re-render of Elements

  // Reset state when modal is closed
  useEffect(() => {
    if (!isOpen) {
      setClientSecret(null);
      setKey(prev => prev + 1); // Increment key to force new Elements instance
    }
  }, [isOpen]);

  // Create payment intent when modal opens
  useEffect(() => {
    let isMounted = true;

    const createPaymentIntent = async () => {
      if (isOpen && selectedModels.length > 0) {
        try {
          const response = await fetch(`${API_URL}/api/create-payment-intent`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              models: selectedModels.map(model => ({
                id: model.modelId,
                version: model.version
              })),
              prompt
            }),
          });
          
          const data = await response.json();
          
          if (!isMounted) return;
          
          if (data.error) {
            throw new Error(data.error);
          }
          
          setClientSecret(data.clientSecret);
        } catch (error: any) {
          if (!isMounted) return;
          toast.error(error.message || 'Failed to initialize payment');
          onClose();
        }
      }
    };

    createPaymentIntent();

    return () => {
      isMounted = false;
    };
  }, [isOpen, selectedModels, prompt]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-8 max-w-md w-full">
        <h2 className="text-2xl font-bold mb-4">Complete Your Purchase</h2>
        
        {clientSecret ? (
          <Elements key={key} stripe={stripePromise} options={{ 
            clientSecret,
            appearance: {
              theme: 'stripe'
            }
          }}>
            <CheckoutForm
              selectedModels={selectedModels}
              prompt={prompt}
              onPaymentSuccess={onPaymentSuccess}
              onClose={onClose}
            />
          </Elements>
        ) : (
          <div className="flex justify-center py-10">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        )}
      </div>
    </div>
  );
}