import { isChordLike } from './chord'

const multiplierPattern = /^[x]\d+$/
const isMultiplier = (text: string): boolean => multiplierPattern.test(text)

export const isChordLine = (line: string): boolean => {
  const trimmed = line.trim()
  if (!trimmed) return false

  const tokens = trimmed.split(/\s+/)

  if (tokens.length === 0) return false

  const leadingTokens = tokens.slice(0, -1)
  const lastToken = tokens.at(-1)!

  return leadingTokens.every(isChordLike) && (isChordLike(lastToken) || isMultiplier(lastToken))
}
