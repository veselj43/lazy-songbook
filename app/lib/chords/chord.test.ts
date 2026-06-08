import { describe, expect, it } from 'vitest'

import { isChord, isChordLike } from './chord'

const chords = [
  'A',
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
]

const chordsLike = chords.map((chord) => `(${chord})`)

describe('lib/chords', () => {
  it.for(chords)('returns true for chord %s', (chord) => {
    const result = isChord(chord)

    expect(result).toBe(true)
  })

  it.for([
    //
    ...chords,
    ...chordsLike,
  ])('returns true for chord-like %s', (chord) => {
    const result = isChordLike(chord)

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
    const result = isChord(chord)

    expect(result).toBe(false)
  })
})
