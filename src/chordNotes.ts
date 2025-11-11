import { ChordLetter, ChordQuality, ChordSymbol } from './types';

// Map chord letters to chromatic scale positions
// C=0, C#/Db=1, D=2, D#/Eb=3, E=4, F=5, F#/Gb=6, G=7, G#/Ab=8, A=9, A#/Bb=10, B=11
const LETTER_TO_CHROMATIC: Record<string, number> = {
  'C': 0, 'C#': 1, 'Db': 1, 'D': 2, 'D#': 3, 'Eb': 3,
  'E': 4, 'F': 5, 'F#': 6, 'Gb': 6, 'G': 7, 'G#': 8,
  'Ab': 8, 'A': 9, 'A#': 10, 'Bb': 10, 'B': 11,
  'Cb': 11, 'B#': 0, 'E#': 5, 'Fb': 4
};

// Get base letter (A, B, C, D, E, F, G) from a chord letter
function getBaseLetter(letter: ChordLetter): string {
  return letter.replace(/[#b]/g, '')[0];
}

// Get the accidental count from a chord letter
function getAccidentalCount(letter: ChordLetter): number {
  if (letter.includes('##')) return 2;
  if (letter.includes('#')) return 1;
  if (letter.includes('bb')) return -2;
  if (letter.includes('b')) return -1;
  return 0;
}

// Get the letter name for a scale degree (0=root, 1=second, etc.)
function getScaleDegreeLetter(rootBase: string, degree: number): string {
  const scale = ['C', 'D', 'E', 'F', 'G', 'A', 'B'];
  const rootIndex = scale.indexOf(rootBase);
  return scale[(rootIndex + degree) % 7];
}

// Format a note with proper accidentals and enharmonic equivalent
function formatNoteWithEnharmonic(
  letter: string,
  accidental: number,
  chromaticPosition: number
): string {
  // Get the base note name
  const baseNote = letter;
  
  // Build the accidental string
  let accidentalStr = '';
  if (accidental === 2) {
    accidentalStr = '##';
  } else if (accidental === 1) {
    accidentalStr = '#';
  } else if (accidental === -2) {
    accidentalStr = '♭♭';
  } else if (accidental === -1) {
    accidentalStr = '♭';
  }
  
  const noteName = baseNote + accidentalStr;
  
  // Get the enharmonic equivalent map
  const enharmonicMap: Record<number, string> = {
    0: 'C', 1: 'C#', 2: 'D', 3: 'D#', 4: 'E', 5: 'F',
    6: 'F#', 7: 'G', 8: 'G#', 9: 'A', 10: 'A#', 11: 'B'
  };
  
  // Always show enharmonic equivalent for double accidentals
  if (accidental === 2 || accidental === -2) {
    const enharmonic = enharmonicMap[chromaticPosition].replace(/b/g, '♭').replace(/#/g, '#');
    return `${noteName} (${enharmonic})`;
  }
  
  // Show enharmonic equivalent for Fb (E), B# (C), E# (F), and Cb (B)
  if ((baseNote === 'F' && accidental === -1) || 
      (baseNote === 'B' && accidental === 1) ||
      (baseNote === 'E' && accidental === 1) ||
      (baseNote === 'C' && accidental === -1)) {
    const enharmonic = enharmonicMap[chromaticPosition].replace(/b/g, '♭').replace(/#/g, '#');
    return `${noteName} (${enharmonic})`;
  }
  
  return noteName;
}

// Get interval info for a chord quality (returns array of {degree, isMinor, isDiminished?})
function getChordIntervalInfo(quality: ChordQuality): Array<{degree: number, isMinor: boolean, isDiminished?: boolean}> {
  switch (quality) {
    case 'maj':
    case 'maj-triangle':
    case 'maj-none':
      return [
        {degree: 0, isMinor: false}, // root
        {degree: 2, isMinor: false}, // major third
        {degree: 4, isMinor: false}  // perfect fifth
      ];
    
    case 'min':
    case 'min-dash':
      return [
        {degree: 0, isMinor: false}, // root
        {degree: 2, isMinor: true},  // minor third
        {degree: 4, isMinor: false}  // perfect fifth
      ];
    
    case 'maj7':
    case 'maj7-triangle':
      return [
        {degree: 0, isMinor: false},
        {degree: 2, isMinor: false},
        {degree: 4, isMinor: false},
        {degree: 6, isMinor: false}  // major seventh
      ];
    
    case 'min7':
    case 'min7-dash':
      return [
        {degree: 0, isMinor: false},
        {degree: 2, isMinor: true},
        {degree: 4, isMinor: false},
        {degree: 6, isMinor: true}   // minor seventh
      ];
    
    case 'dom7':
      return [
        {degree: 0, isMinor: false},
        {degree: 2, isMinor: false},
        {degree: 4, isMinor: false},
        {degree: 6, isMinor: true}   // minor seventh
      ];
    
    case 'half-dim-circle':
    case 'half-dim-dash':
    case 'half-dim-min':
      return [
        {degree: 0, isMinor: false},
        {degree: 2, isMinor: true},   // minor third
        {degree: 4, isMinor: false, isDiminished: true},  // diminished fifth (tritone)
        {degree: 6, isMinor: true}    // minor seventh
      ];
    
    case 'full-dim':
    case 'dim7':
      return [
        {degree: 0, isMinor: false},
        {degree: 2, isMinor: true},   // minor third
        {degree: 4, isMinor: false, isDiminished: true},  // diminished fifth
        {degree: 5, isMinor: false}   // diminished seventh (major sixth)
      ];
    
    case 'dim':
      return [
        {degree: 0, isMinor: false},
        {degree: 2, isMinor: true},   // minor third
        {degree: 4, isMinor: false, isDiminished: true}  // diminished fifth (tritone) - use degree 4 but mark as diminished
      ];
    
    case 'aug':
      return [
        {degree: 0, isMinor: false},
        {degree: 2, isMinor: false},  // major third
        {degree: 4, isMinor: false}   // augmented fifth (needs special handling)
      ];
    
    case '6':
      return [
        {degree: 0, isMinor: false},
        {degree: 2, isMinor: false},
        {degree: 4, isMinor: false},
        {degree: 5, isMinor: false}   // major sixth
      ];
    
    case 'min6':
    case 'min6-dash':
      return [
        {degree: 0, isMinor: false},
        {degree: 2, isMinor: true},
        {degree: 4, isMinor: false},
        {degree: 5, isMinor: false}   // major sixth
      ];
    
    default:
      return [{degree: 0, isMinor: false}];
  }
}

// Calculate the notes in a chord with proper theoretical spelling
export function getChordNotes(chord: ChordSymbol): string[] {
  const { letter, quality } = chord;
  
  // Get root info
  const rootChromatic = LETTER_TO_CHROMATIC[letter];
  if (rootChromatic === undefined) {
    return [];
  }
  
  const rootBase = getBaseLetter(letter);
  const rootAccidental = getAccidentalCount(letter);
  
  // Get interval info
  const intervalInfo = getChordIntervalInfo(quality);
  
  // Calculate each note
  const notes: string[] = [];
  
  for (const interval of intervalInfo) {
    const { degree, isMinor, isDiminished } = interval;
    
    // Get the letter name for this scale degree
    const targetLetter = getScaleDegreeLetter(rootBase, degree);
    
    // Calculate semitones from root
    let semitones = 0;
    if (degree === 0) semitones = 0;
    else if (degree === 1) semitones = isMinor ? 1 : 2;
    else if (degree === 2) semitones = isMinor ? 3 : 4;
    else if (degree === 3) {
      // degree 3 can be perfect fourth (5 semitones) or diminished fifth (6 semitones)
      // Check if this is a diminished interval
      if (isDiminished || quality === 'full-dim' || quality === 'dim7' || 
          quality === 'half-dim-circle' || quality === 'half-dim-dash' || quality === 'half-dim-min') {
        semitones = 6; // diminished fifth (tritone)
      } else {
        semitones = 5; // perfect fourth
      }
    } else if (degree === 4) {
      // For augmented triads, we need to check if this is an augmented fifth
      // For diminished triads, check if this is a diminished fifth
      if (quality === 'aug') {
        semitones = 8; // augmented fifth
      } else if (isDiminished || quality === 'dim') {
        semitones = 6; // diminished fifth (tritone)
      } else {
        semitones = 7; // perfect fifth
      }
    } else if (degree === 5) semitones = isMinor ? 8 : 9;
    else if (degree === 6) semitones = isMinor ? 10 : 11;
    
    const targetChromatic = (rootChromatic + semitones) % 12;
    
    // Calculate the accidental needed
    const scalePositions: Record<string, number> = {
      'C': 0, 'D': 2, 'E': 4, 'F': 5, 'G': 7, 'A': 9, 'B': 11
    };
    
    const naturalPosition = scalePositions[targetLetter];
    
    // Calculate how many semitones we need to adjust from natural to target
    let adjustment = targetChromatic - naturalPosition;
    if (adjustment > 6) adjustment -= 12;  // Prefer flats over sharps when far
    if (adjustment < -6) adjustment += 12;
    
    // Start with the adjustment needed
    let accidental = adjustment;
    
    // Consider the root's accidental context for proper theoretical spelling
    // In flat keys (root has flat), we prefer flats for intervals
    // In sharp keys (root has sharp), we prefer sharps for intervals
    
    // For diminished and augmented chords, we need special handling
    // Check if this is a diminished chord quality (not just the interval)
    const isDiminishedChord = quality === 'dim' || quality === 'full-dim' || quality === 'dim7' ||
                              quality === 'half-dim-circle' || quality === 'half-dim-dash' || quality === 'half-dim-min';
    const isAugmentedChord = quality === 'aug';
    
    // Check if we need double accidentals
    // For diminished chords in flat keys, we often need double flats
    const doubleFlatPos = (naturalPosition - 2 + 12) % 12;
    const doubleSharpPos = (naturalPosition + 2) % 12;
    
    if (doubleFlatPos === targetChromatic) {
      // We need a double flat
      if (rootAccidental < 0 || isDiminishedChord || isDiminished) {
        accidental = -2;
      } else {
        // Try using the enharmonic equivalent instead
        accidental = adjustment;
      }
    } else if (doubleSharpPos === targetChromatic) {
      // We need a double sharp
      if (rootAccidental > 0 || isAugmentedChord) {
        accidental = 2;
      } else {
        accidental = adjustment;
      }
    } else {
      // For normal cases, adjust based on root context
      // If root is flat and we're in a flat key context, prefer flats
      if (rootAccidental < 0 && adjustment === 0 && degree > 0) {
        // Check if we should use a flat instead of natural
        const flatPos = (naturalPosition - 1 + 12) % 12;
        if (flatPos === targetChromatic) {
          accidental = -1;
        }
      }
      
      // For diminished intervals, ensure we use proper theoretical spelling
      if ((isDiminished || isDiminishedChord) && (degree === 3 || degree === 4) && rootAccidental < 0) {
        // Diminished fifth in flat keys should use double flat if needed
        if (doubleFlatPos === targetChromatic) {
          accidental = -2;
        }
      }
    }
    
    // Format the note
    const formattedNote = formatNoteWithEnharmonic(targetLetter, accidental, targetChromatic);
    notes.push(formattedNote);
  }
  
  return notes;
}

