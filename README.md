# Maraj React

Typed forms and [Zustand](https://github.com/pmndrs/zustand) stores for React 18, updated with [maraj](https://www.npmjs.com/package/maraj) dot paths (`'address.city'`). Each field re-renders only when its own value, error or status changes.

```bash
npm install maraj-react
```

Comes with `maraj`, `zustand` and `react-fast-compare` (to find the changed fields on submit).

## Forms

```tsx
import { FieldProvider, useForm, useFieldController } from 'maraj-react'

type TProfile = { name: string; age: number; address: { city: string } }

const ProfileForm = ({ profile }: { profile: TProfile }) => {
   const { formContent, submitHandler, useIsFormValid } = useForm({
      defaultValues: profile,
      subscribe: (values, { errorsStore }) =>
         errorsStore.handlers.setState(values.name ? {} : { name: 'Required' }, true),
   })
   const isValid = useIsFormValid()

   return (
      <form onSubmit={submitHandler((values, changedValues) => saveProfile(changedValues))}>
         <FieldProvider formContent={formContent} field='name'>
            <TextField />
         </FieldProvider>
         <FieldProvider formContent={formContent} field='address.city'>
            <TextField />
         </FieldProvider>
         <button disabled={!isValid}>Save</button>
      </form>
   )
}

const TextField = () => {
   const { controllerProps, error, messageId } = useFieldController(undefined, undefined)
   return (
      <>
         <input {...controllerProps} />
         {error && <p id={messageId}>{error}</p>}
      </>
   )
}
```

`useForm({ defaultValues, subscribe })` keeps the values, errors and status of each field in 3 stores, created once per form.

| Returns             | Does                                                                                       |
| ------------------- | ------------------------------------------------------------------------------------------ |
| `formContent`       | The 3 stores (`valuesStore`, `errorsStore`, `statusStore`), passed to each `FieldProvider` |
| `submitHandler(fn)` | `onSubmit` handler: prevents the page reload and calls `fn(values, changedValues, event)`  |
| `resetForm()`       | Sets the values back to `defaultValues`                                                    |
| `useIsFormValid()`  | `true` while the errors store has no keys                                                  |

`subscribe` runs on every values change with `(values, formContent)`, one function or an array of them; it's the place to validate. Set the errors with `setState(errors, true)`, so a fixed field's key is removed: a key set to `undefined` still makes `useIsFormValid()` return `false`.

`changedValues` has only what differs from `defaultValues` (see [extractChangedFields](#extractchangedfields)).

### Field hooks

Inside a `FieldProvider`, these hooks read and update the field at its `field` path:

| Hook                                   | Returns                                                                                                                                                |
| -------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `useFieldController(onChange, onBlur)` | `controllerProps` for `<input>`, `<select>` or `<textarea>` (`value`, `id`, `name`, `aria-*`), plus `error`, `status`, `descriptionId` and `messageId` |
| `useFieldClickController(onClick)`     | Same for a `<button>` that toggles a boolean, with `checked`, `aria-checked` and `aria-pressed`                                                        |
| `useFieldValue()`                      | The field's value                                                                                                                                      |
| `useFieldError()`                      | The field's error message, or `undefined`                                                                                                              |
| `useFieldStatus(key?)`                 | The field's `{ isDirty, changedValue }`, or one of them                                                                                                |
| `useFieldData()`                       | `{ fieldId, descriptionId, messageId, name }`; `name` is the last key of the path (`'address.city'` -> `'city'`)                                       |

Your `onChange`, `onBlur` and `onClick` run first; pass `undefined` when you have none. Outside a `FieldProvider` the controllers return only those handlers.

The input shows `null` and `undefined` as `''`, and number fields store `parseFloat(input)`. A field whose value is an object or array throws, since an input can't edit it.

`createCustomFieldProvider<TAllowedTypes>()` returns a `FieldProvider` that suggests only the paths whose value is one of `TAllowedTypes` (`createCustomFieldProvider<string>()` for text inputs).

### extractChangedFields

```ts
import { extractChangedFields } from 'maraj-react'

extractChangedFields(
   { name: 'Ana', address: { city: 'Lima', zip: '15001' }, tags: ['a'] },
   { name: 'Ana', address: { city: 'Cusco', zip: '15001' }, tags: ['a', 'b'] },
) // { address: { city: 'Cusco' }, tags: ['a', 'b'] }
```

Nested objects keep only their changed keys; arrays and other values are compared deeply and returned whole.

## Stores

Three ways to create a Zustand store whose name is in its hooks (`'Cart'` -> `useCartStore`):

```ts
import { strict } from 'maraj'
import { createExternalStore, useCreateComponentStore } from 'maraj-react'

const cart = useCreateComponentStore('Cart', { items: [{ id: 1, qty: 1 }], coupon: null as string | null })

cart.useCartStore((state) => state.items.length) // selector, re-renders when the result changes
cart.useCartStoreViaPath('items.0.qty') // 1
cart.handlers.updateStateViaPath('items.0.qty', (qty) => qty + 1)
cart.handlers.updateState((state) => strict({ coupon: state.coupon ?? 'SUMMER' }))
// state = { items: [{ id: 1, qty: 2 }], coupon: 'SUMMER' }

export const { SessionStoreProvider, useSessionStore, useSessionStoreViaPath, useSessionStoreHandlers } =
   createExternalStore('Session', { user: null as string | null })
```

| Function                                            | Returns                                                                                                                             |
| --------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------- |
| `useCreateComponentStore(name, state)`              | `use<Name>Store`, `use<Name>StoreViaPath` and `handlers`; a new store on each call, so create it once (`useMemo`)                   |
| `useCreateDotPathRecordComponentStore(name, state)` | Same, for a flat record whose keys are paths (`{ 'address.city': 'Required' }`), like the form's errors                             |
| `createExternalStore(name, state)`                  | `<Name>StoreProvider`, `use<Name>Store`, `use<Name>StoreViaPath` and `use<Name>StoreHandlers`; the hooks throw outside the provider |

`handlers` has Zustand's `getState`, `setState` and `subscribe`, plus `updateState(state => strict(updates))` and `updateStateViaPath(path, value)`, which update with [maraj](https://www.npmjs.com/package/maraj) (a value, or a function that gets the current one). `updateState` takes the update object wrapped in maraj's `strict()`.

`createExternalStore` creates its store once, when it's called, so every `<Name>StoreProvider` shares the same state.

## Development

| Script          | Does                                  |
| --------------- | ------------------------------------- |
| `npm run dev`   | Runs the tests in watch mode          |
| `npm test`      | Runs the tests once                   |
| `npm run lint`  | Type-checks with `tsc`                |
| `npm run build` | Builds ESM + CJS and types to `dist`  |
| `npx changeset` | Adds a changeset for the next release |

### Releasing

1. Run `npx changeset`, pick the bump type and describe the change, and commit the generated file.
2. When pushed to `main`, CI opens a "Version Packages" PR and runs the checks on it.
3. Merging that PR publishes to npm with [trusted publishing](https://docs.npmjs.com/trusted-publishers) (no npm token needed).
