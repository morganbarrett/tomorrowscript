import Node from "./Node";

export default class Comment extends Node {
	constructor(public message: string){
		super();
	}
}
