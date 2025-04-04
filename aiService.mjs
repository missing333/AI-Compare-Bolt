import OpenAI from 'openai';
import 'dotenv/config';

class AIService {
  constructor() {
    if (!process.env.OPENAI_API_KEY) {
      throw new Error('OPENAI_API_KEY is not set in environment variables');
    }
    
    this.openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY
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

  async getComparisonResults(models, prompt) {
    try {
      console.log('Processing models:', models);
      const results = await Promise.all(models.map(async (model) => {
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
        } else {
          // For other models, return mock responses for now
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