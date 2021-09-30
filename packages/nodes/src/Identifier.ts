import Node from "./Node";
import Type from "./Type";

export default class Identifier extends Node {
	constructor(public name: string, type?: Type){
		super(type);
	}
}
