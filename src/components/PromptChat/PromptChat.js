import { ArrowUpIcon } from 'lucide-react';
import React, { useEffect, useRef, useState } from 'react';

export default function PromptChat({ onSubmit, inputValue, setInputValue, isThinking }) {
  const textareaRef = useRef(null);
  const [dots, setDots] = useState('');

  const handleInputChange = (e) => {
    setInputValue(e.target.value);
  };

  const handleSubmit = () => {
    if (inputValue.trim() && !isThinking) {
      console.log('Submitted:', inputValue);
      onSubmit(inputValue);
      setInputValue('');
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      if (e.shiftKey) {
        // Shift + Enter: add a new line
        return;
      } else {
        // Enter alone: submit
        e.preventDefault();
        handleSubmit();
      }
    }
  };

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [inputValue]);

  useEffect(() => {
    // Focus the textarea when the component mounts
    if (textareaRef.current) {
      textareaRef.current.focus();
    }
  }, []);

  useEffect(() => {
    if (isThinking) {
      const interval = setInterval(() => {
        setDots((prev) => (prev.length < 3 ? prev + '.' : ''));
      }, 500);
      return () => clearInterval(interval);
    }
  }, [isThinking]);

  return (
    <div className='w-full h-full mx-auto flex flex-col bg-white'>
      <div className='overflow-hidden flex flex-col flex-grow'>
        <textarea
          ref={textareaRef}
          value={inputValue}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          placeholder='Enter your prompt here...'
          className='w-full h-full p-3 resize-none overflow-auto border-none focus:ring-0 focus:outline-none flex-grow text-sm font-sans text-gray-700 placeholder-gray-400 bg-white'
          style={{
            fontFamily:
              '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
            fontSize: '14px',
            lineHeight: '1.5',
          }}
          aria-label='Chat input'
          disabled={isThinking}
        />
        <div className='flex justify-between items-center px-3 py-2 bg-white sticky bottom-0'>
          <span className='text-xs text-gray-400'>Press Esc to close</span>
          {isThinking ? (
            <span className='p-2  rounded-lg text-xs text-gray-400'>☁️ Pondering{dots}</span>
          ) : (
            <button
              onClick={handleSubmit}
              className='p-2 bg-black hover:bg-gray-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-300'
              aria-label='Submit message'
              disabled={isThinking}
            >
              <ArrowUpIcon className='h-4 w-4 text-white' />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
