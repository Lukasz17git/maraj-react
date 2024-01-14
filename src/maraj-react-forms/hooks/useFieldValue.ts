import { useContext } from "react"
import { FieldContext } from "../context"

export const useFieldValue = () => {
   const fieldContext = useContext(FieldContext)
   return fieldContext?.valuesStore.useValuesStoreViaPath(fieldContext.fieldPath)
}