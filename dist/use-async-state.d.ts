import React from 'react';
export declare type SyncSetState<S> = (stateUpdate: React.SetStateAction<S>) => void;
export declare type AsyncSetState<S> = (stateUpdate: React.SetStateAction<S>) => Promise<S>;
export declare const useAsyncSetState: <S>(initialState: S) => [S, AsyncSetState<S>];
