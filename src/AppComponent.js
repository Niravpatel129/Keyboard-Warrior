import React, { useEffect } from 'react';
import Prompt from './components/Prompt/Prompt';
import Settings from './components/Settings/Settings'; // Assuming you have a Settings component

function App() {
  const hash = window.location.hash.slice(1); // Remove the '#' from the hash

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        window.close(); // This will close the Electron window
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  return (
    <div className='App'>
      {hash === 'prompt' && <Prompt />}
      {hash === 'settings' && <Settings />}
    </div>
  );
}

export default App;
