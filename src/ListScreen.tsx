import { ChordConfig, ChordQuality, ChordLetter } from './types';
import { formatChordSymbol } from './chordUtils';
import { getChordNotes } from './chordNotes';
import './ListScreen.css';

interface ListScreenProps {
  config: ChordConfig;
  onConfig: () => void;
}

// Group equivalent chord qualities (those that produce the same notes)
function getEquivalentQualityGroup(quality: ChordQuality): string {
  // Group equivalent qualities together
  if (quality === 'maj' || quality === 'maj-triangle' || quality === 'maj-none') return 'maj-group';
  if (quality === 'min' || quality === 'min-dash') return 'min-group';
  if (quality === 'maj7' || quality === 'maj7-triangle') return 'maj7-group';
  if (quality === 'min7' || quality === 'min7-dash') return 'min7-group';
  if (quality === 'full-dim' || quality === 'dim7') return 'dim7-group';
  if (quality === 'half-dim-circle' || quality === 'half-dim-dash' || quality === 'half-dim-min') return 'half-dim-group';
  if (quality === 'min6' || quality === 'min6-dash') return 'min6-group';
  // All others are unique
  return quality;
}

interface GroupedChord {
  letter: ChordLetter;
  qualities: ChordQuality[];
  notes: string[];
}

// Generate all possible chord combinations from config, grouped by equivalent symbols
function generateGroupedChords(config: ChordConfig): GroupedChord[] {
  const letters = Array.from(config.letters);
  const qualities = Array.from(config.qualities);
  
  // Group chords by letter and equivalent quality group
  const groupedMap = new Map<string, GroupedChord>();
  
  for (const letter of letters) {
    for (const quality of qualities) {
      const groupKey = getEquivalentQualityGroup(quality);
      const mapKey = `${letter}-${groupKey}`;
      
      if (!groupedMap.has(mapKey)) {
        // Create new group - use the first quality to get notes
        const notes = getChordNotes({ letter, quality });
        groupedMap.set(mapKey, {
          letter,
          qualities: [quality],
          notes
        });
      } else {
        // Add to existing group if quality is different
        const existing = groupedMap.get(mapKey)!;
        if (!existing.qualities.includes(quality)) {
          existing.qualities.push(quality);
        }
      }
    }
  }
  
  return Array.from(groupedMap.values());
}

// Sort grouped chords alphabetically with flats before naturals, naturals before sharps
function sortGroupedChords(chords: GroupedChord[]): GroupedChord[] {
  return [...chords].sort((a, b) => {
    const aLetter = a.letter;
    const bLetter = b.letter;
    
    // Extract base letter and accidental type
    const getAccidentalType = (letter: string): number => {
      if (letter.includes('b')) return 0; // flats come first
      if (letter.includes('#')) return 2; // sharps come last
      return 1; // naturals in the middle
    };
    
    const aBase = aLetter.replace(/[#b]/g, '');
    const bBase = bLetter.replace(/[#b]/g, '');
    
    // First compare by base letter
    if (aBase !== bBase) {
      return aBase.localeCompare(bBase);
    }
    
    // If same base letter, compare by accidental type
    const aAccType = getAccidentalType(aLetter);
    const bAccType = getAccidentalType(bLetter);
    if (aAccType !== bAccType) {
      return aAccType - bAccType;
    }
    
    // If same accidental type, compare by first quality (they're equivalent anyway)
    const aFirstQuality = getEquivalentQualityGroup(a.qualities[0]);
    const bFirstQuality = getEquivalentQualityGroup(b.qualities[0]);
    return aFirstQuality.localeCompare(bFirstQuality);
  });
}

export default function ListScreen({ config, onConfig }: ListScreenProps) {
  const groupedChords = generateGroupedChords(config);
  const sortedChords = sortGroupedChords(groupedChords);
  
  // Format all equivalent symbols for display
  const formatEquivalentSymbols = (letter: ChordLetter, qualities: ChordQuality[]): string => {
    const symbols = qualities.map(quality => formatChordSymbol({ letter, quality }));
    return symbols.join(' / ');
  };
  
  return (
    <div className="list-screen">
      <div className="list-header">
        <h1>All Selected Chords</h1>
        <button onClick={onConfig} className="back-button">
          Back to Config
        </button>
      </div>
      <div className="chord-list">
        {sortedChords.map((grouped, index) => {
          const symbolsText = formatEquivalentSymbols(grouped.letter, grouped.qualities);
          return (
            <div key={index} className="chord-item">
              <div className="chord-symbol-small">{symbolsText}</div>
              <div className="chord-notes-small">
                {grouped.notes.map((note, noteIndex) => (
                  <span key={noteIndex} className="note-small">{note}</span>
                ))}
              </div>
            </div>
          );
        })}
      </div>
      <div className="list-footer">
        <p>Total: {sortedChords.length} chord{sortedChords.length !== 1 ? 's' : ''}</p>
      </div>
    </div>
  );
}

