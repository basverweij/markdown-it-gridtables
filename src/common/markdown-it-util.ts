import { IMarkdownItState } from "../interfaces/IMarkdownItState";
import { GetCells, GetColumnWidths } from "./gridtables-util";
import * as MarkdownIt from "markdown-it";

export function GetLine(
    state: IMarkdownItState,
    line: number):
    string {

    let start = state.bMarks[line] + state.blkIndent;
    let end = state.eMarks[line];

    return state.src.substr(
        start,
        end - start);
}

/**
 * Returns the char code of the character at the start of the current line,
 * or -1 if this is not available (e.g. on an empty line).
 * 
 * @param state The Markdown It state.
 */
export function GetCharCodeAtStartOfLine(
    state: IMarkdownItState,
    line: number):
    number {

    let pos =
        state.bMarks[line] +
        state.tShift[line];

    if (pos >= state.eMarks[line]) {
        return -1;
    }

    return state.src.charCodeAt(pos);
}

enum ColumnAlignments {
    None = "",
    Left = "left",
    Center = "center",
    Right = "right",
}

class ParseTableResult {
    Success: boolean = false;

    ColumnWidths: number[];

    ColumnOffsets: number[];

    ColumnAlignments: ColumnAlignments[];

    HeaderLess: boolean = false;

    HeaderLines: string[] = [];

    RowLines: string[][] = [];

    SeparatorLineOffsets: number[] = [];

    CurrentLine: number;
}

export function ParseTable(
    state: IMarkdownItState,
    startLine: number,
    endLine: number):
    ParseTableResult {

    let result = new ParseTableResult();

    let rowLine = GetLine(state, startLine);

    if (rowLine.charAt(0) != "+") {
        // line does not start with a '+'
        return result;
    }

    result.ColumnWidths = GetColumnWidths(rowLine);

    if (result.ColumnWidths.length == 0) {
        // no columns found
        return result;
    }

    result.ColumnAlignments = result.ColumnWidths
        .map(_ => ColumnAlignments.None);

    if (rowLine.indexOf(":") >= 0) {
        // column alignment specifiers present in first row line
        result.HeaderLess = true;

        // set column alignments
        result.ColumnAlignments = getColumnAlignments(
            rowLine,
            result.ColumnWidths);

        // remove alignment specifiers for further matching
        rowLine = rowLine.replace(/[:]/g, "-");
    }

    // create header line matcher
    let headerLineMatcher = new RegExp(
        "^\\+" +
        result.ColumnWidths
            .map(w => "[=:][=]{" + (w - 3) + "}[=:]\\+")
            .join("") +
        "$");

    // build column offsets
    result.ColumnOffsets = [0];

    for (let i = 0; i < result.ColumnWidths.length - 1; i++) {
        result.ColumnOffsets.push(
            result.ColumnOffsets[i] +
            result.ColumnWidths[i]);
    }

    // create cell line matcher
    let cellLineMatcher = new RegExp(
        "^\\|" +
        result.ColumnWidths
            .map(w => "[^|]{" + (w - 1) + "}\\|")
            .join("") +
        "$");

    // save first separator line offset
    result.SeparatorLineOffsets.push(startLine);

    // continue to scan until a complete table is found, or an invalid line is encountered
    let currentRow = [];
    let currentLine = startLine + 1;

    for (; currentLine <= endLine; currentLine++) {
        let line = GetLine(state, currentLine);

        if (line.charCodeAt(0) == 0x2B) { // '+'
            // separator line
            if (currentRow.length == 0) {
                // no row lines since last separator -> invalid table
                return result;
            }

            // save separator line offset
            result.SeparatorLineOffsets.push(currentLine);

            if (line == rowLine) {
                // new regular row
                result.RowLines.push(currentRow);

                if (result.HeaderLines.length == 0) {
                    result.HeaderLess = true;
                }
            } else if (!result.HeaderLess &&
                line.match(headerLineMatcher)) {
                // found header line

                if (result.HeaderLines.length > 0 ||
                    result.RowLines.length > 0) {
                    // header already found, or not the first row -> invalid table
                    return result;
                }

                // header row
                result.HeaderLines = currentRow;

                if (line.indexOf(":") >= 0) {
                    // set column alignments
                    result.ColumnAlignments = getColumnAlignments(
                        line,
                        result.ColumnWidths);
                }
            } else {
                // not a header or regular row -> invalid table
                return result;
            }

            // reset current row
            currentRow = [];
        }
        else if (line.charCodeAt(0) == 0x7C) { // '|'
            // cell line
            if (!line.match(cellLineMatcher)) {
                // cell line does not match -> invalid table
                return result;
            }

            // add the line to the current row
            currentRow.push(line);
        }
        else {
            // not a separator or cell line, check if we have a complete table
            if (currentRow.length == 0 &&
                (result.HeaderLines.length > 0 ||
                    result.RowLines.length > 0)) {
                // found a complete table
                break;
            }

            return result;
        }
    }

    result.CurrentLine = currentLine;

    result.Success = true;

    return result;
}

