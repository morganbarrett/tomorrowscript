import Node from "./Node";

export default class CharacterLiteral extends Node {
	constructor(public char: string) {
		super();
	}
}
