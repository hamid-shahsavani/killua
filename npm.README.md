<img src="https://raw.githubusercontent.com/sys113/killua/master/logo-type.png">

# killua &middot; ![](https://img.shields.io/npm/v/killua.svg) ![](https://img.shields.io/npm/dw/killua) ![](https://img.shields.io/github/stars/sys113/killua.svg) ![](https://img.shields.io/github/issues/sys113/killua.svg) ![](https://img.shields.io/badge/language-typescript-blue.svg) ![](https://img.shields.io/badge/license-MIT-informational.svg)

 killua is a local-storage management library for React applications.
 
## Table of Contents

- [Installation](#installation)
- [Features](#features)
- [Examples](#examples)
- [Usage](#usage)
  - [Create slice configuration file](#create-slice-configuration-file)
  - [Get data](#get-data)
  - [Set data](#set-data)
  - [Use selectors](#use-selectors)
  - [Use reducers](#use-reducers)
  - [Using in SSR application](#using-in-ssr-application)
  - [Obfuscate data](#obfuscate-data)
  - [Expire timer](#expire-timer)
  - [Schema validation](#schema-validation)

 ## Installation
To install the latest stable version, run the following command:
```shell
# npm
npm install killua

# pnpm
pnpm install killua

# yarn
yarn add killua
```

## Features

- Get data from localStorage
- Set data to localStorage
- Reducer for state management
- Selector for data access
- Expiration timer
- Schema validation
- Obfuscate data in localStorage
- Server-Side Compatibility
- TypeScript friendly
- Auto update in other tabs
- Auto update in other components
- Config file for configuration management

## examples

- shopping cart : [live demo](https://killua-shopping-cart.vercel.app/) - [source code](https://github.com/sys113/killua/tree/main/websites/examples/shopping%20cart)
- todo list : [live demo](https://killua-todo-list.vercel.app/) - [source code](https://github.com/sys113/killua/tree/main/websites/examples/todo%20list)
- switch theme : [live demo](https://killua-switch-theme.vercel.app/) - [source code](https://github.com/sys113/killua/tree/main/websites/examples/switch%20theme)

## Usage

### Create slice configuration file

> Whatever the `useKillua` hook returns, the `slice` function also returns.<br /> Use the useKillua hook within the React framework, and as long as you don't have access to it, use the slice function.

> that `slice` refers to a key within localStorage.

1. Create a `slices` directory for the thunder configuration.
2. Create the slice configuration file, for example: `counter.ts`.
3. Set up the slice configuration:
```ts
import { slice } from 'killua';

export const counterSlice = slice({
  key: 'counter', // unique key for localStorage
  defaultClient: 1 as number // default value for client-side application
});
```

### Get data

- Within a React component, utilize the `useKillua` hook :

```tsx
import { useKillua } from "killua";
import { counterSlice } from "@/slices/counter";

export default function Component() {
  const localstorageCounter = useKillua(counterSlice);
  return (
    <div>
      <p>{counterSlice.get()}</p>
    </div>
  )
};
```

- Outside of a React component, employ the `slice` function :

```ts
import { counterSlice } from '@/slices/counter';

export function getCounter() {
  return counterSlice.get();
}
```

### Set data

- Within a React component, utilize the `useKillua` hook :

```tsx
import { useKillua } from "killua";
import { counterSlice } from "@/slices/counter";

export default function Component() {
  const localstorageCounter = useKillua(counterSlice);
  return (
    <div>
      {/* without callback */}
      <button onClick={() => counterSlice.set(0)}>Set counter to zero</button>
      {/* with callback */}
      <button onClick={() => counterSlice.set((prev) => prev + 1)}>Increment counter</button>
    </div>
  )
};
```

- Outside of a React component, employ the `slice` function :

```ts
import { counterSlice } from '@/slices/counter';

// without callback
export function setCounterToZero() {
  counterSlice.set(0);
}

// with callback
export function incrementCounter() {
  counterSlice.set(prev => prev + 1);
}
```

### Use selectors 

- To use a selector, simply add it to the slice config :
```ts
import { slice } from 'killua';

export const counterSlice = slice({
  key: 'counter',
  defaultClient: 1 as number,
  selectors: {
    getPlusOne: (value) => value + 1,
    getPlusWithPayload: (value, payload: number) => value + payload
  }
});
```
- Within a React component, utilize the `useKillua` hook :

```tsx
import { useKillua } from "killua";

export default function Component() {
  const localstorageCounter = useKillua(counterSlice);
  return (
    <div>
      <p>{localstorageCounter.getPlusOne()}</p> {/* without payload */}
      <p>{localstorageCounter.getPlusWithPayload(5)}</p> {/* with payload */}
    </div>
  )
};
```
- Outside of a React component, employ the `slice` function :

```ts showLineNumbers {5,10} filename="utils/get-counter.ts" copy
import { counterSlice } from '@/slices/counter';

// without payload
export function getCounterWithPlusOne() {
  return counterSlice.getPlusOne();
}

// with payload
export function getCounterWithPlusWithPayload() {
  return counterSlice.getPlusWithPayload(5);
}
```

### Use reducers

- To use a reducer, simply add it to the slice config :
```ts
import { slice } from 'killua';

export const counterSlice = slice({
  key: 'counter',
  defaultClient: 1 as number,
  reducers: {
    increment: (value) => value + 1,
    incrementWithPayload: (value, payload: number) => value + payload
  }
});
```

- Within a React component, utilize the `useKillua` hook :

```tsx
import { useKillua } from "killua";

export default function Component() {
  const localstorageCounter = useKillua(counterSlice);
  return (
    <div>
      <button onClick={() => localstorageCounter.increment()}>Increment counter</button> {/* without payload */}
      <button onClick={() => localstorageCounter.incrementWithPayload(5)}>Increment counter with payload</button> {/* with payload */}
    </div>
  )
};
```

- Outside of a React component, employ the `slice` function :

```ts
import { counterSlice } from '@/slices/counter';

// without payload
export function incrementCounter() {
  counterSlice.increment();
}
```

### Using in SSR application

> As long as the initial server-side rendering occurs and there is no access to localStorage, `defaultServer` will be returned. Later, when the client-side rendering takes place, data will be fetched from localStorage and returned.

>  As long as `defaultServer` exists in the config, both the `useKillua` hook and the `slice` function will return a property named `isReady`.<br /> If this value is `false`, it means that it is server-side and localStorage is not accessible, and the returned value is `defaultServer`.<br />If this value is true, it means that it is client-side and localStorage isaccessible, and the fetched value is from localStorage.

- add `defaultServer` to the slice configuration :

```ts
import { slice } from 'killua';

export const counterSlice = slice({
  key: 'counter',
  defaultClient: 1 as number,
  defaultServer: 2 // default value for server-side application
});
```

- Within a React component, utilize the `useKillua` hook :

```tsx
'use client';

import { useKillua } from "killua";

export default function Component() {
  const localstorageCounter = useKillua(counterSlice);
  return (
    <div>
      {localstorageCounter.isReady ? <p>{localstorageCounter.get()}</p> : <p>Loading...</p>}
    </div>
  )
};
```

- Outside of a React component, employ the `slice` function :

```ts
import { counterSlice } from '@/slices/counter';

export function getCounter() {
  // if is server-side ? return defaultServer : return localStorage value
  return counterSlice.get();
}

// with payload
export function incrementCounterWithPayload() {
  counterSlice.incrementWithPayload(5);
}
```

### Obfuscate data

> As long as obsfacte is present in the slice config, your data is not protected but merely obfuscated.

> Avoid placing sensitive data on localStorage.

- To obfuscate localStorage data, simply add it to the slice config:

```ts
import { slice } from 'killua';

export const counterSlice = slice({
  key: 'counter',
  defaultClient: 1 as number,
  obsfacte: true // obfuscate data in localStorage
});
```

### Expire timer

> If the localStorage data expires at the moment when a user is on the website and the `useKillua` hook is in use, the data will be immediately removed from localStorage. Subsequently, the `useKillua` hook will update and return the `defaultClient` value.

> If the user enters the site and the data has already expired, the `defaultClient` value will be returned.

- To set an expiration time for localStorage data, simply add it to the slice config :

```ts
import { slice } from 'killua';

export const counterSlice = slice({
  key: 'counter',
  defaultClient: 1 as number,
  expire: '1d-9h-24m-10s' // expire time for localStorage data (1 day, 9 hours, 24 minutes, 10 seconds)
});
```

### Schema validation

> If `schema` exists in the configuration, when the localStorage is updated using `set` or `reducers`, the data will be validated against that `schema`. If it is not valid, it will not be set on the localStorage.

> If `schema` is exists in the configuration, when the localStorage data is retrieved using `selectors` or `get`, and if it is validated against the `schema` and found to be invalid, the `defaultClient` value will be returned instead.

- To set a schema for localStorage data, simply add it to the slice config :

```ts
import { slice } from 'killua';

export const counterSlice = slice({
  key: 'counter',
  defaultClient: 1 as number,
  schema: z.number().min(0).max(10) // zod schema or yup schema
});
```
