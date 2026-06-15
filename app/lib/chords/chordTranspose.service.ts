import type {
  ChordContentOptions,
  ChordLineToken,
  ContentLine,
  ContentLineChords,
} from './chord.interface'
import { bracketsUnwrap, bracketsWrap, chordPatternBasic } from './chord.service'

export const TONES: ReadonlyArray<ReadonlyArray<string>> = [
  ['C', 'B#'],
  ['C#', 'Db'],
  ['D'],
  ['D#', 'Eb'],
  ['E', 'Fb'],
  ['F', 'E#'],
  ['F#', 'Gb'],
  ['G'],
  ['G#', 'Ab'],
  ['A'],
  ['A#', 'Bb'],
  ['B', 'Cb'],
] as const

/** assumes chord string */
export const chordTranspose = (chord: string, { transpose = 0 }: ChordContentOptions) => {
  if (transpose === 0) return chord

  const match = chord.match(chordPatternBasic)
  if (!match?.groups?.baseTone) {
    throw new Error('Unable to match chord')
  }

  const chordTone = match.groups.baseTone
  const chordToneIndex = TONES.findIndex((toneAliases) => toneAliases.includes(chordTone))
  const chordToneTransposedIndex =
    (((chordToneIndex + transpose) % TONES.length) + TONES.length) % TONES.length
  const chordToneTransposed = TONES[chordToneTransposedIndex]![0]

  return chordToneTransposed + chord.substring(chordTone.length)
}

export const chordLikeTranspose = (chordLike: string, options: ChordContentOptions) => {
  const { brackets, content } = bracketsUnwrap(chordLike)
  const chordTransposed = chordTranspose(content, options)

  return bracketsWrap({
    brackets,
    content: chordTransposed,
  })
}

export const chordLineTranspose = (
  line: ContentLineChords,
  options: ChordContentOptions,
): ContentLineChords => {
  if (!options.transpose) {
    return line
  }

  const lineTokens = line.tokens
  let currentSpaceDiff = 0

  const lineTokensTransposed: ChordLineToken[] = []

  for (let i = 0; i < lineTokens.length; i++) {
    const currentToken = lineTokens[i]!

    if (currentToken.type === 'chord') {
      const valueTransposed = chordLikeTranspose(currentToken.value, options)
      currentSpaceDiff = currentToken.value.length - valueTransposed.length
      lineTokensTransposed.push({
        type: 'chord',
        value: valueTransposed,
      })
      continue
    }

    if (currentToken.type === 'space') {
      const spaceTarget = currentToken.value.length + currentSpaceDiff
      const spaceNew = Math.max(0, spaceTarget)
      currentSpaceDiff = spaceNew - spaceTarget
      lineTokensTransposed.push({
        type: 'space',
        value: Array(spaceNew).fill(' ').join(''),
      })
      continue
    }

    lineTokensTransposed.push(currentToken)
  }

  return {
    type: 'chords',
    tokens: lineTokensTransposed,
  }
}

export const chordContentTranspose = (lines: ContentLine[], options: ChordContentOptions) => {
  return lines.map((line) => (line.type === 'chords' ? chordLineTranspose(line, options) : line))
}
