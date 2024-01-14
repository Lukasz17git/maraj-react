import { useContext } from "react"
import { FieldContext } from "../context"
import { DotPaths } from "maraj"
import { FieldStatus } from "../useForm"

export const useFieldStatus = <TStatusInnerKey extends DotPaths<FieldStatus>>(statusKey?: TStatusInnerKey) => {
   const fieldContext = useContext(FieldContext)
   return fieldContext?.statusStore.useStatusStoreViaPath(statusKey ? `${String(fieldContext.fieldPath)}.${statusKey}` : fieldContext.fieldPath)
}