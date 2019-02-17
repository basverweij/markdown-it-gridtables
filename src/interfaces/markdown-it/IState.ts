import IToken from "./IToken";

export default interface IState
{
    src: string;

    bMarks: number[];

    eMarks: number[];

    blkIndent: number;

    tShift: number[];

    line: number;

    push(
        action: string,
        tag: string,
        level: number
    ): IToken;
}