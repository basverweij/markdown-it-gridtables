import { expect } from "chai";
import { readFile } from './common';
import MarkdownIt = require("markdown-it");
import GridTable = require("../src");

describe("gridtable rule", () => {

    it("should parse markdown with gridtables", () => {
        let md = MarkdownIt();

        md.use(GridTable);

        let input = readFile("./test/test.md");

        let actual = md.render(input);

        let expected = readFile("./test/test.md.html");

        expect(actual).to.equal(expected);
    });

    it("should handle invalid input", () => {
        let md = MarkdownIt();

        md.use(GridTable);

        let data = readFile("./test/invalid.md");

        let actual = md.render(data);

        let expected = readFile("./test/invalid.md.html");

        expect(actual).to.equal(expected);
    });
});