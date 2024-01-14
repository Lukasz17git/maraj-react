import { createStore, useStore } from "zustand"
import { Handlers, UpdateHandlers, UseStore, UseStoreViaPath } from "./(store.types)"
import { UpdateObject, select, update } from "maraj"

// Normal Store
type DefaultComponentStore<TState> = {
   useStore: UseStore<TState>,
   useStoreViaPath: UseStoreViaPath<TState>,
   storeHandlers: Handlers<TState> & UpdateHandlers<TState>
}

// Normal Store Named
type ComponentStore<TState, TStoreName extends string> = {
   [K in `use${TStoreName}Store`]: DefaultComponentStore<TState>['useStore'];
} & { [K in `use${TStoreName}StoreViaPath`]: DefaultComponentStore<TState>['useStoreViaPath'] }
   & { handlers: DefaultComponentStore<TState>['storeHandlers'] }


export const useCreateComponentStore = <TStoreName extends string, TState>(storeName: TStoreName, defaultState: TState) => {
   const store = createStore(() => (defaultState))
   const componentStore: DefaultComponentStore<TState> = {
      useStore: (selector) => useStore(store, selector),
      useStoreViaPath: (path) => useStore(store, state => select(state, path)),
      storeHandlers: {
         getState: store.getState,
         setState: store.setState,
         subscribe: store.subscribe,
         updateState: (updates) => store.setState(state => update(state, updates(state)), true),
         updateStateViaPath: (path, newValue) => store.setState(state => {
            const updateObject: UpdateObject<TState> = {}
            updateObject[path] = newValue
            return update(state, updateObject)
         }, true)
      },
   }
   return {
      [`use${storeName}Store`]: componentStore.useStore,
      [`use${storeName}StoreViaPath`]: componentStore.useStoreViaPath,
      handlers: componentStore.storeHandlers
   } as ComponentStore<TState, TStoreName>
}