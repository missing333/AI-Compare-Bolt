import OpenAI from 'openai';
import Anthropic from '@anthropic-ai/sdk';
// import LlamaAI from 'llamaai';
import { GoogleGenerativeAI } from '@google/generative-ai';
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

    if (!process.env.META_API_KEY) {
      throw new Error('META_API_KEY is not set in environment variables');
    }
    
    this.openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY
    });

    this.anthropic = new Anthropic({
      apiKey: process.env.ANTHROPIC_API_KEY
    });

    this.gemini = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);
  }

  async getOpenAIResponse(prompt, modelVersion = 'gpt-3.5-turbo') {
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

  async getClaudeResponse(prompt, modelVersion = 'claude-3-opus-20240229') {
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

  async getGeminiResponse(prompt, modelVersion = 'gemini-pro') {
    try {
      console.log('Making Gemini API call with model:', modelVersion);
      const startTime = Date.now();
      
      const model = this.gemini.getGenerativeModel({ model: modelVersion });
      
      // Create a chat session
      const chat = model.startChat({
        history: [],
        generationConfig: {
          temperature: 0.7,
          maxOutputTokens: 1000,
        },
      });

      // Send the message and get the response
      const result = await chat.sendMessage(prompt);
      const response = await result.response;
      
      if (!response || !response.text) {
        throw new Error('Invalid response format from Gemini API');
      }

      const responseTime = Number(((Date.now() - startTime) / 1000).toFixed(2));
      
      return {
        response: response.text(),
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

  async getPerplexityResponse(prompt, modelVersion = 'sonar-medium-online') {
    try {
      console.log('Making Perplexity API call with model:', modelVersion);
      const startTime = Date.now();
      
      const response = await fetch('https://api.perplexity.ai/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${process.env.PERPLEXITY_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: modelVersion,
          messages: [
            { role: 'system', content: 'You are a helpful assistant.' },
            { role: 'user', content: prompt }
          ],
          temperature: 0.7,
          max_tokens: 1000
        })
      });

      if (!response.ok) {
        throw new Error(`Perplexity API error: ${response.statusText}`);
      }

      const data = await response.json();
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



  // async getLlamaResponse(prompt, modelVersion = 'llama-2-70b-chat') {
  //   const apiToken = process.env.META_API_KEY;
  //   const llamaAPI = new LlamaAI(apiToken);
    
  //   try {
  //     console.log('Making Llama API call with model:', modelVersion);
  //     const startTime = Date.now();
      
  //     const apiRequestJson = {
  //       messages: [
  //         { role: 'user', content: prompt }
  //       ],
  //       stream: false
  //     };

  //     const response = await llamaAPI.run(apiRequestJson);
  //     const responseTime = Number(((Date.now() - startTime) / 1000).toFixed(2));
      
  //     return {
  //       response: response.content || response.message || response,
  //       responseTime
  //     };
  //   } catch (error) {
  //     console.error('Llama API error:', error);
  //     throw new Error(`Llama API error: ${error.message}`);
  //   }
  // }

  isOpenAIModel(modelId) {
    return modelId.startsWith('gpt-');
  }

  isClaudeModel(modelId) {
    const normalizedId = modelId.toLowerCase();
    console.log('Checking if model is Claude:', modelId, 'Normalized:', normalizedId);
    return normalizedId.includes('claude');
  }

  isGeminiModel(modelId) {
    const normalizedId = modelId.toLowerCase();
    console.log('Checking if model is Gemini:', modelId, 'Normalized:', normalizedId);
    return normalizedId.includes('gemini');
  }

  isPerplexityModel(modelId) {
    const normalizedId = modelId.toLowerCase();
    console.log('Checking if model is Perplexity:', modelId, 'Normalized:', normalizedId);
    return normalizedId.includes('sonar');
  }

  isLlamaModel(modelId) {
    const normalizedId = modelId.toLowerCase();
    console.log('Checking if model is Llama:', modelId, 'Normalized:', normalizedId);
    return normalizedId.includes('llama');
  }




  async getComparisonResults(models, prompt) {
    try {
      console.log('Processing models:', JSON.stringify(models, null, 2));
      const results = await Promise.all(models.map(async (model) => {
        console.log('Processing model:', model.id, 'Version:', model.version);
        
        if (this.isOpenAIModel(model.id)) {
          console.log('Processing OpenAI model:', model.id);
          const version = model.version === 'Latest Version' ? model.id : model.version;
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
          const version = model.version === 'Latest Version' ? 'claude-3-opus-20240229' : model.version;
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
          const version = model.version === 'Latest Version' ? 'gemini-pro' : model.version;
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
          const version = model.version === 'Latest Version' ? 'sonar-medium-online' : model.version;
          console.log('Using Perplexity version:', version);
          const { response, responseTime } = await this.getPerplexityResponse(prompt, version);
          return {
            modelId: model.id,
            modelName: 'Perplexity',
            version: version,
            response,
            latency: responseTime
          };
        } else if (this.isLlamaModel(model.id)) {
          console.log('Processing Llama model:', model.id);
          const version = model.version === 'Latest Version' ? 'llama-2-70b-chat' : model.version;
          console.log('Using Llama version:', version);
          const { response, responseTime } = await this.getLlamaResponse(prompt, version);
          return {
            modelId: model.id,
            modelName: 'Llama',
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