import { ArrowUpIcon } from 'lucide-react';
import React, { useEffect, useRef } from 'react';

export default function PromptChat({ onSubmit, inputValue, setInputValue }) {
  const textareaRef = useRef(null);

  const handleInputChange = (e) => {
    setInputValue(e.target.value);
  };

  const handleSubmit = () => {
    if (inputValue.trim()) {
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

  return (
    <div className='w-full h-full mx-auto flex flex-col'>
      <div className='overflow-hidden flex flex-col flex-grow'>
        <textarea
          ref={textareaRef}
          value={inputValue}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          placeholder='Type your message here... (Shift+Enter for new line, Enter to submit)'
          className='w-full h-full p-3 resize-none overflow-auto border-none focus:ring-0 focus:outline-none flex-grow text-sm font-sans text-gray-700 placeholder-gray-400'
          style={{
            fontFamily:
              '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
            fontSize: '14px',
            lineHeight: '1.5',
          }}
          aria-label='Chat input'
        />
        <div className='flex justify-end items-center px-3 py-2 bg-white sticky bottom-0'>
          <button
            onClick={handleSubmit}
            className='p-2 bg-black hover:bg-gray-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-300'
            aria-label='Submit message'
          >
            <ArrowUpIcon className='h-4 w-4 text-white' />
          </button>
        </div>
      </div>
    </div>
  );
}
