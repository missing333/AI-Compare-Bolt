import AIService from './aiService-background';

// This is a background function that will be triggered by Netlify
export const handler = async (event, context) => {
  // Parse the incoming request body
  const body = JSON.parse(event.body);
  const { models, prompt } = body;

  if (!models || !Array.isArray(models) || !prompt) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: 'Invalid request. Required: models (array) and prompt (string)' })
    };
  }

  try {
    // Initialize the AI service
    const aiService = new AIService();
    
    // Get the comparison results
    const results = await aiService.getComparisonResults(models, prompt);
    
    // Return success response
    return {
      statusCode: 200,
      body: JSON.stringify({
        status: 'complete',
        results
      })
    };
  } catch (error) {
    console.error('Error in background function:', error);
    
    return {
      statusCode: 500,
      body: JSON.stringify({
        status: 'error',
        error: error.message
      })
    };
  }
}; 