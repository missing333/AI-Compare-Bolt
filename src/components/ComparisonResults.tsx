import React from 'react';
import { Clock } from 'lucide-react';
import type { ComparisonResult } from '../types';
import { ModelIcon } from './ModelIcon';

interface ComparisonResultsProps {
  results: ComparisonResult[];
}

export function ComparisonResults({ results }: ComparisonResultsProps) {
  if (results.length === 0) return null;

  // Calculate grid columns based on number of results
  const getGridCols = () => {
    if (results.length <= 2) return 'grid-cols-1 md:grid-cols-2';
    if (results.length <= 4) return 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3';
    return 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4';
  };

  return (
    <div className={`grid ${getGridCols()} gap-4`}>
      {results.map((result) => (
        <div key={result.modelId} className="border border-gray-200 rounded-xl shadow-sm overflow-hidden h-full">
          <div className="border-b border-gray-200 px-4 py-3">
            <div className="flex justify-between items-center">
              <div className="flex items-center">
                <ModelIcon modelId={result.modelId} className="h-6 w-6 mr-3" />
                <div>
                  <h3 className="text-lg font-medium text-gray-900">{result.modelName}</h3>
                  <p className="text-sm text-gray-500">{result.version}</p>
                </div>
              </div>
              <div className="flex items-center text-sm text-gray-500">
                <Clock className="h-4 w-4 mr-1" />
                {result.latency.toFixed(2)}s
              </div>
            </div>
          </div>
          <div className="px-4 py-3">
            <div className="prose prose-sm max-w-none">
              <pre className="whitespace-pre-wrap font-mono p-3 rounded-lg text-sm text-gray-700">
                {result.response}
              </pre>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}