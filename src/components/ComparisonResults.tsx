import React from 'react';
import { Clock } from 'lucide-react';
import type { ComparisonResult } from '../types';

interface ComparisonResultsProps {
  results: ComparisonResult[];
}

export function ComparisonResults({ results }: ComparisonResultsProps) {
  if (results.length === 0) return null;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {results.map((result) => (
        <div key={result.modelId} className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
          <div className="bg-gray-50 border-b border-gray-200 px-6 py-4">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="text-lg font-medium text-gray-900">{result.modelName}</h3>
                <p className="text-sm text-gray-500">{result.version}</p>
              </div>
              <div className="flex items-center text-sm text-gray-500">
                <Clock className="h-4 w-4 mr-1" />
                {result.latency.toFixed(2)}s
              </div>
            </div>
          </div>
          <div className="px-6 py-4">
            <div className="prose prose-sm max-w-none">
              <pre className="whitespace-pre-wrap font-mono bg-gray-50 p-4 rounded-lg text-sm text-gray-700">
                {result.response}
              </pre>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}