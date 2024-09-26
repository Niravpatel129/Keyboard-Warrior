import { ipcRenderer } from 'electron';
import { ArrowUpRight, Monitor, Moon, Sun } from 'lucide-react';
import React, { useEffect, useState } from 'react';

const ToggleSwitch = ({ label, checked, onChange }) => (
  <label className='flex items-center cursor-pointer'>
    <div className='relative'>
      <input type='checkbox' className='sr-only' checked={checked} onChange={onChange} />
      <div className='w-10 h-6 bg-gray-200 rounded-full shadow-inner'></div>
      <div
        className={`absolute w-4 h-4 bg-white rounded-full shadow transition-transform duration-200 ease-in-out transform ${
          checked ? 'translate-x-5' : 'translate-x-1'
        } top-1 left-0`}
      ></div>
    </div>
    <span className='ml-3 text-sm font-medium text-gray-700'>{label}</span>
  </label>
);

export default function Component() {
  const [launchAtLogin, setLaunchAtLogin] = useState(true);
  const [appearance, setAppearance] = useState('System');
  const [textSize, setTextSize] = useState('Default');
  const [shortcut, setShortcut] = useState('⌘ ,');
  const [isRecording, setIsRecording] = useState(false);
  const [recordedKeys, setRecordedKeys] = useState([]);

  useEffect(() => {
    ipcRenderer.on('shortcut-changed', (event, newShortcut) => {
      setShortcut(newShortcut);
      setIsRecording(false);
    });

    const handleKeyDown = (event) => {
      if (isRecording) {
        event.preventDefault();
        const key = event.key.toUpperCase();
        const modifiers = [];
        if (event.metaKey) modifiers.push('⌘');
        if (event.ctrlKey) modifiers.push('Ctrl');
        if (event.altKey) modifiers.push('Alt');
        if (event.shiftKey) modifiers.push('Shift');

        const newKeys = [...modifiers, key];
        setRecordedKeys(newKeys);

        // Check if we have a valid shortcut (at least one modifier and one key)
        if (
          modifiers.length > 0 &&
          key !== 'META' &&
          key !== 'CONTROL' &&
          key !== 'ALT' &&
          key !== 'SHIFT'
        ) {
          const newShortcut = newKeys.join('+');
          setShortcut(newShortcut);
          setIsRecording(false);
          ipcRenderer.send('update-shortcut', newShortcut);
        }
      }
    };

    const handleKeyUp = (event) => {
      if (isRecording) {
        // If all modifier keys are released, stop recording
        if (!event.metaKey && !event.ctrlKey && !event.altKey && !event.shiftKey) {
          setIsRecording(false);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      ipcRenderer.removeAllListeners('shortcut-changed');
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [isRecording, recordedKeys]);

  const handleShortcutChange = () => {
    setIsRecording(true);
    setRecordedKeys([]);
  };

  return (
    <div className='bg-gray-50 p-8 rounded-xl mx-auto font-sans flex flex-col min-h-screen'>
      <div className='space-y-8 flex-grow'>
        <div className='flex items-center justify-between'>
          <span className='text-gray-700'>Startup</span>
          <ToggleSwitch
            label='Launch Ghost Hand at login'
            checked={launchAtLogin}
            onChange={() => setLaunchAtLogin(!launchAtLogin)}
          />
        </div>

        <div className='flex items-center justify-between'>
          <span className='text-gray-700'>Ghost Hand Hotkey</span>
          <div className='text-right'>
            <button
              className='bg-white text-gray-700 px-4 py-2 rounded-md text-sm font-medium border border-gray-200 hover:border-gray-300 transition-colors'
              onClick={handleShortcutChange}
            >
              {isRecording ? 'Press key combination...' : shortcut}
            </button>
          </div>
        </div>

        <div className='space-y-2'>
          <span className='text-gray-700'>Text Size</span>
          <div className='flex space-x-2'>
            {['Default', 'Large'].map((size) => (
              <button
                key={size}
                onClick={() => setTextSize(size)}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  textSize === size
                    ? 'bg-gray-200 text-gray-900'
                    : 'bg-white text-gray-500 hover:bg-gray-100'
                }`}
              >
                {size === 'Default' ? 'Aa' : 'AA'}
              </button>
            ))}
          </div>
        </div>

        <div className='space-y-2'>
          <span className='text-gray-700'>Appearance</span>
          <div className='flex space-x-2'>
            {[
              { name: 'Light', icon: Sun },
              { name: 'Dark', icon: Moon },
              { name: 'System', icon: Monitor },
            ].map(({ name, icon: Icon }) => (
              <button
                key={name}
                onClick={() => setAppearance(name)}
                className={`flex items-center space-x-2 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  appearance === name
                    ? 'bg-gray-200 text-gray-900'
                    : 'bg-white text-gray-500 hover:bg-gray-100'
                }`}
              >
                <Icon className='w-5 h-5' />
                <span>{name}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className='bg-gradient-to-r from-gray-50 to-gray-100 p-6 rounded-lg flex items-center justify-between border border-gray-200 hover:border-gray-300 transition-colors cursor-pointer mt-8'>
        <div>
          <span className='text-gray-900 bg-gray-200 px-2 py-1 rounded-full text-xs font-semibold'>
            Free Trial
          </span>
          <h3 className='font-bold mt-2 text-gray-800'>25 Free Prompts</h3>
          <p className='text-sm text-gray-600'>Upgrade to unlock unlimited prompts and features</p>
        </div>
        <ArrowUpRight className='w-6 h-6 text-gray-900' />
      </div>
    </div>
  );
}
