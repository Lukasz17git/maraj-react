import { createStore, useStore } from "zustand"
import { Handlers, RecordStoreUpdateHandlers, UseRecordStoreViaPath, UseStore } from "./(store.types)"
import { KeyOf, ValueInPath, select, update } from "maraj"


type DefaultDotPathRecordComponentStore<TState> = {
   useStore: UseStore<TState>,
   useStoreViaPath: UseRecordStoreViaPath<TState>,
   storeHandlers: Handlers<TState> & RecordStoreUpdateHandlers<TState>
}

type DotPathRecordComponentStore<TState, TStoreName extends string> = {
   [K in `use${TStoreName}Store`]: DefaultDotPathRecordComponentStore<TState>['useStore'];
} & { [K in `use${TStoreName}StoreViaPath`]: DefaultDotPathRecordComponentStore<TState>['useStoreViaPath'] }
   & { handlers: DefaultDotPathRecordComponentStore<TState>['storeHandlers'] }

export const useCreateDotPathRecordComponentStore = <TState extends Record<PropertyKey, any>, TStoreName extends string>(storeName: TStoreName, defaultState: TState) => {
   const store = createStore(() => (defaultState))
   const componentStore: DefaultDotPathRecordComponentStore<TState> = {
      useStore: (selector) => useStore(store, selector),
      useStoreViaPath: (path) => useStore(store, state => select(state, path)),
      // useStoreViaPath: (path) => useStore(store, state => state[path]),
      storeHandlers: {
         getState: store.getState,
         setState: store.setState,
         subscribe: store.subscribe,
         // need to add this so all keys exist beforehand
         updateState: (updates) => store.setState(state => {
            const updateObject = updates(state)
            const addUpdateObjectKeys: Partial<Record<KeyOf<TState>, undefined>> = {}
            Object.keys(updateObject).forEach(key => addUpdateObjectKeys[key as KeyOf<TState>] = undefined)
            const stateWithExistentKeys = { ...addUpdateObjectKeys, ...state }
            return update(stateWithExistentKeys, updateObject)
         }, true),
         updateStateViaPath: (path, newValue) => store.setState(state => {
            const newValueInPath: ValueInPath<typeof state, typeof path> = typeof newValue === 'function' ? newValue(state[path]) : newValue
            const updates = { [path]: newValueInPath } as Partial<typeof state>
            return updates
         })
      },
   }
   return {
      [`use${storeName}Store`]: componentStore.useStore,
      [`use${storeName}StoreViaPath`]: componentStore.useStoreViaPath,
      handlers: componentStore.storeHandlers
   } as DotPathRecordComponentStore<TState, TStoreName>
}
