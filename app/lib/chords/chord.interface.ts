export interface ChordLineToken {
  type: 'chord' | 'space' | 'text'
  value: string
}

export interface ContentLineText {
  type: 'text'
  value: string
}

export interface ContentLineChords {
  type: 'chords'
  tokens: ChordLineToken[]
}

export type ContentLine = ContentLineText | ContentLineChords

export interface ChordContentOptions {
  transpose?: number
}
