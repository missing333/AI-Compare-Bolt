import AIService from './aiService-background';

// This is a background function that will be triggered by Netlify
export const handler = async (event, context) => {
  // Add CORS headers
  const headers = {
    'Access-Control-Allow-Origin': process.env.NODE_ENV === 'production' 
      ? 'https://promptcompare.netlify.app'
      : 'http://localhost:5173',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Accept',
    'Access-Control-Allow-Credentials': 'true',
    'Content-Type': 'application/json'
  };

  // Handle OPTIONS request for CORS preflight
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 204,
      headers: {
        ...headers,
        'Content-Type': 'text/plain'
      }
    };
  }

  try {
    // Handle GET request for status check
    if (event.httpMethod === 'GET') {
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({
          status: 'processing',
          message: 'Your request is still being processed'
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
          body: JSON.stringify({ 
            status: 'error',
            error: 'Invalid JSON in request body' 
          })
        };
      }

      const { models, prompt } = body;

      if (!models || !Array.isArray(models) || !prompt) {
        return {
          statusCode: 400,
          headers,
          body: JSON.stringify({ 
            status: 'error',
            error: 'Invalid request. Required: models (array) and prompt (string)' 
          })
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
            error: error.message || 'An unknown error occurred'
          })
        };
      }
    }

    // Handle unsupported methods
    return {
      statusCode: 405,
      headers,
      body: JSON.stringify({ 
        status: 'error',
        error: 'Method Not Allowed' 
      })
    };
  } catch (error) {
    // Catch any unexpected errors
    console.error('Unexpected error in background function:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({
        status: 'error',
        error: 'An unexpected error occurred'
      })
    };
  }
}; 