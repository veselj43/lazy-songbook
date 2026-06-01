import { describe, expect, it } from 'vitest'

import { isChordLine } from './chordLine'

const chordLines = [
  'B',
  'C',
  'C#',
  'Bm',
  'Fm',
  'Fb',
  'F#',
  'Fbm',
  'F#m',
  'A/G',
  'Am/G',
  'D/C#',
  'Em7',
  'Asus',
  'Dsus2',
  'Dsus4',
  'Dsus4/F#',
  'Em  D  C',
  'Em  D  Am  G  D/F#  Em  D  C x4',
]

describe('lib/chords', () => {
  it.for(chordLines)('returns true for chord %s', (chord) => {
    const result = isChordLine(chord)

    expect(result).toBe(true)
  })

  it.for([
    //
    'Ds',
    'J',
    'Pm',
    'P#',
    'Ff',
    'C#/J',
    'Fmall',
  ])('returns false for non-chord %s', (chord) => {
    const result = isChordLine(chord)

    expect(result).toBe(false)
  })
})
