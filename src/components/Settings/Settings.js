import { ArrowUpRight, Cog, Info, Monitor, Moon, Sun } from 'lucide-react';
import React, { useState } from 'react';

const Tab = ({ icon: Icon, text, active, onClick }) => (
  <button
    onClick={onClick}
    className={`flex items-center space-x-2 px-4 py-2 rounded-md transition-all ${
      active ? 'bg-white shadow-md text-gray-900' : 'text-gray-500 hover:bg-white hover:shadow-sm'
    }`}
  >
    <Icon className='w-5 h-5' />
    <span className='text-sm font-medium'>{text}</span>
  </button>
);

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
  const [activeTab, setActiveTab] = useState('General');
  const [launchAtLogin, setLaunchAtLogin] = useState(true);
  const [appearance, setAppearance] = useState('System');
  const [textSize, setTextSize] = useState('Default');

  return (
    <div className='bg-gray-50 p-8 rounded-xl  mx-auto font-sans'>
      <div className='flex space-x-2 mb-8'>
        {[
          { icon: Cog, text: 'General' },
          { icon: Info, text: 'About' },
        ].map((item) => (
          <Tab
            key={item.text}
            icon={item.icon}
            text={item.text}
            active={activeTab === item.text}
            onClick={() => setActiveTab(item.text)}
          />
        ))}
      </div>

      <div className='space-y-8'>
        <div className='flex items-center justify-between'>
          <span className='text-gray-700'>Startup</span>
          <ToggleSwitch
            label='Launch Raycast at login'
            checked={launchAtLogin}
            onChange={() => setLaunchAtLogin(!launchAtLogin)}
          />
        </div>

        <div className='flex items-center justify-between'>
          <span className='text-gray-700'>Raycast Hotkey</span>
          <div className='text-right'>
            <button className='bg-white text-gray-700 px-4 py-2 rounded-md text-sm font-medium border border-gray-200 hover:border-gray-300 transition-colors'>
              ⌘ Space
            </button>
            <a href='#' className='block mt-1 text-xs text-gray-900 hover:underline'>
              How to replace Spotlight with Raycast
            </a>
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

        <div className='bg-gradient-to-r from-gray-50 to-gray-100 p-6 rounded-lg flex items-center justify-between border border-gray-200'>
          <div>
            <span className='text-gray-900 bg-gray-200 px-2 py-1 rounded-full text-xs font-semibold'>
              Pro
            </span>
            <h3 className='font-bold mt-2 text-gray-800'>Unlock Custom Themes</h3>
            <p className='text-sm text-gray-600'>Try Raycast Pro with our 14 day free trial</p>
          </div>
          <ArrowUpRight className='w-6 h-6 text-gray-900' />
        </div>
      </div>
    </div>
  );
}
