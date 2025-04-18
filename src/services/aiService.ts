import OpenAI from 'openai';
import Anthropic from '@anthropic-ai/sdk';
import { GoogleGenerativeAI, GenerativeModel } from '@google/generative-ai';
import { z } from 'zod';

// Environment variable validation schema
const envSchema = z.object({
  OPENAI_API_KEY: z.string().min(1, 'OPENAI_API_KEY is required'),
  ANTHROPIC_API_KEY: z.string().min(1, 'ANTHROPIC_API_KEY is required'),
  GOOGLE_API_KEY: z.string().min(1, 'GOOGLE_API_KEY is required'),
  PERPLEXITY_API_KEY: z.string().min(1, 'PERPLEXITY_API_KEY is required'),
  META_API_KEY: z.string().optional(),
});

type AIResponse = {
  response: string;
  responseTime: number;
};

type ZodError = {
  message: string;
};

class AIService {
  private openai: OpenAI;
  private anthropic: Anthropic;
  private gemini: GoogleGenerativeAI;

  constructor() {
    // Validate environment variables
    const env = envSchema.safeParse(process.env);
    
    if (!env.success) {
      const errorMessage = env.error.errors.map((err: ZodError) => err.message).join(', ');
      throw new Error(`Environment validation failed: ${errorMessage}`);
    }

    this.openai = new OpenAI({
      apiKey: env.data.OPENAI_API_KEY
    });

    this.anthropic = new Anthropic({
      apiKey: env.data.ANTHROPIC_API_KEY
    });

    this.gemini = new GoogleGenerativeAI(env.data.GOOGLE_API_KEY);
  }

  private async measureResponseTime<T>(operation: () => Promise<T>): Promise<[T, number]> {
    const startTime = Date.now();
    const result = await operation();
    const responseTime = Number(((Date.now() - startTime) / 1000).toFixed(2));
    return [result, responseTime];
  }

  async getOpenAIResponse(prompt: string, modelVersion = 'gpt-4'): Promise<AIResponse> {
    try {
      const [completion, responseTime] = await this.measureResponseTime(async () => {
        return await this.openai.chat.completions.create({
          model: modelVersion,
          messages: [{ role: 'user', content: prompt }],
        });
      });

      return {
        response: completion.choices[0]?.message?.content || 'No response generated',
        responseTime
      };
    } catch (error) {
      throw new Error(`OpenAI API error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  async getAnthropicResponse(prompt: string, modelVersion = 'claude-3-opus-20240229'): Promise<AIResponse> {
    try {
      const [message, responseTime] = await this.measureResponseTime(async () => {
        return await this.anthropic.messages.create({
          model: modelVersion,
          max_tokens: 4096,
          messages: [{ role: 'user', content: prompt }],
        });
      });

      return {
        response: message.content[0]?.text || 'No response generated',
        responseTime
      };
    } catch (error) {
      throw new Error(`Anthropic API error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  async getGeminiResponse(prompt: string, modelVersion = 'gemini-pro'): Promise<AIResponse> {
    try {
      const model: GenerativeModel = this.gemini.getGenerativeModel({ model: modelVersion });
      
      const [result, responseTime] = await this.measureResponseTime(async () => {
        const response = await model.generateContent(prompt);
        const text = await response.response;
        return text.text();
      });

      return {
        response: result || 'No response generated',
        responseTime
      };
    } catch (error) {
      throw new Error(`Gemini API error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  async getPerplexityResponse(prompt: string, modelVersion = 'sonar-medium-online'): Promise<AIResponse> {
    try {
      const [response, responseTime] = await this.measureResponseTime(async () => {
        const response = await fetch('https://api.perplexity.ai/chat/completions', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${process.env.PERPLEXITY_API_KEY}`
          },
          body: JSON.stringify({
            model: modelVersion,
            messages: [{ role: 'user', content: prompt }]
          })
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        return data.choices[0]?.message?.content || 'No response generated';
      });

      return {
        response,
        responseTime
      };
    } catch (error) {
      throw new Error(`Perplexity API error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  // Placeholder for future Grok API implementation
  async getGrokResponse(prompt: string, modelVersion = 'grok-1'): Promise<AIResponse> {
    throw new Error('Grok API is not yet publicly available');
  }

  isOpenAIModel(modelId: string): boolean {
    const normalizedId = modelId.toLowerCase();
    return normalizedId.includes('gpt') || normalizedId.includes('openai');
  }

  isAnthropicModel(modelId: string): boolean {
    const normalizedId = modelId.toLowerCase();
    return normalizedId.includes('claude') || normalizedId.includes('anthropic');
  }

  isGeminiModel(modelId: string): boolean {
    const normalizedId = modelId.toLowerCase();
    return normalizedId.includes('gemini');
  }

  isPerplexityModel(modelId: string): boolean {
    const normalizedId = modelId.toLowerCase();
    return normalizedId.includes('pplx') || normalizedId.includes('sonar') || normalizedId === 'perplexity';
  }

  isGrokModel(modelId: string): boolean {
    const normalizedId = modelId.toLowerCase();
    return normalizedId.includes('grok');
  }
}

export default new AIService(); 