import React from 'react';
import Prompt from './components/Prompt/Prompt';
import Settings from './components/Settings/Settings'; // Assuming you have a Settings component

function App() {
  const hash = window.location.hash.slice(1); // Remove the '#' from the hash

  return (
    <div className='App'>
      <div className='title-bar'>{/* invisible title bar for draggable window */}</div>
      {hash === 'prompt' && <Prompt />}
      {hash === 'settings' && <Settings />}
    </div>
  );
}

export default App;
