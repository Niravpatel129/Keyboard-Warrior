import { ArrowUpIcon } from 'lucide-react';
import React, { useEffect, useRef, useState } from 'react';

export default function PromptChat({ onSubmit, inputValue, setInputValue, isThinking, errors }) {
  const textareaRef = useRef(null);
  const [dots, setDots] = useState('');
  const [wordCount, setWordCount] = useState(0);

  const handleInputChange = (e) => {
    setInputValue(e.target.value);
    setWordCount(e.target.value.trim().split(/\s+/).length);
  };

  const handleSubmit = () => {
    if (inputValue.trim() && !isThinking) {
      console.log('Submitted:', inputValue);
      onSubmit(inputValue);
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
    // Focus the textarea when the component mounts or becomes visible
    const focusTextarea = () => {
      if (textareaRef.current) {
        textareaRef.current.focus();
      }
    };

    focusTextarea();

    // Add event listeners for visibility changes
    document.addEventListener('visibilitychange', focusTextarea);
    window.addEventListener('focus', focusTextarea);

    return () => {
      // Clean up event listeners
      document.removeEventListener('visibilitychange', focusTextarea);
      window.removeEventListener('focus', focusTextarea);
    };
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
        {errors && errors.length > 0 && (
          <div className='bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-2'>
            <ul className='list-disc list-inside'>
              {errors.map((error, index) => (
                <li key={index}>{error}</li>
              ))}
            </ul>
          </div>
        )}
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
            opacity: isThinking ? 0.5 : 1,
          }}
          aria-label='Chat input'
          //   disabled={isThinking}
        />
        <div className='flex justify-between items-center px-3 py-2 bg-white sticky bottom-0'>
          <span className='text-xs text-gray-400'>Press Esc to close</span>
          <div className='flex items-center'>
            {isThinking ? (
              <span className='p-2 rounded-lg text-xs text-gray-400'>☁️ Pondering{dots}</span>
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
        {wordCount > 3 && (
          <span className='ml-2 text-xs text-gray-400 absolute top-2 right-4'>
            {wordCount}/100 words
          </span>
        )}
      </div>
    </div>
  );
}
