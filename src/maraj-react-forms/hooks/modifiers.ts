

type Modifier = {
   setModifier: (v: string) => any
   getModifier: (v: any) => string | number | boolean | undefined | null
}

const anyModifier = {
   setModifier: (v: string) => v,
   getModifier: (v: any) => v
}

type DefaultModifier = Record<"string" | "number" | "bigint" | "boolean" | "symbol" | "undefined" | "object" | "function", Modifier>

export const defaultModifier: DefaultModifier = {
   string: {
      setModifier: (v: string) => v,
      getModifier: (v: string) => v
   },
   boolean: {
      setModifier: () => (v: boolean) => !v,
      getModifier: (v: boolean) => v
   },
   number: {
      setModifier: (v: string) => parseInt(v),
      getModifier: (v: number) => v.toString()
   },
   bigint: anyModifier,
   function: anyModifier,
   object: anyModifier,
   symbol: anyModifier,
   undefined: anyModifier,
}
