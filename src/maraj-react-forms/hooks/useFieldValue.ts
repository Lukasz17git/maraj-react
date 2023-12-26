import { useContext } from "react"
import { FieldContext } from "../context"

export const useFieldValue = () => {
   const fieldContext = useContext(FieldContext)
   return fieldContext?.control.useValuesStoreViaPath(fieldContext.fieldPath)
}