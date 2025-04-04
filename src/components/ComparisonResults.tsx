import React from 'react';
import { Clock } from 'lucide-react';
import type { ComparisonResult } from '../types';

interface ComparisonResultsProps {
  results: ComparisonResult[];
}

export function ComparisonResults({ results }: ComparisonResultsProps) {
  if (results.length === 0) return null;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {results.map((result) => (
        <div key={result.modelId} className="border rounded-lg p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-medium">{result.modelId}</h3>
            <div className="flex items-center text-sm text-gray-500">
              <Clock className="h-4 w-4 mr-1" />
              {result.latency}ms
            </div>
          </div>
          <div className="prose prose-sm">
            <p className="whitespace-pre-wrap">{result.response}</p>
          </div>
        </div>
      ))}
    </div>
  );
}