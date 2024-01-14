'use client'

import { ReactNode, useId } from "react"
import { FieldContext } from "./context"
import { DotPaths, ObjectLiteral, PrimitivesAndNativeObjects, ValueInPath, splitPathAtLastKey } from "maraj"
import { FormContent } from "./useForm"

type FieldProvider<TAllowedTypes = PrimitivesAndNativeObjects> = <T extends ObjectLiteral, TPath extends DotPaths<T, TAllowedTypes>>(props: FieldProviderProps<T, TPath>) => ReactNode

//TODO: add different modes
// type FieldModes = 'smart'

export type FieldProviderProps<T extends ObjectLiteral, TPath> = {
   formContent: FormContent<T>
   field: TPath
   // mode?: FieldModes
   middleware?: {
      gettingFromStore?: (valueFromStore: ValueInPath<T, TPath>) => unknown,
      settingToStore?: (valueFromInput: string) => ValueInPath<T, TPath>,
   }
   children?: ReactNode
}

//TODO: Be able to provide a set of allowed keys?, not just value type
type CreateCustomFieldProvider = <TAllowedTypes = PrimitivesAndNativeObjects>() => FieldProvider<TAllowedTypes>
/** To be able to restrict the paths hinted in the field provider by the provided types. */
export const createCustomFieldProvider: CreateCustomFieldProvider = () => FieldProvider


export const FieldProvider: FieldProvider = ({ children, field, formContent }) => {

   const id = useId()
   const fieldId = `${id}-field`

   return (
      <FieldContext.Provider value={{
         fieldPath: field,
         fieldData: {
            fieldId,
            descriptionId: `${fieldId}-description`,
            messageId: `${fieldId}-message`,
            name: splitPathAtLastKey(typeof field === 'string' ? field : id)[1]
         },
         ...formContent,
      }}>
         {children}
      </FieldContext.Provider>
   )
}
