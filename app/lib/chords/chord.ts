const chordPattern =
  /^(?<baseTone>[A-G][#b]?)(?<modifiers>m|maj|min|dim|aug|sus|add|#|[0-9]{0,2}){0,4}(\/(?<overTone>[A-G][#b]?))?$/

export const isChord = (text: string): boolean => chordPattern.test(text)

export const isChordLike = (text: string): boolean => {
  if (text.startsWith('(') && text.endsWith(')')) {
    const substring = text.substring(1, text.length - 1)
    return isChord(substring)
  }

  return isChord(text)
}
