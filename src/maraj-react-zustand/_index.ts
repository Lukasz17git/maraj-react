import { DotPathUpdateObject, DotPathUpdateValue, DotPaths, ReturnedValueInDotPath, ValueInDotPath, select, updateImmutably } from "maraj"
import { Provider, createContext, useContext } from "react"
import { StoreApi, createStore, useStore } from "zustand"

type StoreWrapper<TState, TStoreName extends string> = { [K in `root${TStoreName}Store`]: StoreApi<TState> }

type UseStore<TState> = <U>(selector: (state: TState) => U) => U
type UseStoreWrapper<TState, TStoreName extends string> = { [K in `use${TStoreName}Store`]: UseStore<TState> }

type UseStoreViaPath<TState> = <TPath extends DotPaths<TState>>(path: TPath) => ReturnedValueInDotPath<TState, TPath>
type UseStoreViaPathWrapper<TState, TStoreName extends string> = { [K in `use${TStoreName}StoreViaPath`]: UseStoreViaPath<TState> }

type UpdateStore<TState> = (updates: (state: TState) => DotPathUpdateObject<TState>) => void
type UpdateStoreWrapper<TState, TStoreName extends string> = { [K in `update${TStoreName}Store`]: UpdateStore<TState> }

type UpdateStoreViaPath<TState> = <TPath extends DotPaths<TState>>(path: TPath, newValueInPath: DotPathUpdateValue<TState, TPath>) => void
type UpdateStoreViaPathWrapper<TState, TStoreName extends string> = { [K in `update${TStoreName}StoreViaPath`]: UpdateStoreViaPath<TState> }

type ComponentStoreWrapper<TState, TStoreName extends string> =
   StoreWrapper<TState, TStoreName>
   & UseStoreWrapper<TState, TStoreName>
   & UseStoreViaPathWrapper<TState, TStoreName>
   & UpdateStoreWrapper<TState, TStoreName>
   & UpdateStoreViaPathWrapper<TState, TStoreName>

type CreateComponentStore = <TStoreName extends string, TState extends object>(storeName: TStoreName, defaultState: TState) => ComponentStoreWrapper<TState, TStoreName>

//@ts-ignore: cant check computed properties
export const createComponentStore: CreateComponentStore = (storeName, defaultState) => {
   const store = createStore(() => (defaultState))
   const _useStore: UseStore<typeof defaultState> = (selector) => useStore(store, selector)
   const _useStoreViaPath: UseStoreViaPath<typeof defaultState> = (path) => useStore(store, state => select(state, path))
   const _updateStore: UpdateStore<typeof defaultState> = (updates) => store.setState(state => updateImmutably(state, updates(state)))
   const _updateStoreViaPath: UpdateStoreViaPath<typeof defaultState> = (path, newValue) => store.setState(state => updateImmutably(state, { [path]: newValue } as DotPathUpdateObject<typeof defaultState>))
   return {
      [`root${storeName}Store`]: store,
      [`use${storeName}Store`]: _useStore,
      [`use${storeName}StoreViaPath`]: _useStoreViaPath,
      [`update${storeName}Store`]: _updateStore,
      [`update${storeName}StoreViaPath`]: _updateStoreViaPath
   }
}

type UseStoreFromContextWrapper<TState, TStoreName extends string> = { [K in `use${TStoreName}StoreFromContext`]: () => StoreApi<TState> }

type StoreProviderWrapper<TState, TStoreName extends string> = { [K in `${TStoreName}StoreProvider`]: Provider<StoreApi<TState> | null> }

type AppStoreReturnType<TState, TStoreName extends string> =
   UseStoreFromContextWrapper<TState, TStoreName>
   & StoreProviderWrapper<TState, TStoreName>
   & UseStoreWrapper<TState, TStoreName>
   & UseStoreViaPathWrapper<TState, TStoreName>
   & UpdateStoreWrapper<TState, TStoreName>
   & UpdateStoreViaPathWrapper<TState, TStoreName>

type CreateAppStore = <TStoreName extends string, TState extends object>(storeName: TStoreName, defaultState: TState) => AppStoreReturnType<TState, TStoreName>


//@ts-ignore: cant check computed properties
export const createAppStore: CreateAppStore = (storeName, defaultState) => {
   const _store = createStore(() => defaultState)
   const StoreContext = createContext<typeof _store | null>(null)
   const _useStoreFromContext = () => {
      const store = useContext(StoreContext)
      if (store === null) throw new Error(`You forgot to add the Provider for ${storeName}Store`)
      return store
   }
   const _useStore: UseStore<typeof defaultState> = (selector) => useStore(_useStoreFromContext(), selector)
   const _useStoreViaPath: UseStoreViaPath<typeof defaultState> = (path) => useStore(_useStoreFromContext(), state => select(state, path))
   const _updateStore: UpdateStore<typeof defaultState> = (updates) => _useStoreFromContext().setState(state => updateImmutably(state, updates(state)))
   const _updateStoreViaPath: UpdateStoreViaPath<typeof defaultState> = (path, newValue) => _useStoreFromContext().setState(state => updateImmutably(state, { [path]: newValue } as DotPathUpdateObject<typeof defaultState>))
   return {
      [`use${storeName}StoreFromContext`]: _useStoreFromContext,
      [`${storeName}StoreProvider`]: StoreContext.Provider,
      [`use${storeName}Store`]: _useStore,
      [`use${storeName}StoreViaPath`]: _useStoreViaPath,
      [`update${storeName}Store`]: _updateStore,
      [`update${storeName}StoreViaPath`]: _updateStoreViaPath,
   }
}