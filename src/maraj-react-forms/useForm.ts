import { ObjectSchema, ValiError, parse } from "@/lib/valibot"
import { FormEvent, useEffect, useRef } from "react"
import { DotPaths } from "maraj"
import { valibotErrorsParser } from "./validationParser";
import { createComponentStore } from "../maraj-react-zustand/_index";

export type FieldError = string
export type ErrorStore<T> = { [K in DotPaths<T> & string]?: FieldError }
export type Control<T extends object> = ReturnType<typeof useForm<T>>['control']

export const useForm = <TData extends object>(props: { schema: ObjectSchema<any, any, TData>, defaultValues: TData }) => {

   const { schema, defaultValues } = props
   const errorStore: ErrorStore<TData> = {}

   const { current: valuesStore } = useRef(createComponentStore('Values', defaultValues))
   const { current: errorsStore } = useRef(createComponentStore('Errors', errorStore))
   const { current: { resetForm, handleSubmit, ...control } } = useRef({
      useValuesStore: valuesStore.useValuesStore,
      useValuesStoreViaPath: valuesStore.useValuesStoreViaPath,
      updateValuesStore: valuesStore.updateValuesStore,
      updateValuesStoreViaPath: valuesStore.updateValuesStoreViaPath,
      useErrorsStore: errorsStore.useErrorsStore,
      resetForm: () => valuesStore.updateValuesStore(() => defaultValues),
      handleSubmit: (handler: (values: TData, changedValues: TODO ) => void) => (e: FormEvent<HTMLFormElement>) => {
         e.preventDefault()
         const state = valuesStore.rootValuesStore.getState()
         const changes = TODO
         handler(state, changes)
      }
   })

   useEffect(() => {
      valuesStore.rootValuesStore.subscribe((state) => {
         try {
            parse(schema, state)
         } catch (error) {
            if (error instanceof ValiError) {
               const newErrorState = valibotErrorsParser<TData>(error)
               errorsStore.rootErrorsStore.setState(newErrorState)
            }
         }
      })
   }, [])

   return {
      handleSubmit,
      resetForm,
      control,
   }
}