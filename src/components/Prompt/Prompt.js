// Prompt.js
import React, { useEffect, useState } from 'react';
import { AITextProcess } from '../../util/AITextProcess';
import PromptChat from '../PromptChat/PromptChat';
const { ipcRenderer } = window.require('electron');

function Prompt() {
  const [isThinking, setIsThinking] = useState(false);
  const [input, setInput] = useState('');

  const handleSubmit = async (value) => {
    try {
      setIsThinking(true);
      const response = await AITextProcess(value);
      console.log('🚀  response:', response);

      // e.preventDefault();
      // console.log('Submitted:', input);
      ipcRenderer.send('submit-input', response);
      window.close();
    } catch (error) {
      console.error('Error processing text with AI:', error);
    } finally {
      // delay 1 second
      setTimeout(() => {
        setIsThinking(false);
      }, 1000);
    }
  };

  const handleClose = () => {
    window.close();
  };

  useEffect(() => {
    ipcRenderer.on('highlighted-text', (event, highlightedText) => {
      setInput(highlightedText);
    });

    return () => {
      ipcRenderer.removeAllListeners('highlighted-text');
    };
  }, []);

  return (
    <div className='prompt-container h-screen w-screen'>
      <PromptChat
        onSubmit={handleSubmit}
        onClose={handleClose}
        inputValue={input}
        setInputValue={setInput}
        isThinking={isThinking}
      />
    </div>
  );
}

export default Prompt;
