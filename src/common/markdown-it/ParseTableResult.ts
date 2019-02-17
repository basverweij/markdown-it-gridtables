import ColumnAlignments from "./ColumnAlignments";

export default class ParseTableResult
{
    Success: boolean = false;

    ColumnWidths: number[] = [];

    ColumnOffsets: number[] = [];

    ColumnAlignments: ColumnAlignments[] = [];

    HeaderLess: boolean = false;

    HeaderLines: string[] = [];

    RowLines: string[][] = [];

    SeparatorLineOffsets: number[] = [];

    CurrentLine: number = 0;
}
