import * as MarkdownIt from "markdown-it";
import { expect } from "chai";
import readFile from './common/ReadFile';
import gridTableRulePlugin from "../src";

describe("gridtable rule", () =>
{
    it("should parse markdown with gridtables", () =>
    {
        let md = MarkdownIt();

        md.use(gridTableRulePlugin);

        let input = readFile("./test/basic.md");

        let actual = md.render(input);

        let expected = readFile("./test/basic.md.html");

        expect(actual).to.equal(expected);
    });

    it("should parse gridtables with column alignments", () =>
    {
        let md = MarkdownIt();

        md.use(gridTableRulePlugin);

        let input = readFile("./test/col-align.md");

        let actual = md.render(input);

        let expected = readFile("./test/col-align.md.html");

        expect(actual).to.equal(expected);
    });

    it("should handle invalid input", () =>
    {
        let md = MarkdownIt();

        md.use(gridTableRulePlugin);

        let data = readFile("./test/invalid.md");

        let actual = md.render(data);

        let expected = readFile("./test/invalid.md.html");

        expect(actual).to.equal(expected);
    });
});