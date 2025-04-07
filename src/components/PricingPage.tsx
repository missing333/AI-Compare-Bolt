import React from 'react';
import { Check } from 'lucide-react';

export function PricingPage() {
  const benefits = [
    {
      title: "No API Keys Required",
      description: "Skip the hassle of signing up for multiple AI services and managing API keys. We handle all the integrations for you."
    },
    {
      title: "Cost-Effective Comparison",
      description: "Instead of paying monthly subscriptions to multiple AI providers, pay only for what you need - just $0.50 per model per comparison."
    },
    {
      title: "Enterprise-Grade Access",
      description: "Get access to the latest versions of top AI models like GPT-4, Claude, and Gemini without enterprise commitments."
    },
    {
      title: "Instant Results",
      description: "See real-time, side-by-side comparisons of how different AI models handle your prompt."
    },
    {
      title: "No Hidden Fees",
      description: "No monthly subscriptions, no minimum commitments. Pay per use with complete transparency."
    },
    {
      title: "Professional Features",
      description: "Access enterprise features like model version selection and performance metrics without enterprise pricing."
    }
  ];

  const savings = [
    { service: "OpenAI (GPT-4)", cost: "$20/month" },
    { service: "Anthropic (Claude)", cost: "$20/month" },
    { service: "Google (Gemini)", cost: "$10/month" },
    { service: "Perplexity", cost: "$20/month" },
  ];

  const totalSavings = "$70.00";

  return (
    <div className="max-w-4xl mx-auto px-4 py-16">
      <div className="text-center mb-16">
        <h1 className="text-4xl font-bold text-gray-900 mb-6">
          Simple, Transparent Pricing
        </h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          Compare top AI models without the complexity of multiple subscriptions and API keys.
        </p>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8 mb-12">
        <div className="text-center mb-8">
          <div className="text-5xl font-bold text-gray-900 mb-4">
            $0.50
            <span className="text-xl text-gray-500 font-normal"> / model / comparison</span>
          </div>
          <p className="text-gray-600">
            Only pay for what you use. No subscriptions required.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          <div>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              What You Get
            </h2>
            <ul className="space-y-4">
              {benefits.map((benefit, index) => (
                <li key={index} className="flex gap-3">
                  <div className="flex-shrink-0 text-blue-500">
                    <Check className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900">{benefit.title}</h3>
                    <p className="text-gray-600 text-sm">{benefit.description}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Potential Monthly Savings
            </h2>
            <div className="bg-gray-50 rounded-xl p-6">
              <ul className="space-y-3 mb-6">
                {savings.map((item, index) => (
                  <li key={index} className="flex justify-between text-gray-600">
                    <span>{item.service}</span>
                    <span className="font-medium">{item.cost}</span>
                  </li>
                ))}
                <li className="pt-3 border-t border-gray-200 flex justify-between font-semibold text-gray-900">
                  <span>Total Potential Savings</span>
                  <span>{totalSavings}</span>
                </li>
              </ul>
              <p className="text-sm text-gray-500">
                Based on typical monthly subscription costs for individual services.
                With our pay-per-use model, you could run 140 comparisons for the same price!
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="text-center">
        <h2 className="text-2xl font-semibold text-gray-900 mb-4">
          Ready to Start Comparing?
        </h2>
        <p className="text-gray-600 mb-8">
          No commitment required. Pay only for the comparisons you need.
        </p>
        <a 
          href="/"
          className="inline-flex items-center px-8 py-4 border border-transparent text-lg font-medium rounded-xl text-white bg-blue-600 hover:bg-blue-700 transition-colors duration-200"
        >
          Start Comparing Now
        </a>
      </div>
    </div>
  );
} 