import { DotPaths } from "maraj"
import { Control } from "./useForm"
import { createContext } from "react"

type FieldContextValue = undefined | {
   fieldPath: DotPaths<any>
   fieldData: { fieldId: string, descriptionId: string, messageId: string, name: string }
   control: Control<any>
}

export const FieldContext = createContext<FieldContextValue>(undefined)