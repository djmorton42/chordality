import { useState, useEffect } from 'react';
import ConfigScreen from './ConfigScreen';
import DisplayScreen from './DisplayScreen';
import ListScreen from './ListScreen';
import { ChordConfig, ChordSymbol } from './types';
import { generateRandomChord } from './chordUtils';
import { loadConfig, saveConfig, getDefaultConfig } from './configStorage';
import './App.css';

type Screen = 'config' | 'display' | 'list';

export default function App() {
  const [screen, setScreen] = useState<Screen>('config');
  const [config, setConfig] = useState<ChordConfig>(() => {
    // Load config from localStorage on initial render, or use defaults
    return loadConfig() || getDefaultConfig();
  });
  const [currentChord, setCurrentChord] = useState<ChordSymbol | null>(null);

  // Save config to localStorage whenever it changes
  useEffect(() => {
    saveConfig(config);
  }, [config]);

  const handleStart = () => {
    const chord = generateRandomChord(config);
    if (chord) {
      setCurrentChord(chord);
      setScreen('display');
    }
  };

  const handleNext = () => {
    const chord = generateRandomChord(config);
    if (chord) {
      setCurrentChord(chord);
    }
  };

  const handleConfig = () => {
    setScreen('config');
  };

  const handleListAll = () => {
    setScreen('list');
  };

  return (
    <div className="app">
      {screen === 'config' ? (
        <ConfigScreen
          config={config}
          onConfigChange={setConfig}
          onStart={handleStart}
          onListAll={handleListAll}
        />
      ) : screen === 'list' ? (
        <ListScreen
          config={config}
          onConfig={handleConfig}
        />
      ) : (
        currentChord && (
          <DisplayScreen
            chord={currentChord}
            onNext={handleNext}
            onConfig={handleConfig}
          />
        )
      )}
    </div>
  );
}

