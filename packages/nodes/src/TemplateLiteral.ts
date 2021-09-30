import Node from "./Node";

export default class TemplateLiteral extends Node {
	constructor(public arr: Node[]){
		super();
	}
}
