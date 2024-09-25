// Prompt.js
import React, { useEffect, useState } from 'react';
const { ipcRenderer } = window.require('electron');

function Prompt() {
  const [input, setInput] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Submitted:', input);
    // Send the input to the main process
    ipcRenderer.send('submit-input', input);
    // Close the window
    window.close();
  };

  useEffect(() => {
    ipcRenderer.on('highlighted-text', (event, highlightedText) => {
      setInput(highlightedText);
    });

    // Clean up the listener when the component unmounts
    return () => {
      ipcRenderer.removeAllListeners('highlighted-text');
    };
  }, []);

  return (
    <div className='prompt-container'>
      <form onSubmit={handleSubmit}>
        <input
          type='text'
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder='Enter your prompt...'
          autoFocus
        />
        <button type='submit'>Submit</button>
      </form>
    </div>
  );
}

export default Prompt;
