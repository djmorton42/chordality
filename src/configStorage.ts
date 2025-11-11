import { ChordConfig, ChordLetter, ChordQuality } from './types';
import { ALL_CHORD_LETTERS, ALL_CHORD_QUALITIES } from './chordUtils';

const STORAGE_KEY = 'chordRandomizerConfig';

// Convert Set to array for JSON serialization
interface SerializableConfig {
  letters: ChordLetter[];
  qualities: ChordQuality[];
}

// Save config to localStorage
export function saveConfig(config: ChordConfig): void {
  try {
    const serializable: SerializableConfig = {
      letters: Array.from(config.letters),
      qualities: Array.from(config.qualities)
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(serializable));
  } catch (error) {
    console.error('Failed to save config to localStorage:', error);
  }
}

// Load config from localStorage
export function loadConfig(): ChordConfig | null {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) {
      return null;
    }
    
    const serializable: SerializableConfig = JSON.parse(stored);
    
    // Validate and convert back to Sets
    const letters = new Set<ChordLetter>();
    const qualities = new Set<ChordQuality>();
    
    // Only add valid letters
    serializable.letters.forEach(letter => {
      if (ALL_CHORD_LETTERS.includes(letter)) {
        letters.add(letter);
      }
    });
    
    // Only add valid qualities
    serializable.qualities.forEach(quality => {
      if (ALL_CHORD_QUALITIES.includes(quality)) {
        qualities.add(quality);
      }
    });
    
    // Return null if no valid items (to use defaults)
    if (letters.size === 0 || qualities.size === 0) {
      return null;
    }
    
    return { letters, qualities };
  } catch (error) {
    console.error('Failed to load config from localStorage:', error);
    return null;
  }
}

// Get default config
export function getDefaultConfig(): ChordConfig {
  return {
    letters: new Set(ALL_CHORD_LETTERS),
    qualities: new Set(ALL_CHORD_QUALITIES)
  };
}


