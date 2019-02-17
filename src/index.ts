import gridTableRule from "./rules/gridtable";

export default function gridTableRulePlugin(
    md: any,
    options: any)
{
    md.block.ruler.before(
        "table",
        "gridtable",
        gridTableRule(md));
}