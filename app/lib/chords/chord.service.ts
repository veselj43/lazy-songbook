export const chordPatternFull =
  /^(?<baseTone>[A-G][#b]?)(?<modifiers>m|maj|min|dim|aug|sus|add|#|[0-9]{0,2}){0,4}(\/(?<overTone>[A-G][#b]?))?$/

/** transpose can use simpler regex */
export const chordPatternBasic = /^(?<baseTone>[A-G][#b]?).*$/

interface TextWithBrackets {
  brackets: [string, string]
  content: string
}

interface TextWithoutBrackets {
  brackets: undefined
  content: string
}

type TextMaybeBrackets = TextWithBrackets | TextWithoutBrackets

export const bracketsUnwrap = (text: string): TextMaybeBrackets => {
  const charFirst = text.at(0)
  const charLast = text.at(-1)

  if (charFirst === '(' && charLast === ')') {
    const content = text.substring(1, text.length - 1)
    return {
      brackets: [charFirst, charLast],
      content,
    }
  }

  return {
    brackets: undefined,
    content: text,
  }
}

export const bracketsWrap = ({ brackets, content }: TextMaybeBrackets): string => {
  return brackets ? brackets[0] + content + brackets[1] : content
}
