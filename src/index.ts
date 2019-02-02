import { GridTableRule } from "./rules/gridtable";

export = function (md: any, options: any) {
    md.block.ruler.before(
        "table",
        "gridtable",
        GridTableRule(md));
}