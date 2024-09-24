const { OpenAI } = require('openai');
const dotenv = require('dotenv');
const { playSound } = require('./soundPlayer');
const path = require('path');
const { OPEN_AI_API_KEY } = require('./config');

dotenv.config();

const openai = new OpenAI({
  apiKey: OPEN_AI_API_KEY,
});

async function processTextWithAI(text, callback) {
  // if length is too long just return the text
  if (text.length > 1000) {
    callback(text);
    return;
  }

  if (!text || typeof text !== 'string' || text.trim().length === 0) {
    console.error('Invalid input text');
    callback(text);
    return;
  }

  if (typeof callback !== 'function') {
    console.error('Invalid callback provided');
    return;
  }

  try {
    const response = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        {
          role: 'system',
          content:
            'You are a helpful assistant that corrects grammar. Only fix grammatical or spelling errors. Do not change the style or formality of the text. If the original text does not start with "I", do not add it. Maintain the original sentence structure and starting words. Do not add any additional text, do not explain yourself, do not say anything, just correct the text.',
        },
        {
          role: 'user',
          content: `Correct the grammar of the following text, maintaining its original style and structure:\n\n${text}`,
        },
      ],
      max_tokens: 1000,
      temperature: 0.5,
    });

    if (!response.choices || response.choices.length === 0 || !response.choices[0].message) {
      throw new Error('Invalid response from OpenAI API');
    }

    const correctedText = response.choices[0].message.content.trim();

    if (correctedText.length === 0) {
      throw new Error('Corrected text is empty');
    }

    // Play sound after successful processing with half volume
    const soundPath = path.join(__dirname, '..', 'assets', 'sounds', 'process.wav');
    playSound(soundPath, 0.2);

    callback(correctedText);
  } catch (error) {
    console.error('Error processing text with AI:', error);
    callback(text); // Return original text if there's an error
  }
}

module.exports = {
  processTextWithAI,
};
