// https://github.com/slorber/use-async-setState/blob/master/src/index.ts
import { useCallback, useEffect, useRef, useState } from 'react';
const useAsyncSetStateFunction = (state, setState) => {
    const resolvers = useRef([]);
    useEffect(() => {
        resolvers.current.forEach(resolve => resolve(state));
        resolvers.current = [];
    }, [state]);
    return useCallback((stateUpdate) => {
        return new Promise((resolve, reject) => {
            setState(stateBefore => {
                try {
                    const stateAfter = stateUpdate instanceof Function
                        ? stateUpdate(stateBefore)
                        : stateUpdate;
                    // If state does not change, we must resolve the promise because react won't re-render and effect will not resolve
                    if (stateAfter === stateBefore) {
                        resolve(stateAfter);
                    }
                    // Else we queue resolution until next state change
                    else {
                        resolvers.current.push(resolve);
                    }
                    return stateAfter;
                }
                catch (e) {
                    reject(e);
                    throw e;
                }
            });
        });
    }, [setState]);
};
export const useAsyncSetState = (initialState) => {
    const [state, setState] = useState(initialState);
    const setStateAsync = useAsyncSetStateFunction(state, setState);
    return [state, setStateAsync];
};
