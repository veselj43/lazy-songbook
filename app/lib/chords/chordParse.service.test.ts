import { describe, expect, it } from 'vitest'

import { chordLineTokenize, contentLineParse, isChord, isChordLike } from './chordParse.service'

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
  'Em  D  Am  G  D/F#  Em  D  C N.C.',
  'Em  D  Am  G  D/F#  Em  D  C    maybe F',
]

describe('lib/chords/chordParse.service', () => {
  describe('chord', () => {
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

  describe('chordLine', () => {
    it('returns tokens for line', () => {
      const result = chordLineTokenize('  A    Dm  F#m    G  N.C.')

      expect(result).toEqual([
        { type: 'space', value: '  ' },
        { type: 'chord', value: 'A' },
        { type: 'space', value: '    ' },
        { type: 'chord', value: 'Dm' },
        { type: 'space', value: '  ' },
        { type: 'chord', value: 'F#m' },
        { type: 'space', value: '    ' },
        { type: 'chord', value: 'G' },
        { type: 'space', value: '  ' },
        { type: 'text', value: 'N.C.' },
      ])
    })

    it('returns parsed line for chords', () => {
      const result = contentLineParse('  A    Dm  F#m    G  N.C.')

      expect(result).toEqual({
        type: 'chords',
        tokens: [
          { type: 'space', value: '  ' },
          { type: 'chord', value: 'A' },
          { type: 'space', value: '    ' },
          { type: 'chord', value: 'Dm' },
          { type: 'space', value: '  ' },
          { type: 'chord', value: 'F#m' },
          { type: 'space', value: '    ' },
          { type: 'chord', value: 'G' },
          { type: 'space', value: '  ' },
          { type: 'text', value: 'N.C.' },
        ],
      })
    })

    it.for(chordLines)('returns chords for line %s', (chord) => {
      const result = contentLineParse(chord)

      expect(result.type).toBe('chords')
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
    ])('returns text for non-chord line %s', (chord) => {
      const result = contentLineParse(chord)

      expect(result.type).toBe('text')
    })
  })
})
