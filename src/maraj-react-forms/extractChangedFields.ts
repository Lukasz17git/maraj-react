import { isObjectLiteral } from "maraj";
import equal from 'react-fast-compare'

export type DeepPartial<T> = {
   [K in keyof T]?: T[K] extends object ? DeepPartial<T[K]> : T[K];
};

const extractChangedFields = <T extends Record<string, any>, K extends Record<string, any>>(original: T, updates: K): DeepPartial<K> => {

   let changes: DeepPartial<K> = {}

   for (const [keyInUpdate, valueInUpdate] of Object.entries(updates)) {

      if (!original.hasOwnProperty(keyInUpdate)) {
         changes[keyInUpdate as keyof K] = valueInUpdate
         continue
      }
      const originalValue = original[keyInUpdate]

      if (equal(originalValue, valueInUpdate)) continue

      /* from here values must be different */
      if (isObjectLiteral(valueInUpdate) && isObjectLiteral(originalValue)) {
         const changesInProp = extractChangedFields(originalValue, valueInUpdate)
         // @ts-ignore: should be good since changes[keyInUpdate] must be an object and changesInProp must be non-empty object because of equal() of the line above.
         changes[keyInUpdate] = changesInProp
      } else {
         /* Everything non-literal-object: Arrays, native objects, primites, and so on. */
         changes[keyInUpdate as keyof K] = valueInUpdate
      }
   }
   return changes
}

// const originalExample = {
//    a: '1',
//    b: {
//       b1: {
//          b11: 'xd'
//       }
//    },
//    c: [{ c1: 'name' }],
//    d: new Set([1, 2, 3]),
//    e: new Map([[1, "one"], [2, "two"], [4, "four"],])
// }

// const updatesExample = {
//    a: '2',
//    e: new Map([[1, 'one']])
// }

// const res = extractChangedFields(originalExample, updatesExample)
// console.log('res', res)