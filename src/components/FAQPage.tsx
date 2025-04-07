import React from 'react';
import { ChevronDown } from 'lucide-react';

interface FAQItem {
  question: string;
  answer: string;
}

export function FAQPage() {
  const [openIndex, setOpenIndex] = React.useState<number | null>(null);

  const faqs: FAQItem[] = [
    {
      question: "How does the pricing work?",
      answer: "We charge $0.50 per model per comparison. For example, if you compare GPT-4 and Claude, that would be $1.00. You only pay for what you use, with no subscriptions or commitments required."
    },
    {
      question: "Do I need my own API keys?",
      answer: "No! We handle all the API integrations for you. You don't need to sign up for any AI services or manage any API keys. Just select the models you want to compare and we'll take care of the rest."
    },
    {
      question: "Which AI models are available?",
      answer: "We support all major AI models including GPT-4, Claude, Gemini, Perplexity, and more. Each model can be used with different versions, allowing you to compare both the latest and specific previous versions."
    },
    {
      question: "How do I pay for comparisons?",
      answer: "We use secure payment processing through Stripe. You'll be prompted to enter your payment details before running a comparison. We only charge you after you confirm the payment."
    },
    {
      question: "Can I compare more than two models?",
      answer: "Yes! You can compare as many models as you want in a single comparison. Each additional model adds $0.50 to the total cost."
    },
    {
      question: "Are my prompts and results private?",
      answer: "Yes, your prompts and results are completely private. We don't store or share your data with anyone. Each comparison is processed securely and independently."
    },
    {
      question: "What happens if a model fails to respond?",
      answer: "If any model fails to respond during a comparison, you won't be charged for that specific model. We only charge for successful responses."
    },
    {
      question: "Do you offer refunds?",
      answer: "If you experience technical issues with our service, we'll be happy to refund your payment. Contact our support team with details about the problem."
    },
    {
      question: "Can I use this for commercial purposes?",
      answer: "Yes! Our service is suitable for both personal and commercial use. Many professionals use our tool for content creation, research, and development."
    },
    {
      question: "How do you handle rate limits?",
      answer: "We manage all rate limiting and queuing behind the scenes. You don't need to worry about hitting API limits or managing quotas - we handle all of that for you."
    }
  ];

  return (
    <div className="max-w-4xl mx-auto px-4 py-16">
      <div className="text-center mb-16">
        <h1 className="text-4xl font-bold text-gray-900 mb-6">
          Frequently Asked Questions
        </h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          Everything you need to know about comparing AI models with our service.
        </p>
      </div>

      <div className="space-y-4">
        {faqs.map((faq, index) => (
          <div
            key={index}
            className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden"
          >
            <button
              onClick={() => setOpenIndex(openIndex === index ? null : index)}
              className="w-full px-6 py-4 text-left flex justify-between items-center hover:bg-gray-50 transition-colors duration-200"
            >
              <span className="font-medium text-gray-900">{faq.question}</span>
              <ChevronDown
                className={`h-5 w-5 text-gray-500 transition-transform duration-200 ${
                  openIndex === index ? 'transform rotate-180' : ''
                }`}
              />
            </button>
            {openIndex === index && (
              <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
                <p className="text-gray-600 leading-relaxed">{faq.answer}</p>
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="text-center mt-16">
        <h2 className="text-2xl font-semibold text-gray-900 mb-4">
          Still have questions?
        </h2>
        <p className="text-gray-600 mb-8">
          We're here to help! Contact us for more information.
        </p>
        <a 
          href="mailto:support@aicompare.com"
          className="inline-flex items-center px-8 py-4 border border-transparent text-lg font-medium rounded-xl text-white bg-blue-600 hover:bg-blue-700 transition-colors duration-200"
        >
          Contact Support
        </a>
      </div>
    </div>
  );
} 