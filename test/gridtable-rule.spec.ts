/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Bas Verweij. All rights reserved.
 *  Licensed under the MIT License. See LICENSE in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import * as MarkdownIt from "markdown-it";
import { expect } from "chai";
import readFile from './common/ReadFile';
import gridTableRulePlugin from "../src";

describe("gridtable rule", () =>
{
    it("should parse markdown with gridtables", () =>
    {
        const md = MarkdownIt();

        md.use(gridTableRulePlugin);

        const input = readFile("./test/basic.md");

        const actual = md.render(input);

        const expected = readFile("./test/basic.md.html");

        expect(actual).to.equal(expected);
    });

    it("should parse gridtables with column alignments", () =>
    {
        const md = MarkdownIt();

        md.use(gridTableRulePlugin);

        const input = readFile("./test/col-align.md");

        const actual = md.render(input);

        const expected = readFile("./test/col-align.md.html");

        expect(actual).to.equal(expected);
    });

    it("should handle invalid input", () =>
    {
        const md = MarkdownIt();

        md.use(gridTableRulePlugin);

        const data = readFile("./test/invalid.md");

        const actual = md.render(data);

        const expected = readFile("./test/invalid.md.html");

        expect(actual).to.equal(expected);
    });

    it("should parse tables with links", () =>
    {
        const md = MarkdownIt();

        md.use(gridTableRulePlugin);

        const data = readFile("./test/test-1.md");

        const actual = md.render(data);

        const expected = readFile("./test/test-1.md.html");

        expect(actual).to.equal(expected);
    });
});