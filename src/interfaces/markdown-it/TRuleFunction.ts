import IState from "./IState";

type TRuleFunction = (
    state: IState,
    startLine: number,
    endLine: number,
    silent: boolean) => boolean;

export default TRuleFunction;