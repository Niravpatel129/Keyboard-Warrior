// Prompt.js
import React, { useEffect, useState } from 'react';
import { AITextProcess } from '../../util/AITextProcess';
import PromptChat from '../PromptChat/PromptChat';
const { ipcRenderer } = window.require('electron');

function Prompt() {
  const [isThinking, setIsThinking] = useState(false);
  const [input, setInput] = useState('');
  const [selectedText, setSelectedText] = useState('');

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        ipcRenderer.send('submit-input', '');

        window.close();
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  const handleSubmit = async (value) => {
    try {
      setIsThinking(true);
      const response = await AITextProcess(selectedText, value);

      ipcRenderer.send('submit-input', response);
      window.close();
    } catch (error) {
      console.error('Error processing text with AI:', error);
    } finally {
      // delay 1 second
      setTimeout(() => {
        setIsThinking(false);
      }, 500);
    }
  };

  useEffect(() => {
    ipcRenderer.on('highlighted-text', (event, highlightedText) => {
      console.log('🚀  highlightedText:', highlightedText);

      setSelectedText(highlightedText);
    });

    return () => {
      ipcRenderer.removeAllListeners('highlighted-text');
    };
  }, []);

  return (
    <div className='prompt-container h-screen w-screen'>
      <PromptChat
        onSubmit={handleSubmit}
        inputValue={input}
        setInputValue={setInput}
        isThinking={isThinking}
      />
    </div>
  );
}

export default Prompt;
