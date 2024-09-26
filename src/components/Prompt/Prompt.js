// Prompt.js
import React, { useEffect, useState } from 'react';
import PromptChat from '../PromptChat/PromptChat';
const { ipcRenderer } = window.require('electron');

function Prompt() {
  const [input, setInput] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Submitted:', input);
    ipcRenderer.send('submit-input', input);
    window.close();
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
      />
    </div>
  );

  return (
    <div className='prompt-container flex flex-col items-center justify-center text-black h-screen w-screen relative backdrop-filter backdrop-blur-md bg-opacity-50 bg-pink-200'>
      {/* <button
        onClick={handleClose}
        className='absolute top-4 right-4 text-gray-600 hover:text-gray-800 font-bold text-xl z-[1000] hover:cursor-pointer'
      >
        ×
      </button> */}
      <form onSubmit={handleSubmit} className='w-full h-full p-4 flex flex-col justify-center'>
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder='What can I do for you?'
          autoFocus
          className='w-full h-3/4 px-3 py-2 text-gray-700 border rounded-lg focus:outline-none resize-none mb-4 bg-white bg-opacity-50'
        />
        <button
          type='submit'
          className='w-full h-1/4 bg-pink-500 hover:bg-pink-600 text-white font-bold py-2 px-4 rounded text-xl'
        >
          Submit
        </button>
      </form>
    </div>
  );
}

export default Prompt;
