import Node from "./Node";

export default class List extends Node {
	constructor(public arr: Node[]){
		super();
	}

	static make(node: Node | null): List {
		if(node instanceof List) return node;
		return new List(node ? [node] : []);
	}
}
