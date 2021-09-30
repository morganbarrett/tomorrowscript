//todo not sure about any of this

import Stream from "./Stream";

export class FixableStream extends Stream<string> {
	public insert(str: string, distanceBehind = 0){

	}
}

export class FixableError {
	constructor(
		public readonly msg: string,
		public readonly fix: (stream: FixableStream) => any)
	{}
}

export class SemiError extends FixableError {
	constructor(){
		super(
			"Expected semicolon.",
			stream => stream.insert(";", 1)
		);
	}
}
