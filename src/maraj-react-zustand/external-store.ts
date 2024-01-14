import { StoreApi, createStore, useStore } from "zustand"
import { Handlers, StoreProvider, UpdateHandlers, UseStore, UseStoreViaPath } from "./(store.types)"
import { createContext, createElement, useContext } from "react"
import { UpdateObject, select, update } from "maraj"

type DefaultExternalStore<TState> = {
   StoreProvider: StoreProvider<TState>,
   useStore: UseStore<TState>,
   useStoreViaPath: UseStoreViaPath<TState>,
   useStoreHandlers: () => Handlers<TState> & UpdateHandlers<TState>,
}

type ExternalStore<TState, TStoreName extends string> = {
   [K in `use${TStoreName}Store`]: DefaultExternalStore<TState>['useStore']
} & { [K in `use${TStoreName}StoreViaPath`]: DefaultExternalStore<TState>['useStoreViaPath'] }
   & { [K in `use${TStoreName}StoreHandlers`]: DefaultExternalStore<TState>['useStoreHandlers'] }
   & { [K in `${TStoreName}StoreProvider`]: DefaultExternalStore<TState>['StoreProvider'] }

export const createExternalStore = <TStoreName extends string, TState extends Record<PropertyKey, any>>(storeName: TStoreName, defaultState: TState) => {

   const store = createStore(() => (defaultState))
   const StoreContext = createContext<StoreApi<TState> | undefined>(undefined)

   const useStoreFromContext = () => {
      const storeInContext = useContext(StoreContext)
      if (storeInContext === undefined) throw new Error(`You forgot to add the Provider for ${storeName}Store`)
      return storeInContext
   }

   const externalStore: DefaultExternalStore<TState> = {
      StoreProvider: ({ children }) => createElement(StoreContext.Provider, { value: store }, children),
      useStore: (selector) => useStore(useStoreFromContext(), selector),
      useStoreViaPath: (path) => useStore(useStoreFromContext(), state => select(state, path)),
      useStoreHandlers: () => {
         const storeInContext = useStoreFromContext()
         return {
            getState: storeInContext.getState,
            setState: storeInContext.setState,
            subscribe: storeInContext.subscribe,
            updateState: (updates) => storeInContext.setState(state => update(state, updates(state)), true),
            updateStateViaPath: (path, newValue) => storeInContext.setState(state => {
               const updateObject: UpdateObject<TState> = {}
               updateObject[path] = newValue
               return update(state, updateObject)
            }, true)
         }
      },
   }

   return {
      [`${storeName}StoreProvider`]: externalStore.StoreProvider,
      [`use${storeName}Store`]: externalStore.useStore,
      [`use${storeName}StoreViaPath`]: externalStore.useStoreViaPath,
      [`use${storeName}StoreHandlers`]: externalStore.useStoreHandlers,
   } as ExternalStore<TState, TStoreName>
}