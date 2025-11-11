import { ChordLetter, ChordQuality, ChordConfig } from './types';
import { ALL_CHORD_LETTERS, ALL_CHORD_QUALITIES, formatChordLetter } from './chordUtils';
import './ConfigScreen.css';

interface ConfigScreenProps {
  config: ChordConfig;
  onConfigChange: (config: ChordConfig) => void;
  onStart: () => void;
  onListAll: () => void;
}

const QUALITY_LABELS: Record<ChordQuality, string> = {
  'maj': 'Major (maj)',
  'maj-triangle': 'Major (△)',
  'maj-none': 'Major (no symbol)',
  'min': 'Minor (min)',
  'min-dash': 'Minor (-)',
  'maj7': 'Major 7 (maj7)',
  'maj7-triangle': 'Major 7 (△7)',
  'min7': 'Minor 7 (min7)',
  'min7-dash': 'Minor 7 (-7)',
  'dom7': 'Dominant 7 (7)',
  'half-dim-circle': 'Half diminished (∅7)',
  'half-dim-dash': 'Half diminished (-7♭5)',
  'half-dim-min': 'Half diminished (min7♭5)',
  'full-dim': 'Fully diminished 7 (°7)',
  'dim7': 'Fully diminished 7 (dim7)',
  'dim': 'Diminished (dim)',
  'aug': 'Augmented (+)',
  '6': '6',
  'min6': 'Minor 6 (min6)',
  'min6-dash': 'Minor 6 (-6)'
};

// Group letters by base letter (A, B, C, etc.) with their variants
function getGroupedLetters(): ChordLetter[][] {
  const letterMap: Record<string, ChordLetter[]> = {
    'A': ['A', 'Ab', 'A#'],
    'B': ['B', 'Bb', 'B#'],
    'C': ['C', 'Cb', 'C#'],
    'D': ['D', 'Db', 'D#'],
    'E': ['E', 'Eb', 'E#'],
    'F': ['F', 'Fb', 'F#'],
    'G': ['G', 'Gb', 'G#']
  };
  
  return ['A', 'B', 'C', 'D', 'E', 'F', 'G'].map(base => {
    return letterMap[base].filter(letter => ALL_CHORD_LETTERS.includes(letter));
  });
}

export default function ConfigScreen({ config, onConfigChange, onStart, onListAll }: ConfigScreenProps) {
  const groupedLetters = getGroupedLetters();

  const toggleLetter = (letter: ChordLetter) => {
    const newLetters = new Set(config.letters);
    if (newLetters.has(letter)) {
      newLetters.delete(letter);
    } else {
      newLetters.add(letter);
    }
    onConfigChange({ ...config, letters: newLetters });
  };

  const toggleQuality = (quality: ChordQuality) => {
    const newQualities = new Set(config.qualities);
    if (newQualities.has(quality)) {
      newQualities.delete(quality);
    } else {
      newQualities.add(quality);
    }
    onConfigChange({ ...config, qualities: newQualities });
  };

  const selectAllLetters = () => {
    onConfigChange({ ...config, letters: new Set(ALL_CHORD_LETTERS) });
  };

  const deselectAllLetters = () => {
    onConfigChange({ ...config, letters: new Set() });
  };

  const selectAllQualities = () => {
    onConfigChange({ ...config, qualities: new Set(ALL_CHORD_QUALITIES) });
  };

  const deselectAllQualities = () => {
    onConfigChange({ ...config, qualities: new Set() });
  };

  const canStart = config.letters.size > 0 && config.qualities.size > 0;

  return (
    <div className="config-screen">
      <div className="app-header">
        <img src="/chordality-logo.png" alt="Chordality" className="app-logo" />
        <h1>Chordality</h1>
      </div>
      
      <div className="config-section">
        <div className="section-header">
          <h2>Chord Letters</h2>
          <div className="select-buttons">
            <button onClick={selectAllLetters} className="select-btn">Select All</button>
            <button onClick={deselectAllLetters} className="select-btn">Deselect All</button>
          </div>
        </div>
        <div className="checkbox-grid letters-grid">
          {groupedLetters.map((group, groupIndex) => (
            <div key={groupIndex} className="letter-group">
              {group.map(letter => (
                <label key={letter} className="checkbox-label">
                  <input
                    type="checkbox"
                    checked={config.letters.has(letter)}
                    onChange={() => toggleLetter(letter)}
                  />
                  <span>{formatChordLetter(letter)}</span>
                </label>
              ))}
            </div>
          ))}
        </div>
      </div>

      <div className="config-section">
        <div className="section-header">
          <h2>Chord Qualities</h2>
          <div className="select-buttons">
            <button onClick={selectAllQualities} className="select-btn">Select All</button>
            <button onClick={deselectAllQualities} className="select-btn">Deselect All</button>
          </div>
        </div>
        <div className="checkbox-list qualities-grid">
          {ALL_CHORD_QUALITIES.map(quality => (
            <label key={quality} className="checkbox-label">
              <input
                type="checkbox"
                checked={config.qualities.has(quality)}
                onChange={() => toggleQuality(quality)}
              />
              <span>{QUALITY_LABELS[quality]}</span>
            </label>
          ))}
        </div>
      </div>

      <div className="action-buttons">
        <button 
          onClick={onStart} 
          disabled={!canStart}
          className="start-button"
        >
          Start
        </button>
        <button 
          onClick={onListAll} 
          disabled={!canStart}
          className="list-all-button"
        >
          List All
        </button>
      </div>
      
      {!canStart && (
        <p className="warning">Please select at least one chord letter and one chord quality.</p>
      )}
    </div>
  );
}

