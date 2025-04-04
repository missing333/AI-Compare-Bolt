import OpenAI from 'openai';

class AIService {
  constructor() {
    this.openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY
    });
  }

  async getOpenAIResponse(prompt, modelVersion = 'gpt-3.5-turbo') {
    try {
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
      throw error;
    }
  }

  isOpenAIModel(modelId) {
    return modelId.startsWith('gpt-');
  }

  async getComparisonResults(models, prompt) {
    const results = await Promise.all(models.map(async (model) => {
      if (this.isOpenAIModel(model.id)) {
        const { response, responseTime } = await this.getOpenAIResponse(prompt, model.version === 'Latest Version' ? model.id : model.version);
        return {
          modelId: model.id,
          modelName: 'GPT',
          version: model.version || model.id,
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
  }
}

export default new AIService(); 