import { FormEvent, useMemo } from "react"
import { useCreateComponentStore, useCreateDotPathRecordComponentStore } from "../index"
import { DotPaths, ObjectLiteral } from "maraj"
import { DeepPartial, extractChangedFields } from "./extractChangedFields";

/* Subscribe Functions to listen on values changes */
export type FormSubscription<T extends ObjectLiteral> = (valuesState: T, formContent: FormContent<T>) => void

/* Status Store */
export type FieldStatus = { isDirty?: boolean, changedValue?: boolean }
type FormStatusStore<T> = { [K in DotPaths<T>]?: FieldStatus }

/* Errors Store */
export type FormErrorStore<T> = { [K in DotPaths<T>]?: string }

/* Form Content */
export type FormContent<T extends ObjectLiteral> = ReturnType<typeof useForm<T>>['formContent']

/* Form Props */
type Props<T extends ObjectLiteral> = { subscribe?: FormSubscription<T> | FormSubscription<T>[], defaultValues: T }
export const useForm = <TState extends ObjectLiteral>({ subscribe, defaultValues }: Props<TState>) => {

   const content = useMemo((() => {
      const valuesStore = useCreateComponentStore('Values', defaultValues)
      const errorsStore = useCreateDotPathRecordComponentStore('Errors', {} as FormErrorStore<TState>)
      const statusStore = useCreateDotPathRecordComponentStore('Status', {} as FormStatusStore<TState>)
      const formContent = { valuesStore, errorsStore, statusStore }
      const resetForm = () => valuesStore.handlers.setState(() => defaultValues)

      const submitHandler = (handler: (values: TState, changedValues: DeepPartial<TState>, formEvent: FormEvent<HTMLFormElement>) => void) => (e: FormEvent<HTMLFormElement>) => {
         e.preventDefault()
         const state = valuesStore.handlers.getState()
         const changes = extractChangedFields(defaultValues, state)
         handler(state, changes, e)
      }
      const useIsFormValid = () => errorsStore.useErrorsStore(state => !Object.keys(state).length)

      if (subscribe) {
         const subscriptions = Array.isArray(subscribe) ? subscribe : [subscribe]
         subscriptions.forEach(subscription => valuesStore.handlers.subscribe(s => subscription(s, formContent)))
      }

      return {
         formContent,
         resetForm,
         submitHandler,
         useIsFormValid,
      }
   }), [])

   return content
}