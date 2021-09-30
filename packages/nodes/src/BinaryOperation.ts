import Node from "./Node";

export default class BinaryOperation extends Node {
	constructor(public lhs: Node, public op: string, public rhs: Node){
		super();
	}
}
