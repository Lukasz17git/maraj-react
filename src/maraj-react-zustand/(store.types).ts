import { UpdateObject, UpdateValue, DotPaths, ReturnedValueInPath, select, update, KeyOf, Strict, ValueInPath } from "maraj"
import { FunctionComponentElement, ProviderProps, ReactNode, createContext, createElement, useContext } from "react"
import { StoreApi, createStore, useStore } from "zustand"

// Normal Store
export type UseStore<TState> = <U>(selector: (state: TState) => U) => U

export type UseStoreViaPath<TState> = <TPath extends DotPaths<TState>>(path: TPath) => ReturnedValueInPath<TState, TPath>
export type UseRecordStoreViaPath<TState> = <TPath extends KeyOf<TState>>(path: TPath) => ReturnedValueInPath<TState, TPath> //TState[TPath]

type UpdateState<TState> = (updates: (state: TState) => Strict<UpdateObject<TState>>) => void
type UpdateRecordStoreState<TState> = (updates: (state: TState) => Strict<UpdateObject<TState, KeyOf<TState>>>) => void

type UpdateStateViaPath<TState> = <TPath extends DotPaths<TState>>(path: TPath, newValueInPath: UpdateValue<TState, TPath>) => void
type UpdateRecordStoreStateViaPath<TState> = <TPath extends KeyOf<TState>>(path: TPath, newValueInPath: UpdateValue<TState, TPath>) => void

export type StoreProvider<TState> = (props: { children: ReactNode }) => FunctionComponentElement<ProviderProps<StoreApi<TState> | undefined>>

// Common Handlers
export type Handlers<TState> = {
   getState: StoreApi<TState>['getState'],
   setState: StoreApi<TState>['setState'],
   subscribe: StoreApi<TState>['subscribe'],
}

// Update Handlers
export type UpdateHandlers<TState> = {
   updateState: UpdateState<TState>,
   updateStateViaPath: UpdateStateViaPath<TState>,
}

export type UpdateStateAction<T extends () => (Handlers<any> & UpdateHandlers<any>)> = Parameters<ReturnType<T>['updateState']>['0']

export type RecordStoreUpdateHandlers<TState> = {
   updateState: UpdateRecordStoreState<TState>,
   updateStateViaPath: UpdateRecordStoreStateViaPath<TState>,
}