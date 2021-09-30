import Node from "./Node";
import List from "./List";

export default class Member extends Node {
	constructor(public obj: Node, public member: Node | null) {
		super();
		if(member instanceof List){
			//need to consider fix etc
			throw new Error()
		}
	}
}
