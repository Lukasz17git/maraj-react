import { useContext } from "react"
import { FieldContext } from "../context"

export const useFieldError = () => {
   const fieldContext = useContext(FieldContext)
   return fieldContext?.errorsStore.useErrorsStore(store => store[fieldContext.fieldPath])
}