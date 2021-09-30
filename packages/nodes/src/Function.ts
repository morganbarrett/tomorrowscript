import Node from "./Node";
import List from "./List";

export default class Function extends Node {
	constructor(public args: List, public body: Node) {
		super();
	}
}
