import { FormContent } from "./useForm"
import { createContext } from "react"

type FieldContextValue = undefined | {
   fieldPath: PropertyKey | string
   fieldData: { fieldId: string, descriptionId: string, messageId: string, name: string }
} & FormContent<Record<PropertyKey, any>>

export const FieldContext = createContext<FieldContextValue>(undefined)