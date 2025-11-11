import { useState } from 'react';
import { ChordSymbol } from './types';
import { formatChordSymbol } from './chordUtils';
import { getChordNotes } from './chordNotes';
import { playChord, playArpeggio } from './audioUtils';
import './DisplayScreen.css';

interface DisplayScreenProps {
  chord: ChordSymbol;
  onNext: () => void;
  onConfig: () => void;
}

export default function DisplayScreen({ chord, onNext, onConfig }: DisplayScreenProps) {
  const [showNotes, setShowNotes] = useState(false);
  const chordText = formatChordSymbol(chord);
  const notes = getChordNotes(chord);

  const handleCheck = () => {
    setShowNotes(!showNotes);
  };

  const handleNext = () => {
    setShowNotes(false);
    onNext();
  };

  const handlePlayChord = () => {
    playChord(notes);
  };

  const handlePlayArpeggio = () => {
    playArpeggio(notes);
  };

  return (
    <div className="display-screen">
      <div className="chord-display">
        <div className="chord-symbol">{chordText}</div>
        {showNotes && (
          <div className="chord-notes">
            <div className="notes-label">Notes:</div>
            <div className="notes-list">
              {notes.map((note, index) => (
                <span key={index} className="note-item">{note}</span>
              ))}
            </div>
          </div>
        )}
      </div>
      <div className="button-container">
        <div className="button-group button-group-first">
          <button onClick={handleCheck} className="action-button check-button">
            Check
          </button>
          <button onClick={handleNext} className="action-button next-button">
            Next
          </button>
          <button onClick={onConfig} className="action-button config-button">
            Config
          </button>
        </div>
        <div className="button-group button-group-second">
          <button onClick={handlePlayChord} className="action-button play-chord-button">
            Play Chord
          </button>
          <button onClick={handlePlayArpeggio} className="action-button play-arpeggio-button">
            Play Arpeggio
          </button>
        </div>
      </div>
    </div>
  );
}

