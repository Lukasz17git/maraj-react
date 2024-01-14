// import { ObjectSchema, ValiError } from "@/lib/valibot";
// import { DotPaths } from "maraj";
// import { FormErrorStore, FormSubscription } from "./useForm";
// import { parse } from "@/lib/valibot";

// type Valibot = <T extends Record<PropertyKey, any>>(schema: ObjectSchema<any, any, T>) => FormSubscription<T>

// export const valibotParser: Valibot = (schema) => (state, { errorsStore }) => {
//    const errors = valibotErrorsParser(schema, state)
//    errorsStore.handlers.setState(() => errors, true)
// }

// const valibotErrorsParser = <TState>(schema: ObjectSchema<any, any, TState>, state: TState) => {
//    const errorsObject: FormErrorStore<TState> = {}
//    try {
//       parse(schema, state)
//    } catch (error) {
//       if (error instanceof ValiError) {
//          for (const issue of error.issues) {
//             if (!issue.path) continue
//             const dotPath = issue.path.map((v) => v.key).join('.') as DotPaths<TState>
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