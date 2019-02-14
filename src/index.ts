import { GridTableRule } from "./rules/gridtable";

export * from "./common/gridtables-util";

export function GridTableRulePlugin(md: any, options: any) {
    md.block.ruler.before(
        "table",
        "gridtable",
        GridTableRule(md));
}