import { DotPaths } from "maraj";
import { ErrorStore } from "./useForm";
import { ValiError } from "./valibot.types";


export const valibotErrorsParser = <T>(error: ValiError) => {

   const errorDotPathUpdateObject: ErrorStore<T> = {}

   for (const issue of error.issues) {
      if (!issue.path) continue
      const dotPath = issue.path.map((v) => v.key).join('.') as DotPaths<T>
      if (typeof errorDotPathUpdateObject[dotPath] === 'string') continue
      errorDotPathUpdateObject[dotPath] = error.message
   }

   return errorDotPathUpdateObject
}