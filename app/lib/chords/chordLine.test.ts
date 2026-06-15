import { describe, expect, it } from 'vitest'

import { parseContentLine, tokenizeLine } from './chordLine'

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

describe('lib/chords/chordLine', () => {
  it('returns tokens for line', () => {
    const result = tokenizeLine('  A    Dm  F#m    G  N.C.')

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
    const result = parseContentLine('  A    Dm  F#m    G  N.C.')

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
    const result = parseContentLine(chord)

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
    const result = parseContentLine(chord)

    expect(result.type).toBe('text')
  })
})
