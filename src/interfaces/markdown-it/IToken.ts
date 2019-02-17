export default interface IToken
{
    children: IToken[];

    content: string;

    map: number[];

    attrSet(
        name: string,
        value: string
    ): void;
}