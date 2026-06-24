import type { ChordLineToken, ContentLine } from './chord.interface'
import { bracketsUnwrap, chordPatternFull } from './chord.service'

export const isChord = (text: string): boolean => chordPatternFull.test(text)

export const isChordLike = (text: string): boolean => {
  const { content } = bracketsUnwrap(text)
  return isChord(content)
}

const spaceRegex = /\s/

export const chordLineTokenize = (line: string): ChordLineToken[] => {
  const tokens: ChordLineToken[] = []
  let lastTokenStartIndex = 0

  for (let lineIndex = 0; lineIndex < line.length; lineIndex++) {
    while (lineIndex < line.length && spaceRegex.test(line.at(lineIndex)!)) {
      lineIndex++
    }

    if (lineIndex > lastTokenStartIndex) {
      tokens.push({
        type: 'space',
        value: line.substring(lastTokenStartIndex, lineIndex),
      })
      lastTokenStartIndex = lineIndex
    }

    while (lineIndex < line.length && !spaceRegex.test(line.at(lineIndex)!)) {
      lineIndex++
    }

    const tokenValue = line.substring(lastTokenStartIndex, lineIndex)

    tokens.push({
      type: isChordLike(tokenValue) ? 'chord' : 'text',
      value: line.substring(lastTokenStartIndex, lineIndex),
    })
    lastTokenStartIndex = lineIndex
  }

  return tokens
}

export const contentLineParse = (line: string): ContentLine => {
  const tokens = chordLineTokenize(line)
  const tokensCord = tokens.filter((token) => token.type === 'chord')
  const tokensText = tokens.filter((token) => token.type === 'text')

  if (tokensCord.length < tokensText.length) {
    return {
      type: 'text',
      value: line,
    }
  }

  return {
    type: 'chords',
    tokens: tokens,
  }
}

export const chordContentParse = (chordContent: string): ContentLine[] => {
  const lines = chordContent.split('\n').map((line) => contentLineParse(line))
  return lines
}
