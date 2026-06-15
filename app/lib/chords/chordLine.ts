import { isChordLike } from './chord'

interface ChordLineToken {
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

const spaceRegex = /\s/

export const tokenizeLine = (line: string): ChordLineToken[] => {
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

export const parseContentLine = (line: string): ContentLine => {
  const tokens = tokenizeLine(line)
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
    tokens,
  }
}
