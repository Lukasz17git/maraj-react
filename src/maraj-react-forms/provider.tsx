import { ReactNode, useId } from "react"
import { FieldContext } from "./context"
import { DotPathUpdateValue, DotPaths, PrimitivesAndNativeObjects, ValueInDotPath, splitPathAtLastKey } from "maraj"
import { Control } from "./useForm"

type FieldProvider<TAllowedTypes = PrimitivesAndNativeObjects> = <T extends object, TPath extends DotPaths<T, TAllowedTypes>>(props: {
   control: Control<T>
   field: TPath
   children?: ReactNode
   middleware?: {
      getFromStore?: (valueInStore: ValueInDotPath<T, TPath>) => unknown,
      setToStore?: (valueFromInput: string) => DotPathUpdateValue<T, TPath>,
   }
}) => ReactNode

export const FieldProvider: FieldProvider = ({ children, field, control }) => {

   const id = useId()
   const fieldId = `${id}-field`

   return (
      <FieldContext.Provider value={{
         fieldPath: field,
         control,
         fieldData: {
            fieldId,
            descriptionId: `${fieldId}-description`,
            messageId: `${fieldId}-message`,
            name: splitPathAtLastKey(field)[1]
         }
      }}>
         {children}
      </FieldContext.Provider>
   )
}

type NewFieldProvider = <TAllowedTypes = PrimitivesAndNativeObjects>() => FieldProvider<TAllowedTypes>
export const newFieldProvider: NewFieldProvider = () => FieldProvider