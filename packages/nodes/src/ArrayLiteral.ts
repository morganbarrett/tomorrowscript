import Node from "./Node";
import List from "./List";

export default class ArrayLiteral extends Node {
	constructor(public list: List){
		super();
	}
}
