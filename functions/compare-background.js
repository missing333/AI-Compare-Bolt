import AIService from './aiService-background';

// This is a background function that will be triggered by Netlify
export const handler = async (event, context) => {
  // Add CORS headers
  const headers = {
    'Access-Control-Allow-Origin': process.env.NODE_ENV === 'production' 
      ? 'https://promptcompare.netlify.app'
      : 'http://localhost:5173',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Credentials': 'true'
  };

  // Handle OPTIONS request for CORS preflight
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 204,
      headers
    };
  }

  // Handle GET request for status check
  if (event.httpMethod === 'GET') {
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        status: 'complete',
        results: [] // You'll need to implement a way to store and retrieve results
      })
    };
  }

  // Handle POST request for starting comparison
  if (event.httpMethod === 'POST') {
    // Parse the incoming request body
    let body;
    try {
      body = JSON.parse(event.body);
    } catch (error) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: 'Invalid JSON' })
      };
    }

    const { models, prompt } = body;

    if (!models || !Array.isArray(models) || !prompt) {
      return {
        statusCode: 400,
        headers,
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
        headers,
        body: JSON.stringify({
          status: 'complete',
          results
        })
      };
    } catch (error) {
      console.error('Error in background function:', error);
      
      return {
        statusCode: 500,
        headers,
        body: JSON.stringify({
          status: 'error',
          error: error.message
        })
      };
    }
  }

  // Handle unsupported methods
  return {
    statusCode: 405,
    headers,
    body: JSON.stringify({ error: 'Method Not Allowed' })
  };
}; 