import { BehaviourSubject } from "@/helpers/behaviour-subject";
import { useCallback, useEffect, useState } from "react";

export default function useStore<T>(store: BehaviourSubject<T>) {
    const [state, setState] = useState<T>(store.value);
    
    useEffect(() => {
        const s = store.subscribe(x => {
            setState(x);
        });
        return () => {
            s.unsubscribe();
        }
    }, [store]);

    const setNewValue = useCallback((newVal: T) => {
        store.emit(newVal);
    }, [store]);

    return [state, setNewValue] as [T, (v: T) => void];
}