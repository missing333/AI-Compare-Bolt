export interface AIModel {
  id: string;
  name: string;
  description: string;
  versions: string[];
}

export interface ComparisonResult {
  modelId: string;
  version: string;
  response: string;
  latency: number;
}

export interface SelectedModelInstance {
  instanceId: string;
  modelId: string;
  version: string;
}