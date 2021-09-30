import Node from "./Node";

export default class UnaryOperation extends Node {
	constructor(public op: string, public node: Node){
		super();
	}
}
