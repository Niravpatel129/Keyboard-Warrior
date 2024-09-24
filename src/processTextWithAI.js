const { OpenAI } = require('openai');

const openai = new OpenAI({
  apiKey: 'sk-proj-QsIIQq4wKSaMYH8UmuNuT3BlbkFJpaLI1k8XnK2XILpHSsVi',
});

async function processTextWithAI(text, callback) {
  console.log('PROCESSING TEXT WITH AI...');

  try {
    const response = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        { role: 'system', content: 'You are a helpful assistant that corrects grammar.' },
        { role: 'user', content: `Correct the grammar of the following text:\n\n${text}` },
      ],
      max_tokens: 100,
      temperature: 0.5,
    });

    const correctedText = response.choices[0].message.content.trim();

    callback(correctedText);
  } catch (error) {
    console.error('Error processing text with AI:', error);
    callback(text); // Return original text if there's an error
  }
}

module.exports = {
  processTextWithAI,
};
