// Audio utilities for playing chords and arpeggios

// Chromatic scale positions (C=0, C#/Db=1, ..., B=11)
const CHROMATIC_POSITIONS: Record<string, number> = {
  'C': 0, 'C#': 1, 'C♭♭': 10, 'C##': 2,
  'D♭': 1, 'D': 2, 'D#': 3, 'D♭♭': 0, 'D##': 4,
  'E♭': 3, 'E': 4, 'E#': 5, 'E♭♭': 2, 'E##': 6,
  'F♭': 4, 'F': 5, 'F#': 6, 'F♭♭': 3, 'F##': 7,
  'G♭': 6, 'G': 7, 'G#': 8, 'G♭♭': 5, 'G##': 9,
  'A♭': 8, 'A': 9, 'A#': 10, 'A♭♭': 7, 'A##': 11,
  'B♭': 10, 'B': 11, 'B#': 0, 'B♭♭': 9, 'B##': 1
};

// Calculate frequency from chromatic position and octave
// A4 (440 Hz) is at position 9, octave 4
function getFrequency(chromaticPosition: number, octave: number = 4): number {
  const A4_FREQ = 440;
  const A4_POSITION = 9;
  const A4_OCTAVE = 4;
  
  // Calculate semitones from A4
  const semitones = (octave - A4_OCTAVE) * 12 + (chromaticPosition - A4_POSITION);
  
  // Calculate frequency using equal temperament
  return A4_FREQ * Math.pow(2, semitones / 12);
}

// Get chromatic position from note name
function getChromaticPosition(noteString: string): number {
  // Remove enharmonic equivalent in brackets if present
  let noteName = noteString.split('(')[0].trim();
  
  // Get chromatic position
  let chromaticPosition = CHROMATIC_POSITIONS[noteName];
  
  // If not found, try to parse it
  if (chromaticPosition === undefined) {
    // Extract base letter
    const baseLetter = noteName[0];
    const basePositions: Record<string, number> = {
      'C': 0, 'D': 2, 'E': 4, 'F': 5, 'G': 7, 'A': 9, 'B': 11
    };
    
    let basePos = basePositions[baseLetter];
    if (basePos === undefined) {
      return 9; // Default to A
    }
    
    // Count accidentals
    let accidentalCount = 0;
    if (noteName.includes('♭♭')) accidentalCount = -2;
    else if (noteName.includes('##')) accidentalCount = 2;
    else if (noteName.includes('♭')) accidentalCount = -1;
    else if (noteName.includes('#')) accidentalCount = 1;
    
    chromaticPosition = (basePos + accidentalCount + 12) % 12;
  }
  
  return chromaticPosition;
}

// Parse note name and get frequency (handles enharmonic equivalents in brackets)
function parseNoteFrequency(noteString: string, octave: number = 4): number {
  const chromaticPosition = getChromaticPosition(noteString);
  return getFrequency(chromaticPosition, octave);
}

// Play a single note
function playNote(
  audioContext: AudioContext,
  frequency: number,
  duration: number,
  startTime: number = 0
): void {
  const oscillator = audioContext.createOscillator();
  const gainNode = audioContext.createGain();
  
  oscillator.connect(gainNode);
  gainNode.connect(audioContext.destination);
  
  oscillator.frequency.value = frequency;
  oscillator.type = 'sine';
  
  // Envelope: quick attack, sustain, release
  const now = audioContext.currentTime + startTime;
  gainNode.gain.setValueAtTime(0, now);
  gainNode.gain.linearRampToValueAtTime(0.3, now + 0.01);
  gainNode.gain.linearRampToValueAtTime(0.3, now + duration - 0.1);
  gainNode.gain.linearRampToValueAtTime(0, now + duration);
  
  oscillator.start(now);
  oscillator.stop(now + duration);
}

// Calculate proper octaves so each note is higher than the previous
function calculateOctaves(noteStrings: string[]): number[] {
  const chromaticPositions = noteStrings.map(getChromaticPosition);
  const octaves: number[] = [];
  
  // Start with root at octave 4
  octaves[0] = 4;
  
  // For each subsequent note, ensure it's higher than the previous
  for (let i = 1; i < noteStrings.length; i++) {
    const prevPos = chromaticPositions[i - 1];
    const prevOctave = octaves[i - 1];
    const currPos = chromaticPositions[i];
    
    // If current position is less than previous, it needs to be in next octave
    if (currPos <= prevPos) {
      octaves[i] = prevOctave + 1;
    } else {
      octaves[i] = prevOctave;
    }
  }
  
  return octaves;
}

// Play a chord (all notes simultaneously)
export function playChord(noteStrings: string[]): void {
  try {
    const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    
    // Calculate proper octaves so each note is higher than the previous
    const octaves = calculateOctaves(noteStrings);
    
    const frequencies = noteStrings.map((note, index) => 
      parseNoteFrequency(note, octaves[index])
    );
    const duration = 1.5; // seconds
    
    frequencies.forEach((freq, index) => {
      // Slight delay for each voice to avoid phase issues
      playNote(audioContext, freq, duration, index * 0.01);
    });
  } catch (error) {
    console.error('Error playing chord:', error);
  }
}

// Play an arpeggio (notes sequentially)
export function playArpeggio(noteStrings: string[]): void {
  try {
    const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    
    // Calculate proper octaves so each note is higher than the previous
    const octaves = calculateOctaves(noteStrings);
    
    const frequencies = noteStrings.map((note, index) => 
      parseNoteFrequency(note, octaves[index])
    );
    const noteDuration = 0.4; // seconds per note
    
    frequencies.forEach((freq, index) => {
      playNote(audioContext, freq, noteDuration, index * noteDuration);
    });
  } catch (error) {
    console.error('Error playing arpeggio:', error);
  }
}

