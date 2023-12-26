import { useContext } from "react"
import { FieldContext } from "../context"

export const useFieldError = () => {
   const fieldContext = useContext(FieldContext)
   return fieldContext?.control.useErrorsStore(s => s[fieldContext.fieldPath])
}