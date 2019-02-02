export interface IMarkdownItState {
    src: string;

    bMarks: number[];

    eMarks: number[];

    blkIndent: number;

    tShift: number[];

    line: number;

    push(action: string, tag: string, level: number);
}