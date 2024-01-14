// import { DotPaths } from "maraj";
// import { FormErrorStore, FormSubscription } from "./useForm";
// import { ZodObject, ZodType, ZodError } from "zod";

// type ZodParser = <T extends Record<PropertyKey, any>>(schema: ZodType<T>) => FormSubscription<T>

// export const zodParser: ZodParser = (schema) => (state, { errorsStore }) => {
//    const errors = zodErrorsParser(schema, state)
//    errorsStore.handlers.setState(() => errors, true)
// }

// const zodErrorsParser = <TState>(schema: ZodType<TState>, state: TState) => {
//    const errorsObject: FormErrorStore<TState> = {}
//    try {
//       schema.parse(state)
//       // parse(schema, state)
//    } catch (error) {
//       if (error instanceof ZodError) {
//          for (const issue of error.issues) {
//             if (!issue.path) continue
//             const dotPath = issue.path.map((v) => v).join('.') as DotPaths<TState>
//             /* Continue if there is already an error set in the same field. */
//             if (typeof errorsObject[dotPath] === 'string') continue
//             errorsObject[dotPath] = issue.message
//          }
//       } else {
//          throw new Error(`an error occured parsing the Valibot Schema which is not related to a Valibot Error: ${JSON.stringify(error)}`)
//       }
//    }
//    return errorsObject
// }