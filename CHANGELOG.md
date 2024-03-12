# 0.2.15 (2023-10-04)

## Bug Fixes

- Fix checksum change in second open website and reset all thunders to default value

# 0.2.2 (2023-09-25)

## Bug Fixes

- Fix checksum for detect change property `expire` and `default` and `encrypt` in thunder config and reset thunder to default value.

# 0.2.1 (2023-09-23)

## Bug Fixes

- Fix TypeScript typing for `selectors` and `reducers`.

# 0.4.11 (2024-03-06)

## Breaking changes

- This version is entirely standalone, distinct from previous versions, and has been redeveloped from the ground up with a new foundation and structure.
- Replace the `thunder` function with the `slice` function.
- All keys in the slice configuration are optional, except for `key` and `defaultClient`.
- Rename the `default` key in the slice configuration to `defaultClient`.
- Rename the `encrypt` key in the slice configuration to `obfuscate`; instead of encrypting, this new method only obfuscates data.
- Modify the `expire` key property in the slice configuration from a numerical value in seconds to a `0d-04h-05m-06s` format.
- Replace the `thunder` function in the `useKillua` hook return with the `get` function.
- Replace the `setThunder` function in the `useKillua` hook return with the `set` function.
- Replace the `isReadyInSSR` function in the `useKillua` hook return with the `isReady` function.
- Wrapping the app with `SSRKilluaProvider` in SSR applications is no longer required.

## Features

- Introduce a `schema` key in the slice configuration for data schema validation using `yup` and `zod`.
- Introduce a `defaultServer` key in the slice configuration to set a default server value.
- Enable access to all values returned by the `useKillua` hook outside of components through the value returned by the `slice` function.

## Bug Fixes

- Fix expire timer for expire localstorage data with `expire` key.