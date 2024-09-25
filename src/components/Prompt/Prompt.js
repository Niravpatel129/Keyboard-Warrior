import React, { useEffect, useState } from 'react';
const { ipcRenderer } = window.require('electron');

function Prompt() {
  const [input, setInput] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle the submission of the prompt
    console.log('Submitted:', input);
    // You can add logic here to send the input to your main process
  };

  useEffect(() => {
    ipcRenderer.on('highlighted-text', (event, highlightedText) => {
      setInput(highlightedText);
    });
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
