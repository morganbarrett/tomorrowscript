import Node from "./Node";
import List from "./List";

export default class Parenthesis extends Node {
	constructor(public list: List){
		super();
	}
}
