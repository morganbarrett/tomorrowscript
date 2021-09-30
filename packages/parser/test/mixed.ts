import {assert} from "chai";
import Parser from "../src";
import * as nodes from "tms-nodes";

const parse = (code: string) => new Parser(code).parseExpression();

describe("Mixed", () => {
	it("Identifier then string", () => assert.throws(
		() => parse('bob "hello";'), SyntaxError, /expected ; but insted got "hello"/
	));
});
