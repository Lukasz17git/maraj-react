import { ValidTypesAsInputValue } from "./useFieldController"

type Modifier = {
   getModifier: (v: any) => ValidTypesAsInputValue
   setModifier: (v: string) => any
}

const modifiers = {
   string: {
      getModifier: (v: string) => v,
      setModifier: (v: string) => v
   },
   number: {
      getModifier: (v: number) => v,
      setModifier: (v: string) => parseFloat(v)
   },
   boolean: {
      getModifier: (v: boolean) => `${v}`,
      setModifier: () => (valueInStore: boolean) => !valueInStore
   },
   undefined: {
      getModifier: () => '',
      setModifier: (v: string) => v
   },
   null: {
      getModifier: () => '',
      setModifier: (v: string) => v
   },
} satisfies Record<'string' | 'number' | 'boolean' | 'undefined' | 'null', Modifier>


export const getDefaultModifiers = (value: unknown): Modifier => {
   if (value === undefined) return modifiers.undefined
   else if (value === null ) return modifiers.null
   else if (typeof value === 'string') return modifiers.string
   else if (typeof value === 'number') return modifiers.number
   else if (typeof value === 'boolean') return modifiers.boolean
   else throw new Error(`Value inside field is not a primitive: ${JSON.stringify(value)}`)
}