import * as nodes from "tms-nodes";
import * as sym from "./symbols";
import Stream from "./Stream";

class End {
	constructor(
		public node: nodes.Node | null,
		public whitespace: string = ""
	){}
}

export default class Parser {
	private stream: Stream<string>;

	public constructor(
		code: string,
		public passive = false,
		public preserve = false
	){
		this.stream = new Stream([...code]);
	}

	public parseAll(): nodes.Node[] {
		let node: nodes.Node | null;
		let body: nodes.Node[] = [];

		while(node = this.parseExpression()){
			body.push(node);
		}

		return body;
	}

	public parseExpression(terminator: string = sym.semi): nodes.Node | null {
		let part: nodes.Node | End | null = null;

		do part = this.parsePart(terminator, part);
		while(!(part instanceof End));

		return part.node;
	}

	private parsePart(terminator: string, lastPart: nodes.Node | null = null): nodes.Node | End {
		let whitespace = this.stream.takeIn(sym.whitespace).join("");//todo if we move this to parse expression, so returned node can preserve whitespace
		let char = this.shift();

		switch(char){
			case sym.semi:
			case sym.closeBracket:
			case sym.closeParenthesis:
			case sym.closeCurly:
				break;
			case "0": case "1": case "2": case "3": case "4":
			case "5": case "6": case "7": case "8": case "9": {
				if(lastPart) break;
				return new nodes.NumberLiteral(Number(
					char + this.stream.takeIn(sym.digit).join("")
				));
			}
			case sym.singleQuote: {
				if(lastPart) break;
				let str = this.takeNotEscaped(sym.singleQuote);
				this.fixError(
					str.length != 1 && (str.length != 2 || str[0] != sym.escape),
					"string within character literal",
					() => {
						//todo will only fix runtime, not code
						str = str.slice(0, str.startsWith(sym.escape) ? 2 : 1)
					}
				);
				this.shift(sym.singleQuote);
				return new nodes.CharacterLiteral(str);
			}
			case sym.doubleQuote: {
				if(lastPart) break;
				let str = this.takeNotEscaped(sym.doubleQuote);
				this.shift(sym.doubleQuote);
				return new nodes.StringLiteral(str);
			}
			case sym.templateQuote: {
				if(lastPart) break;
				let arr: nodes.Node[] = [];
				while(true){
					let str = this.takeNotEscaped(sym.templateQuote, sym.dollar + sym.openCurly);
					if(str) arr.push(new nodes.StringLiteral(str));
					if(this.shift() == sym.templateQuote) break;
					this.shift(sym.openCurly);
					let exp = this.parseExpression(sym.closeCurly);
					if(!this.fixError(!exp, "Expected expression.", () => this.stream.delete(3))){
						arr.push(exp as nodes.Node);
					}
				}
				return new nodes.TemplateLiteral(arr);
			}
			case "!": case "@": {
				if(lastPart) break;
				let part = this.parsePart(terminator);//todo this will mean !x() calls !x or !x[2] == (!x)[2]
				if(!part) throw new Error("todod");//todo end of statement?
				return new nodes.UnaryOperation(char, part);
			}
			case ".": case "=": case "<": case ">": case "+": case "-": case "*": case "^": case "/": case "%": case "&": case "|": {
				//todo take a list of bin expressions, then do order of operaions on that list
				//maybe paenthesis make bin op list, and , is binop
				//todo when binop takes binop as lhs, compare order of operations
				//todo check for unarys eg prefix ++ --
				char += this.stream.takeIn(sym.binaryOp).join("");
				if(!lastPart) break;
				if(char.startsWith("//")){
					//todo preserve
					this.stream.takeNotIn(sym.newLine);
					return this.parsePart(terminator, lastPart);
				}
				//todo char.startsWith("...") ... (...x, 1...7, x...)
				let part = this.parseExpression(terminator);
				//if part instance of binop
				if(!part) throw new Error("")//expected expression?
				return new nodes.BinaryOperation(lastPart, char, part);
			}
			case sym.comma: {
				if(!lastPart) break;
				let next = this.parseExpression(terminator);
				if(!next) break;
				if(next instanceof nodes.List){
					next.arr.unshift(lastPart);
					lastPart = next;
				} else {
					lastPart = new nodes.List([lastPart, next]);
				}
				char = terminator;
				break;
			}
			case sym.questionMark: {
				throw new Error("todo ?");
			}
			case sym.colon: {
				if(!lastPart) break;
				let whitespace = this.stream.takeIn(sym.whitespace).join("");
				let str = this.stream.takeNotIn(sym.typeBreak).join("");
				let node = new nodes.Type(str, whitespace);
				lastPart.type = node;
				return lastPart;
			}
			case sym.openBracket: {
				let body = this.parseExpression(sym.closeBracket);
				if(lastPart) return new nodes.Member(lastPart, body);
				return new nodes.ArrayLiteral(nodes.List.make(body));
			}
			case sym.openParenthesis: {
				let body = nodes.List.make(this.parseExpression(sym.closeParenthesis));
				if(lastPart) return new nodes.Call(lastPart, body);
				return new nodes.Parenthesis(body);
			}
			case sym.openCurly: {
				let node: nodes.Node | null;
				const body: nodes.Node[] = [];
				while(node = this.parseExpression()) body.push(node);//todo handle }
				let block = new nodes.Block(body);
				if(!lastPart) return block;
				if(lastPart instanceof nodes.Block) throw new Error("probs")//{}{}
				//todo maybe even []{}
				if(lastPart instanceof nodes.Parenthesis){
					return new nodes.Function(lastPart.list, block);
				}
				if(lastPart instanceof nodes.Identifier || lastPart instanceof nodes.Call){
					return new Blocked();
				}
				throw new Error();
			}
			default: {
				char += this.stream.takeNotIn(sym.all).join("");
				if(lastPart) break;
				switch(char){
					case "true": return new nodes.BooleanLiteral(true);
					case "false": return new nodes.BooleanLiteral(false);
					case "return": return new nodes.Return(this.parseExpression(terminator));
					// case "abstract":
					// case "class":
					default: return new nodes.Identifier(char);
				}
			}
		}

		this.fixError(
			char != terminator,
			lastPart ?
				`Expected "${terminator}", instead got "${char}".` :
				`Unexpected "${char}.`,
			() => {
				if(lastPart){
					this.stream.seen(terminator);
					if(char) this.stream.unshift(char);
				} else {
					this.stream.delete();
				}
			}
		);

		return new End(lastPart, whitespace);
	}

	//todo this is prime example of why compile time transformations are needed
	private takeNotEscaped(...terminators: string[]): string {
		return this.stream.take(char => char == sym.escape ||
			terminators.every(term => !this.stream.lookAhead(term))
		).join("");
	}

	private shift(expected?: string): string {
		let char = this.stream.shift();
		this.fixError(!char,
			`Unexpected end of file${expected ? `, expected "${expected}"` : ""}.`,
			() => {if(expected) this.stream.seen(expected);}
		);
		return char as string;
	}

	private fixError(condition: boolean, msg: string, fix?: () => void): boolean{
		if(!condition) return false;
		if(!this.passive) throw new Error(msg);
		if(fix) fix();
		return true;
	}
}
