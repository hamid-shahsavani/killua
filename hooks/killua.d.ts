import { ThunderType } from "../types/thunder.type";
declare function useKillua<T>(args: ThunderType): {
    value: T;
    setValue: (value: T | ((value: T) => T)) => void;
    isReady: Boolean;
    actions: Record<string, Function>;
};
export default useKillua;
