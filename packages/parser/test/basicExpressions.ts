import {assert} from "chai";
import Parser from "../src";
import * as nodes from "tms-nodes";

const parse = (code: string) => new Parser(code).parseExpression();

describe("Misc", () => {
	it("Can parse nothing", () => assert.isNull(parse("")));
});

describe("Identifiers", () => {
	it("Can parse identifier", () => assert.deepEqual(
		parse("id123;"), new nodes.Identifier("id123")
	));
});

describe("Boolean literals", () => {
	it("Can parse true", () => assert.deepEqual(
		parse("true;"), new nodes.BooleanLiteral(true)
	));

	it("Can parse false", () => assert.deepEqual(
		parse("false;"), new nodes.BooleanLiteral(false)
	));
});

describe("Number literals", () => {
	it("Can parse number", () => assert.deepEqual(
		parse("123;"), new nodes.NumberLiteral(123)
	));
});

describe("Character literals", () => {
	it("Can parse character", () => assert.deepEqual(
		parse("'a';"), new nodes.CharacterLiteral("a")
	));

	it("Can parse escaped character", () => assert.deepEqual(
		parse("'\\n';"), new nodes.CharacterLiteral("\n")
	));

	it("Reports extra characters", () => assert.throws(
		() => parse("'ab';"), SyntaxError, /expected '/
	))
});

describe("String literals", () => {
	it("Can parse string", () => assert.deepEqual(
		parse('"Hello world!";'), new nodes.StringLiteral("Hello world!")
	));
});

describe("Template literals", () => {
	it("Can parse templates", () => assert.deepEqual(
		parse('`Hello`;'), new nodes.TemplateLiteral([new nodes.StringLiteral("Hello")])
	));

	it("Can parse expression", () => assert.deepEqual(
		parse('`Hello ${"world"}`;'), new nodes.TemplateLiteral([
			new nodes.StringLiteral("Hello "),
			new nodes.StringLiteral("world")
		])
	));

});

describe("Types", () => {
	it("Can parse type", () => assert.deepEqual(
		parse("x: boolean;"), new nodes.Identifier("x", new nodes.Type("boolean", " "))
	));

	//todo this should pass parser, but should fail at compile
	it("Can parse type on string", () => assert.deepEqual(
		parse('"hey": boolean;'), new nodes.StringLiteral("hey", new nodes.Type("boolean", " "))
	));
})

//todo this should pass parser, but should fail at compile
describe("Lists", () => {
	it("Can parse list", () => assert.deepEqual(
		parse("1, bob, true;"), new nodes.List([
			new nodes.NumberLiteral(1),
			new nodes.Identifier("bob"),
			new nodes.BooleanLiteral(true)
		])
	))
});

describe("Array literals", () => {
	it("Can parse array", () => assert.deepEqual(
		parse('[1, 2, 3];'), new nodes.ArrayLiteral(new nodes.List([
			new nodes.NumberLiteral(1),
			new nodes.NumberLiteral(2),
			new nodes.NumberLiteral(3)
		]))
	));
});

describe("Members", () => {
	it("Can parse member", () => assert.deepEqual(
		parse('bob[3];'), new nodes.Member(new nodes.Identifier("bob"), new nodes.NumberLiteral(3))
	));
});

describe("Parenthesis", () => {
	it("Can parse parenthesis", () => assert.deepEqual(
		parse('(1, 2, 3);'), new nodes.Parenthesis(new nodes.List([
			new nodes.NumberLiteral(1),
			new nodes.NumberLiteral(2),
			new nodes.NumberLiteral(3)
		]))
	));
});

describe("Calls", () => {
	it("Can parse call", () => assert.deepEqual(
		parse('func();'), new nodes.Call(new nodes.Identifier("func"), new nodes.List([]))
	));
});

describe("Function", () => {
	it("Can parse empty function", () => assert.deepEqual(
		parse("(){};"), new nodes.Function(new nodes.List([]), new nodes.Block([]))
	));
});
