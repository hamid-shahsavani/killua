import { ThunderType } from "../types/thunder.type";
declare function useKillua<T>(args: ThunderType): {
    thunder: T;
    setThunder: (value: T | ((value: T) => T)) => void;
    reducers: Record<string, Function>;
    selectors: Record<string, Function>;
    isReadyInSsr?: Boolean;
};
export default useKillua;
