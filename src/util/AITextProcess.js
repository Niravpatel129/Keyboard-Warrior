import axios from 'axios';

export async function AITextProcess(selectedText, prompt) {
  console.log('AITextProcess called with selectedText:', selectedText);
  console.log('Prompt:', prompt);

  if (!prompt || typeof prompt !== 'string' || prompt.trim().length === 0) {
    console.error('Invalid input: prompt is required');
    return selectedText || '';
  }

  try {
    console.log('Sending request to backend API');
    const response = await axios.post('http://localhost:3000/api/prompt/generate', {
      selectedText: selectedText || '',
      prompt,
    });
    console.log('Received response from backend API:', response.data);

    if (
      !response.data ||
      typeof response.data.prompt !== 'string' ||
      response.data.prompt.trim().length === 0
    ) {
      console.error('Invalid response from backend API');
      throw new Error('Invalid response from backend API');
    }

    const processedText = response.data.prompt.trim();
    console.log('Processed text:', processedText);
    return processedText;
  } catch (error) {
    console.error('Error processing text with AI:', error);
    return selectedText || ''; // Return original text (or empty string) if there's an error
  }
}
