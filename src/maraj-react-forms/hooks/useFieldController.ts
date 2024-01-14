import { ChangeEventHandler, FocusEventHandler, MouseEventHandler, useContext } from "react"
import { FieldContext } from "../context"
import { getDefaultModifiers } from "./modifiers"
import { FieldStatus } from "../useForm"
import { strict } from "maraj"

export type ValidTypesAsInputValue = string | number | undefined | readonly string[]

type ReturnTypeWithoutContext = {
   controllerProps: {
      value?: undefined,
      id?: undefined,
      name?: undefined,
      "aria-invalid"?: undefined,
      "aria-describedby"?: undefined,
   },
   descriptionId?: undefined,
   messageId?: undefined,
   error?: undefined,
   status?: undefined
}

type ReturnTypeWithContext = {
   controllerProps: {
      value: ValidTypesAsInputValue,
      id: string,
      name: string,
      "aria-invalid": boolean,
      "aria-describedby": string,
   },
   descriptionId: string,
   messageId: string,
   error: string | undefined,
   status: FieldStatus | undefined
}

type OnChangeHandler = ChangeEventHandler<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement> | undefined
type OnBlurHandler = FocusEventHandler<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement> | undefined

type ReturnControllerTypeWithoutContext = ReturnTypeWithoutContext & { controllerProps: { onChange: OnChangeHandler, onBlur: OnBlurHandler } }
type ReturnControllerTypeWithContext = ReturnTypeWithContext & { controllerProps: { onChange: OnChangeHandler, onBlur: OnBlurHandler } }

type UseFieldController = (onChange: OnChangeHandler, onBlur: OnBlurHandler) => ReturnControllerTypeWithoutContext | ReturnControllerTypeWithContext

export const useFieldController: UseFieldController = (onChange, onBlur) => {

   const fieldContext = useContext(FieldContext)
   if (!fieldContext) return { controllerProps: { onChange, onBlur } }

   const { fieldPath, valuesStore, errorsStore, statusStore, fieldData: { name, fieldId, descriptionId, messageId } } = fieldContext
   const _value = valuesStore.useValuesStoreViaPath(fieldPath)
   const error = errorsStore.useErrorsStoreViaPath(fieldPath)
   const status = statusStore.useStatusStoreViaPath(fieldPath)
   const { getModifier, setModifier } = getDefaultModifiers(_value)

   const _onChange: OnChangeHandler = (e) => {
      if (onChange) onChange(e)
      valuesStore.handlers.updateStateViaPath(fieldPath, setModifier(e.target.value))
      if (status?.isDirty || status?.isDirty === undefined) {
         statusStore.handlers.updateStateViaPath(fieldPath, v => strict({ ...v, isDirty: false }))
      }
   }

   const _onBlur: OnBlurHandler = (e) => {
      if (onBlur) onBlur(e)
      if (status?.isDirty) {
         valuesStore.handlers.updateStateViaPath(fieldPath, setModifier(e.target.value))
      } else if (status?.isDirty === false) {
         statusStore.handlers.updateStateViaPath(fieldPath, v => strict({ ...v, isDirty: true }))
      }
   }

   return {
      controllerProps: {
         onChange: _onChange,
         onBlur: _onBlur,
         value: getModifier(_value) ?? '',
         id: fieldId,
         name,
         "aria-invalid": !!error,
         "aria-describedby": error ? `${descriptionId} ${messageId}` : descriptionId
      },
      status,
      error,
      descriptionId,
      messageId,
   }
}

type OnClickHandler = MouseEventHandler<HTMLButtonElement> | undefined
type StringBoolean = 'true' | 'false'

type ReturnClickControllerTypeWithoutContext = ReturnTypeWithoutContext & { controllerProps: { onClick: OnClickHandler, checked?: undefined, 'aria-checked'?: undefined, 'aria-pressed'?: undefined } }
type ReturnClickControllerTypeWithContext = ReturnTypeWithContext & { controllerProps: { onClick: OnClickHandler, checked: StringBoolean, 'aria-checked': StringBoolean, 'aria-pressed': StringBoolean } }

type UseFieldClickController = (onClick: OnClickHandler) => ReturnClickControllerTypeWithoutContext | ReturnClickControllerTypeWithContext

export const useFieldClickController: UseFieldClickController = (onClick) => {

   const fieldContext = useContext(FieldContext)
   if (!fieldContext) return { controllerProps: { onClick } }

   const { fieldPath, valuesStore, errorsStore, statusStore, fieldData: { name, fieldId, descriptionId, messageId } } = fieldContext
   const _value = valuesStore.useValuesStoreViaPath(fieldPath)
   const error = errorsStore.useErrorsStoreViaPath(fieldPath)
   const status = statusStore.useStatusStoreViaPath(fieldPath)
   const { getModifier, setModifier } = getDefaultModifiers(_value)

   const _onClick: OnClickHandler = (e) => {
      if (onClick) onClick(e)
      console.log('on change fired')
      valuesStore.handlers.updateStateViaPath(fieldPath, setModifier(''))
      if (!status?.isDirty) {
         statusStore.handlers.updateStateViaPath(fieldPath, v => strict({ ...v, isDirty: true }))
      }
   }

   return {
      controllerProps: {
         onClick: _onClick,
         value: getModifier(_value) ?? '',
         id: fieldId,
         name,
         "aria-invalid": !!error,
         "aria-describedby": error ? `${descriptionId} ${messageId}` : descriptionId,
         checked: (!!_value).toString() as StringBoolean,
         "aria-checked": (!!_value).toString() as StringBoolean,
         "aria-pressed": (!!_value).toString() as StringBoolean
      },
      status,
      error,
      descriptionId,
      messageId,
   }
}