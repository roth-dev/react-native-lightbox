// https://github.com/slorber/use-async-setState/blob/master/src/index.ts

import React, { useCallback, useEffect, useRef, useState } from 'react';

export type SyncSetState<S> = (stateUpdate: React.SetStateAction<S>) => void;
export type AsyncSetState<S> = (
  stateUpdate: React.SetStateAction<S>
) => Promise<S>;

const useAsyncSetStateFunction = <S>(
  state: S,
  setState: SyncSetState<S>
): AsyncSetState<S> => {
  const resolvers = useRef<((state: S) => void)[]>([]);

  useEffect(() => {
    resolvers.current.forEach(resolve => resolve(state));
    resolvers.current = [];
  }, [state]);

  return useCallback(
    (stateUpdate: React.SetStateAction<S>) => {
      return new Promise<S>((resolve, reject) => {
        setState(stateBefore => {
          try {
            const stateAfter =
              stateUpdate instanceof Function
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
          } catch (e) {
            reject(e);
            throw e;
          }
        });
      });
    },
    [setState]
  );
}

export const useAsyncSetState = <S>(initialState: S): [S, AsyncSetState<S>] => {
  const [state, setState] = useState(initialState);
  const setStateAsync = useAsyncSetStateFunction(state, setState);
  return [state, setStateAsync];
}
