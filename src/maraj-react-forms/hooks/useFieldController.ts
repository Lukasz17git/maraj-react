import { ChangeEventHandler, FocusEventHandler, useContext } from "react"
import { FieldContext } from "../context"
import { defaultModifier } from "./modifiers"
import { FieldError } from "../useForm"

type OnChangeHandler = ChangeEventHandler<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement> | undefined
type OnBlurHandler = FocusEventHandler<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement> | undefined

type ReturnTypeWithoutContext = {
   controllerProps: {
      onChange: OnChangeHandler,
      onBlur: OnBlurHandler,
      value?: undefined,
      id?: undefined,
      name?: undefined,
      "aria-invalid"?: undefined,
      "aria-describedby"?: undefined,
   },
   descriptionId?: undefined,
   messageId?: undefined,
   error?: undefined,
}

type ReturnTypeWithContext = {
   controllerProps: {
      onChange: OnChangeHandler,
      onBlur: OnBlurHandler,
      value: string,
      id: string,
      name: string,
      "aria-invalid"?: boolean,
      "aria-describedby"?: string,
   }, //checked?: boolean
   descriptionId: string,
   messageId: string,
   error: string | undefined,
}

type UseFieldController = (onChange: OnChangeHandler, onBlur: OnBlurHandler) => ReturnTypeWithoutContext | ReturnTypeWithContext

export const useFieldController: UseFieldController = (onChange, onBlur) => {

   const fieldContext = useContext(FieldContext)
   if (!fieldContext) return { controllerProps: { onChange, onBlur } }

   const { fieldPath, control, fieldData: { name, fieldId, descriptionId, messageId } } = fieldContext
   const _value = control.useValuesStoreViaPath(fieldPath)
   const error = control.useErrorsStore(s => s[fieldPath])

   const { getModifier, setModifier } = defaultModifier[typeof _value]

   const _onChange: OnChangeHandler = (e) => {
      if (onChange) onChange(e)
      control.updateValuesStoreViaPath(fieldPath, setModifier(e.target.value))
   }

   const _onBlur: OnBlurHandler = (e) => {
      if (onBlur) onBlur(e)
   }

   const value: string | any = getModifier(_value)
   const ariaInvalid = !!error
   const ariaDescribedBy = error ? `${descriptionId} ${messageId}` : descriptionId

   return {
      controllerProps: {
         onChange: _onChange,
         onBlur: _onBlur,
         value,
         id: fieldId,
         name,
         "aria-invalid": ariaInvalid,
         "aria-describedby": ariaDescribedBy
      },
      error,
      descriptionId,
      messageId,
   }
}