import { describe, expect, it } from 'vitest'

import { chordLineTokenize } from './chordParse.service'
import { chordLineTranspose, chordTranspose } from './chordTranspose.service'

describe('lib/chords/transpose.service', () => {
  describe('chord', () => {
    it.for([
      {
        chord: 'C',
        transpose: undefined,
        expectedResult: 'C',
      },
      {
        chord: 'C',
        transpose: 0,
        expectedResult: 'C',
      },
      {
        chord: 'C',
        transpose: 12,
        expectedResult: 'C',
      },
      {
        chord: 'C',
        transpose: 1,
        expectedResult: 'C#',
      },
      {
        chord: 'C',
        transpose: 2,
        expectedResult: 'D',
      },
      {
        chord: 'D',
        transpose: 1,
        expectedResult: 'D#',
      },
      {
        chord: 'D',
        transpose: 3,
        expectedResult: 'F',
      },
      {
        chord: 'D',
        transpose: -3,
        expectedResult: 'B',
      },
      {
        chord: 'Dm',
        transpose: -5,
        expectedResult: 'Am',
      },
      {
        chord: 'D7',
        transpose: -5,
        expectedResult: 'A7',
      },
      {
        chord: 'Dm7',
        transpose: -5,
        expectedResult: 'Am7',
      },
    ])('returns true for chord %s', ({ chord, transpose, expectedResult }) => {
      const result = chordTranspose(chord, { transpose })

      expect(result).toBe(expectedResult)
    })
  })

  describe('chordLine', () => {
    it('returns transposed tokens for line', () => {
      const result = chordLineTranspose(
        { type: 'chords', tokens: chordLineTokenize('  A    Dm  F#m    G  N.C.') },
        { transpose: 1 },
      )

      expect(result).toEqual({
        type: 'chords',
        tokens: [
          { type: 'space', value: '  ' },
          { type: 'chord', value: 'A#' },
          { type: 'space', value: '   ' },
          { type: 'chord', value: 'D#m' },
          { type: 'space', value: ' ' },
          { type: 'chord', value: 'Gm' },
          { type: 'space', value: '     ' },
          { type: 'chord', value: 'G#' },
          { type: 'space', value: ' ' },
          { type: 'text', value: 'N.C.' },
        ],
      })
    })

    it('returns transposed tokens for line without enough space', () => {
      const result = chordLineTranspose(
        { type: 'chords', tokens: chordLineTokenize('  A    Dm F#m    G A  N.C.') },
        { transpose: 1 },
      )

      expect(result).toEqual({
        type: 'chords',
        tokens: [
          { type: 'space', value: '  ' },
          { type: 'chord', value: 'A#' },
          { type: 'space', value: '   ' },
          { type: 'chord', value: 'D#m' },
          { type: 'space', value: '' },
          { type: 'chord', value: 'Gm' },
          { type: 'space', value: '     ' },
          { type: 'chord', value: 'G#' },
          { type: 'space', value: '' },
          { type: 'chord', value: 'A#' },
          { type: 'space', value: ' ' },
          { type: 'text', value: 'N.C.' },
        ],
      })
    })
  })
})
