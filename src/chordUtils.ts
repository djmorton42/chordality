import { ChordLetter, ChordQuality, ChordSymbol, ChordConfig } from './types';

export const ALL_CHORD_LETTERS: ChordLetter[] = [
  'A', 'B', 'C', 'D', 'E', 'F', 'G',
  'Ab', 'Bb', 'Cb', 'Db', 'Eb', 'Fb', 'Gb',
  'A#', 'B#', 'C#', 'D#', 'E#', 'F#', 'G#'
];

export const ALL_CHORD_QUALITIES: ChordQuality[] = [
  'maj',
  'maj-triangle',
  'maj-none',
  'min',
  'min-dash',
  'maj7',
  'maj7-triangle',
  'min7',
  'min7-dash',
  'dom7',
  'half-dim-circle',
  'half-dim-dash',
  'half-dim-min',
  'full-dim',
  'dim7',
  'dim',
  'aug',
  '6',
  'min6',
  'min6-dash'
];

// Format a chord letter for display, replacing 'b' with flat symbol (♭)
export function formatChordLetter(letter: ChordLetter): string {
  return letter.replace(/b/g, '♭');
}

export function formatChordSymbol(chord: ChordSymbol): string {
  const { letter, quality } = chord;
  const formattedLetter = formatChordLetter(letter);
  
  switch (quality) {
    case 'maj':
      return `${formattedLetter}maj`;
    case 'maj-triangle':
      return `${formattedLetter}△`;
    case 'maj-none':
      return formattedLetter;
    case 'min':
      return `${formattedLetter}min`;
    case 'min-dash':
      return `${formattedLetter}-`;
    case 'maj7':
      return `${formattedLetter}maj7`;
    case 'maj7-triangle':
      return `${formattedLetter}△7`;
    case 'min7':
      return `${formattedLetter}min7`;
    case 'min7-dash':
      return `${formattedLetter}-7`;
    case 'dom7':
      return `${formattedLetter}7`;
    case 'half-dim-circle':
      return `${formattedLetter}∅7`;
    case 'half-dim-dash':
      return `${formattedLetter}-7♭5`;
    case 'half-dim-min':
      return `${formattedLetter}min7♭5`;
    case 'full-dim':
      return `${formattedLetter}°7`;
    case 'dim7':
      return `${formattedLetter}dim7`;
    case 'dim':
      return `${formattedLetter}dim`;
    case 'aug':
      return `${formattedLetter}+`;
    case '6':
      return `${formattedLetter}6`;
    case 'min6':
      return `${formattedLetter}min6`;
    case 'min6-dash':
      return `${formattedLetter}-6`;
    default:
      return formattedLetter;
  }
}

export function generateRandomChord(config: ChordConfig): ChordSymbol | null {
  const letters = Array.from(config.letters);
  const qualities = Array.from(config.qualities);
  
  if (letters.length === 0 || qualities.length === 0) {
    return null;
  }
  
  const randomLetter = letters[Math.floor(Math.random() * letters.length)];
  const randomQuality = qualities[Math.floor(Math.random() * qualities.length)];
  
  return {
    letter: randomLetter,
    quality: randomQuality
  };
}

