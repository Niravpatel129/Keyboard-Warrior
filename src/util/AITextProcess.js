import axios from 'axios';

export async function AITextProcess(text) {
  console.log('AITextProcess called with text:', text);

  if (text.length > 1000 || !text || typeof text !== 'string' || text.trim().length === 0) {
    console.error('Invalid input text');
    return text;
  }

  try {
    console.log('Sending request to backend API');
    const response = await axios.post('http://localhost:3000/api/prompt/generate', { text });
    console.log('Received response from backend API:', response.data);

    if (!response.data || typeof response.data !== 'string' || response.data.trim().length === 0) {
      console.error('Invalid response from backend API');
      throw new Error('Invalid response from backend API');
    }

    const processedText = response.data.prompt.trim();
    console.log('Processed text:', processedText);
    return processedText;
  } catch (error) {
    console.error('Error processing text with AI:', error);
    return text; // Return original text if there's an error
  }
}
