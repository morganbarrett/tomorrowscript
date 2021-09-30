import Node from "./Node";

export default class BooleanLiteral extends Node {
	constructor(public value: boolean){
		super();
	}
}
