import { IMarkdownItState } from "../interfaces/IMarkdownItState";
import { GetCharCodeAtStartOfLine, ParseTable, EmitTable } from "../common/markdown-it-util";
import * as MarkdownIt from "markdown-it";

type RuleFunction = (
    state: IMarkdownItState,
    startLine: number,
    endLine: number,
    silent: boolean) => boolean;

export function GridTableRule(
    md: MarkdownIt):
    RuleFunction {

    return function (
        state: IMarkdownItState,
        startLine: number,
        endLine: number,
        silent: boolean): boolean {

        if (GetCharCodeAtStartOfLine(state, startLine) != 0x2B) {
            // line does not start with a '+'
            return false;
        }

        let parseResult = ParseTable(state, startLine, endLine);

        if (!parseResult.Success) {
            return false;
        }

        if (silent) {
            return true;
        }

        EmitTable(md, state, parseResult);

        state.line = parseResult.CurrentLine;

        return true;
    };
}
