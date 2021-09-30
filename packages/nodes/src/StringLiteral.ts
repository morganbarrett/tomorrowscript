import Node from "./Node";
import Type from "./Type";

export default class StringLiteral extends Node {
	constructor(public str: string, type?: Type){
		super(type);
	}
}
