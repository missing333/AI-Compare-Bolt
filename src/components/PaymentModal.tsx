import React from 'react';
import { loadStripe } from '@stripe/stripe-js';
import type { SelectedModelInstance } from '../types';

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedModels: SelectedModelInstance[];
}

const PRICE_PER_MODEL = 0.5; // $0.50 per model

export function PaymentModal({ isOpen, onClose, selectedModels }: PaymentModalProps) {
  const totalAmount = selectedModels.length * PRICE_PER_MODEL;

  const handlePayment = async () => {
    const stripe = await loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY);
    
    // Here you would typically make an API call to your backend to create a payment intent
    // For demo purposes, we'll just show the total
    console.log(`Processing payment for $${totalAmount}`);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white rounded-lg p-8 max-w-md w-full">
        <h2 className="text-2xl font-bold mb-4">Complete Your Purchase</h2>
        <div className="mb-6">
          <p className="text-gray-600">Selected Models: {selectedModels.length}</p>
          <p className="text-gray-600">Price per model: ${PRICE_PER_MODEL.toFixed(2)}</p>
          <p className="text-xl font-bold mt-2">Total: ${totalAmount.toFixed(2)}</p>
        </div>
        <div className="flex justify-end space-x-4">
          <button
            className="px-4 py-2 text-gray-600 hover:text-gray-900"
            onClick={onClose}
          >
            Cancel
          </button>
          <button
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            onClick={handlePayment}
          >
            Pay Now
          </button>
        </div>
      </div>
    </div>
  );
}