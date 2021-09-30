import Node from "./Node";
import List from "./List";

export default class Call extends Node {
	constructor(public callee: Node, public args: List) {
		super();
	}
}
