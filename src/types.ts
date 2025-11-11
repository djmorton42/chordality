export type ChordLetter = 
  | 'A' | 'B' | 'C' | 'D' | 'E' | 'F' | 'G'
  | 'Ab' | 'Bb' | 'Cb' | 'Db' | 'Eb' | 'Fb' | 'Gb'
  | 'A#' | 'B#' | 'C#' | 'D#' | 'E#' | 'F#' | 'G#';

export type ChordQuality = 
  | 'maj'
  | 'maj-triangle'
  | 'maj-none'
  | 'min'
  | 'min-dash'
  | 'maj7'
  | 'maj7-triangle'
  | 'min7'
  | 'min7-dash'
  | 'dom7'
  | 'half-dim-circle'
  | 'half-dim-dash'
  | 'half-dim-min'
  | 'full-dim'
  | 'dim7'
  | 'dim'
  | 'aug'
  | '6'
  | 'min6'
  | 'min6-dash';

export interface ChordConfig {
  letters: Set<ChordLetter>;
  qualities: Set<ChordQuality>;
}

export interface ChordSymbol {
  letter: ChordLetter;
  quality: ChordQuality;
}

