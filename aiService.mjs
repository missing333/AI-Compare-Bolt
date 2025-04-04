import OpenAI from 'openai';
import Anthropic from '@anthropic-ai/sdk';
import 'dotenv/config';

class AIService {
  constructor() {
    if (!process.env.OPENAI_API_KEY) {
      throw new Error('OPENAI_API_KEY is not set in environment variables');
    }
    
    if (!process.env.ANTHROPIC_API_KEY) {
      throw new Error('ANTHROPIC_API_KEY is not set in environment variables');
    }
    
    this.openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY
    });

    this.anthropic = new Anthropic({
      apiKey: process.env.ANTHROPIC_API_KEY
    });
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

  isOpenAIModel(modelId) {
    return modelId.startsWith('gpt-');
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

  isClaudeModel(modelId) {
    // Normalize the model ID to lowercase for comparison
    const normalizedId = modelId.toLowerCase();
    console.log('Checking if model is Claude:', modelId, 'Normalized:', normalizedId);
    return normalizedId.includes('claude');
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