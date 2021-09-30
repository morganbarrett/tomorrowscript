import Node from "./Node";

export default class NumberLiteral extends Node {
	constructor(public value: number){
		super();
	}
}
