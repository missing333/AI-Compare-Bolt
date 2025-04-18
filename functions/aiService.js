import OpenAI from 'openai';
import Anthropic from '@anthropic-ai/sdk';
// import { GoogleGenerativeAI } from '@google/generative-ai';
import { GoogleGenAI } from "@google/genai";
import 'dotenv/config';

class AIService {
  constructor() {
    if (!process.env.OPENAI_API_KEY) {
      throw new Error('OPENAI_API_KEY is not set in environment variables');
    }
    
    if (!process.env.ANTHROPIC_API_KEY) {
      throw new Error('ANTHROPIC_API_KEY is not set in environment variables');
    }

    if (!process.env.GOOGLE_API_KEY) {
      throw new Error('GOOGLE_API_KEY is not set in environment variables');
    }

    if (!process.env.PERPLEXITY_API_KEY) {
      throw new Error('PERPLEXITY_API_KEY is not set in environment variables');
    }
    
    this.openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY
    });

    this.anthropic = new Anthropic({
      apiKey: process.env.ANTHROPIC_API_KEY
    });

    
    // this.gemini = new GoogleGenerativeAI({
    //   apiKey: process.env.GOOGLE_API_KEY
    // });
    
    this.gemini = new GoogleGenAI({ 
      apiKey: process.env.GOOGLE_API_KEY 
    });
  }

  async getOpenAIResponse(prompt, modelVersion) {
    try {
      console.log('Making OpenAI API call with model:', modelVersion);
      const startTime = Date.now();
      
      const completion = await this.openai.chat.completions.create({
        model: modelVersion,
        messages: [
          { role: 'system', content: 'You are a helpful assistant.' },
          { role: 'user', content: prompt }
        ],
        temperature: 0.7,
        max_tokens: 1000
      });

      const responseTime = Number(((Date.now() - startTime) / 1000).toFixed(2));
      
      return {
        response: completion.choices[0].message.content,
        responseTime
      };
    } catch (error) {
      console.error('OpenAI API error:', error);
      throw new Error(`OpenAI API error: ${error.message}`);
    }
  }

  async getClaudeResponse(prompt, modelVersion) {
    try {
      console.log('Making Claude API call with model:', modelVersion);
      const startTime = Date.now();
      
      const message = await this.anthropic.messages.create({
        model: modelVersion,
        max_tokens: 1000,
        temperature: 0.7,
        messages: [
          { role: 'user', content: prompt }
        ]
      });

      const responseTime = Number(((Date.now() - startTime) / 1000).toFixed(2));
      
      return {
        response: message.content[0].text,
        responseTime
      };
    } catch (error) {
      console.error('Claude API error:', error);
      throw new Error(`Claude API error: ${error.message}`);
    }
  }

  async getGeminiResponse(prompt, modelVersion) {
    try {
      console.log('Making Gemini API call with model:', modelVersion);
      const startTime = Date.now();
      
        const response = await this.gemini.models.generateContent({
          model: modelVersion,
          contents: prompt
        });

      const responseTime = Number(((Date.now() - startTime) / 1000).toFixed(2));
      
      return {
        response: response.text,
        responseTime
      };
    } catch (error) {
      console.error('Gemini API error:', error);
      console.error('Error details:', {
        message: error.message,
        stack: error.stack,
        code: error.code,
        status: error.status
      });
      throw new Error(`Gemini API error: ${error.message}`);
    }
  }

  async getPerplexityResponse(prompt, modelVersion) {
    try {
      console.log('Making Perplexity API call with model:', modelVersion);
      const startTime = Date.now();
      
      const response = await fetch('https://api.perplexity.ai/chat/completions', {
        method: 'POST',
        headers: {
          'accept': 'application/json',
          'content-type': 'application/json',
          'Authorization': `Bearer ${process.env.PERPLEXITY_API_KEY}`
        },
        body: JSON.stringify({
          model: modelVersion,
          messages: [
            { role: 'system', content: 'Be precise and concise.' },
            { role: 'user', content: prompt }
          ]
        })
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.error('Perplexity API error response:', {
          status: response.status,
          statusText: response.statusText,
          errorData
        });
        throw new Error(`Perplexity API error: ${response.statusText} - ${JSON.stringify(errorData)}`);
      }

      const data = await response.json();
      console.log('Perplexity API response:', data);
      
      if (!data.choices || !data.choices[0] || !data.choices[0].message) {
        throw new Error('Invalid response format from Perplexity API');
      }

      const responseTime = Number(((Date.now() - startTime) / 1000).toFixed(2));
      
      return {
        response: data.choices[0].message.content,
        responseTime
      };
    } catch (error) {
      console.error('Perplexity API error:', error);
      throw new Error(`Perplexity API error: ${error.message}`);
    }
  }

  isOpenAIModel(modelId) {
    const normalizedId = modelId.toLowerCase();
    console.log('Checking if model is GPT:', modelId, 'Normalized:', normalizedId);
    return modelId.startsWith('gpt');
  }

  isClaudeModel(modelId) {
    const normalizedId = modelId.toLowerCase();
    console.log('aiService.js: Checking if model is Claude:', modelId, 'Normalized:', normalizedId);
    return normalizedId.includes('claude');
  }

  isGeminiModel(modelId) {
    const normalizedId = modelId.toLowerCase();
    console.log('aiService.js: Checking if model is Gemini:', modelId, 'Normalized:', normalizedId);
    return normalizedId.includes('gemini');
  }

  isPerplexityModel(modelId) {
    const normalizedId = modelId.toLowerCase();
    console.log('aiService.js: Checking if model is Perplexity:', modelId, 'Normalized:', normalizedId);
    return normalizedId.includes('perplexity');
  }

  async getComparisonResults(models, prompt) {
    try {
      console.log('Processing models from aiService.js:', JSON.stringify(models, null, 2));
      const results = await Promise.all(models.map(async (model) => {
        console.log('Processing model from aiService.js:', model.id, 'Version:', model.version);
        
        if (this.isOpenAIModel(model.id)) {
          console.log('Processing OpenAI model:', model.id);
          const version = model.version;
          console.log('Using version:', version);
          const { response, responseTime } = await this.getOpenAIResponse(prompt, version);
          return {
            modelId: model.id,
            modelName: 'GPT',
            version: version,
            response,
            latency: responseTime
          };
        } else if (this.isClaudeModel(model.id)) {
          console.log('Processing Claude model:', model.id);
          const version = model.version;
          console.log('Using Claude version:', version);
          const { response, responseTime } = await this.getClaudeResponse(prompt, version);
          return {
            modelId: model.id,
            modelName: 'Claude',
            version: version,
            response,
            latency: responseTime
          };
        } else if (this.isGeminiModel(model.id)) {
          console.log('Processing Gemini model:', model.id);
          const version = model.version;
          console.log('Using Gemini version:', version);
          const { response, responseTime } = await this.getGeminiResponse(prompt, version);
          return {
            modelId: model.id,
            modelName: 'Gemini',
            version: version,
            response,
            latency: responseTime
          };
        } else if (this.isPerplexityModel(model.id)) {
          console.log('Processing Perplexity model:', model.id);
          const version = model.version;
          console.log('Using Perplexity version:', version);
          const { response, responseTime } = await this.getPerplexityResponse(prompt, version);
          return {
            modelId: model.id,
            modelName: 'Perplexity',
            version: version,
            response,
            latency: responseTime
          };
        } else {
          console.log('Model not recognized, using mock response:', model.id);
          const modelName = model.id.split('-')
            .map(word => word.charAt(0).toUpperCase() + word.slice(1))
            .join(' ');
          
          await new Promise(resolve => setTimeout(resolve, 1000));
          
          return {
            modelId: model.id,
            modelName,
            version: model.version || 'Latest Version',
            response: `This is a mock response from ${modelName} to your prompt: "${prompt}"`,
            latency: Number((Math.random() * 1000).toFixed(2))
          };
        }
      }));

      return results;
    } catch (error) {
      console.error('Error in getComparisonResults:', error);
      throw error;
    }
  }
}

export default new AIService(); 