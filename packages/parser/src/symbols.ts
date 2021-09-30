export const dollar = "$" as const;
export const escape = "\\" as const;

export const digit = "0123456789" as const;//todo

export const unaryOp = "!@" as const;//todo
export const bin = "|";
export const binOther = "=<>+-*^/%&.";
export const binaryOp = binOther + bin;//todo

export const questionMark = "?" as const;
export const comma = "," as const;
export const colon = ":" as const;
export const semi = ";" as const;

export const singleQuote = "'" as const;
export const doubleQuote = '"' as const;
export const templateQuote = "`" as const;

export const openParenthesis = "(" as const;
export const openCurly = "{" as const;
export const openBracket = "[" as const;

export const closeParenthesis = ")" as const;
export const closeCurly = "}" as const;
export const closeBracket = "]" as const;

export const space = " " as const;
export const tab = "\t" as const;
export const newLine = "\n" as const;

export const whitespace = space + tab + newLine;

export const typeBreak =
	singleQuote + doubleQuote + templateQuote +
	openParenthesis + openCurly + openBracket +
	closeParenthesis + closeCurly + closeBracket +
	unaryOp + binOther + questionMark + comma + colon + semi;

export const all = whitespace + typeBreak + bin;