function getColumnAlignments(
    line: string,
    columnWidths: number[]):
    ColumnAlignments[] {

    let alignments: ColumnAlignments[] = [];

    let left = 1;
    let right = -1;

    for (let i = 0; i < columnWidths.length; i++) {
        right += columnWidths[i];

        let alignment = ColumnAlignments.None;

        if (line.charAt(right) == ":") {
            if (line.charAt(left) == ":") {
                alignment = ColumnAlignments.Center;
            } else {
                alignment = ColumnAlignments.Right;
            }
        } else if (line.charAt(left) == ":") {
            alignment = ColumnAlignments.Left;
        }

        alignments.push(alignment);

        left += columnWidths[i];
    }

    return alignments;
}

export function EmitTable(
    md: MarkdownIt,
    state: IMarkdownItState,
    result: ParseTableResult) {

    let offsets = result.SeparatorLineOffsets;

    let token = state.push('table_open', 'table', 1);
    token.map = [offsets[0], offsets[offsets.length - 1]];

    if (result.HeaderLines.length > 0) {
        // emit table header
        let token = state.push('thead_open', 'thead', 1);
        token.map = [offsets[0], offsets[1]];

        let cells = GetCells(
            result.ColumnWidths,
            result.ColumnOffsets,
            result.HeaderLines);

        ProcessRow(md, state, 'th', result.ColumnAlignments, offsets[0], offsets[1], cells);

        state.push('thead_close', 'thead', -1);

        offsets = offsets.slice(1);
    }

    // emit table body
    token = state.push('tbody_open', 'tbody', 1);
    token.map = [offsets[0], offsets[offsets.length - 1]];

    for (let i = 0; i < result.RowLines.length; i++) {
        let cells = GetCells(
            result.ColumnWidths,
            result.ColumnOffsets,
            result.RowLines[i]);

        ProcessRow(md, state, 'td', result.ColumnAlignments, offsets[i], offsets[i + 1], cells);
    }

    state.push('tbody_close', 'tbody', -1);

    state.push('table_close', 'table', -1);
}

function ProcessRow(
    md: MarkdownIt,
    state: IMarkdownItState,
    tag: string,
    columnAlignments: ColumnAlignments[],
    lineBegin: number,
    lineEnd: number,
    cells: string[][]) {

    let token = state.push('tr_open', 'tr', 1);
    token.map = [lineBegin, lineEnd];

    for (let i = 0; i < cells.length; i++) {
        let token = state.push(tag + '_open', tag, 1);
        token.map = [lineBegin + 1, lineEnd - 1];

        if (columnAlignments[i] != ColumnAlignments.None) {
            token.attrSet("style", `text-align: ${columnAlignments[i]};`);
        }

        if (cells[i].length == 0) {
            // empty cell
        }
        else if (cells[i].length == 1) {
            // single line cell -> emit as inline markdown
            let token = state.push('inline', '', 0);
            token.content = cells[i][0].trim();
            token.children = [];
        }
        else {
            // multi line cell -> render and emit as html
            let cell = md
                .render(cells[i].join('\r\n'))
                .trim();

            // remove single p tag because we're in a table cell
            if ((cell.substr(0, 3) == '<p>') &&
                (cell.substr(cell.length - 4, 4) == '</p>') &&
                (cell.indexOf('<p>', 3) == -1)) {
                cell = cell.substr(3, cell.length - 7);
            }

            let token = state.push('html_block', '', 0);
            token.content = cell;
            token.children = [];
        }

        state.push(tag + '_close', tag, -1);
    }

    state.push('tr_close', 'tr', -1);
}