# killua &middot; ![](https://img.shields.io/npm/v/killua.svg) ![](https://img.shields.io/npm/dw/killua) ![](https://img.shields.io/github/stars/SYS113/killua.svg) ![](https://img.shields.io/github/issues/SYS113/killua.svg) ![](https://img.shields.io/badge/language-typescript-blue.svg) ![](https://img.shields.io/badge/license-MIT-informational.svg)
 killua is a local-storage management library for React applications.

 ## Installation
To install the latest stable version, run the following command:
```shell
npm install killua
```

## Features
- Get data from local storage
- Set data to local storage
- SSR friendly
- TypeScript friendly
- Auto update in other tabs
- Auto update in other components
- Set expiration timer
- Encrypt local storage data
- Config file for configuration management
- Reducer for state management
- Selector for data access

## Examples
- [nextjs app directory - typescript](https://codesandbox.io/p/github/sys113/killua-example-nextjs-appdir-typescript/)
- [reactjs vite - javascript](https://codesandbox.io/p/github/sys113/killua-example-react-vite-javascript/)

## Typescript usage
:warning: This readme is written for TypeScript users. If you are a JavaScript user, be sure to check out our [Javascript usage section](#javascript-usage).
<br />
:warning: This readme is written for client-side rendering (CSR). If you need usage in server-side rendering (SSR), be sure to check out our [SSR usage section](#ssr-usage).

1. Create a "thunders" directory for the thunder configuration.
2. Create the thunder configuration file, for example: "counter.ts".
3. Set up the configuration:
```ts
import { thunder } from "killua";
import { ThunderType } from "killua/types/thunder.type";

const thunderCounter: ThunderType = thunder({
  key: "counter",
  encrypt: false,
  default: 1,
  expire: 1,
  reducers: {
    increment: (thunder: number) => thunder + 1,
    incrementWithPayload: (thunder: number, payload: number) => thunder + payload,
    reset: () => 1,
  },
  selectors: {
    getCounterPlusOne: (thunder: number) => thunder + 1,
    getCounterPlusPayload: (thunder: number, payload: number) => thunder + payload,
  },
});

export { thunderCounter };
```
4. Thunder type definition:
```ts
type ThunderType = {
  key: string; // Unique key for local storage, without starting with "thunder" (e.g., "thunderCounter")
  encrypt: boolean;
  expire: null | number; // Null to disable the expiration timer, or a number indicating the expiration time in minutes
  default: any; // Initial value for the thunder
  reducers?: {
    [key: string]: (thunder: any, payload: any) => any;
  };
  selectors?: {
    [key: string]: (thunder: any, payload: any) => any;
  }
};
```
5. Use the thunder configuration in your component:
```tsx
import { thunderCounter } from "../thunders/counter";
import { useKillua } from "killua";

const Counter = () => {
  // all desctructer property is optional
  const {
    thunder: thunderCounterState,
    setThunder: thunderCounterSetState,
    reducers: thunderCounterReducers,
    selectors: thunderCounterSelectors,
  } = useKillua<number>(thunderCounter);

  return (
    <>
      <h2> === Thunder === </h2>
      <h2>Counter: {thunderCounterState}</h2>
      <hr />
      <h2> === Set Thunder === </h2>
      <button onClick={() => thunderCounterSetState((prev: number) => prev + 1)}>Set Thunder with callback</button>
      <button onClick={() => thunderCounterSetState(12)}>Set Thunder without callback</button>
      <hr />
      <h2> === Reducers === </h2>
      <button onClick={() => thunderCounterReducers.increment()}>Increment</button>
      <button onClick={() => thunderCounterReducers.incrementWithPayload(5)}>Increment with payload</button>
      <button onClick={() => thunderCounterReducers.reset()}>Reset</button>
      <hr />
      <h2> === Selectors === </h2>
      <button onClick={() => console.log(thunderCounterSelectors.getCounterPlusOne())}>Get counter with plus one</button>
      <button onClick={() => console.log(thunderCounterSelectors.getCounterPlusPayload(10))}>Get counter with plus payload</button>
    </>
  )
};

export default Counter;
```

## Javascript usage

1. Create a "thunders" directory for the thunder configuration.
2. Create the thunder configuration file, for example: "counter.js".
3. Set up the configuration:
```js
import { thunder } from "killua";

const thunderCounter = thunder({
  key: "counter",
  encrypt: false,
  default: 1,
  expire: 1,
  reducers: {
    increment: (thunder) => thunder + 1,
    incrementWithPayload: (thunder, payload) => thunder + payload,
    reset: () => 1,
  },
  selectors: {
    getCounterPlusOne: (thunder) => thunder + 1,
    getCounterPlusPayload: (thunder, payload) => thunder + payload,
  },
});

export { thunderCounter };
```
4. Use the thunder configuration in your component:
```jsx
import { thunderCounter } from "../thunders/counter";
import { useKillua } from "killua";

const Counter = () => {
  // all desctructer property is optional
  const {
    thunder: thunderCounterState,
    setThunder: thunderCounterSetState,
    reducers: thunderCounterReducers,
    selectors: thunderCounterSelectors,
  } = useKillua(thunderCounter);

  return (
    <>
      <h2> === Thunder === </h2>
      <h2>Counter: {thunderCounterState}</h2>
      <hr />
      <h2> === Set Thunder === </h2>
      <button onClick={() => thunderCounterSetState((prev) => prev + 1)}>Set Thunder with callback</button>
      <button onClick={() => thunderCounterSetState(12)}>Set Thunder without callback</button>
      <hr />
      <h2> === Reducers === </h2>
      <button onClick={() => thunderCounterReducers.increment()}>Increment</button>
      <button onClick={() => thunderCounterReducers.incrementWithPayload(5)}>Increment with payload</button>
      <button onClick={() => thunderCounterReducers.reset()}>Reset</button>
      <hr />
      <h2> === Selectors === </h2>
      <button onClick={() => console.log(thunderCounterSelectors.getCounterPlusOne())}>Get counter with plus one</button>
      <button onClick={() => console.log(thunderCounterSelectors.getCounterPlusPayload(10))}>Get counter with plus payload</button>
    </>
  )
};

export default Counter;
```

## SSR usage

⚠️ The 'thunder' and the return values of methods on the 'selectors' object may be undefined during the first render in SSR. If you want to use their return values, check if 'isReadyInSsr' is true before accessing them.

1. Create app/providers.tsx and wrap the Component with the SSRKilluaProvider:
```tsx
'use client';

import { SSRKilluaProvider } from 'killua';

export function Providers({ children }: { children: React.ReactNode }) {
  return (
   <SSRKilluaProvider>
    {children}
   </SSRKilluaProvider>
  );
}
```
2. Create a "thunders" directory for the thunder configuration.
3. Create the thunder configuration file, for example: "counter.ts".
4. Set up the configuration:
```ts
import { thunder } from "killua";
import { ThunderType } from "killua/types/thunder.type";

const thunderCounter: ThunderType = thunder({
  key: "counter",
  encrypt: false,
  default: 1,
  expire: 1,
  reducers: {
    increment: (thunder: number) => thunder + 1,
    incrementWithPayload: (thunder: number, payload: number) => thunder + payload,
    reset: () => 1,
  },
  selectors: {
    getCounterPlusOne: (thunder: number) => thunder + 1,
    getCounterPlusPayload: (thunder: number, payload: number) => thunder + payload,
  },
});

export { thunderCounter };
```
5. Thunder type definition:
```ts
type ThunderType = {
  key: string; // Unique key for local storage, without starting with "thunder" (e.g., "thunderCounter")
  encrypt: boolean;
  expire: null | number; // Null to disable the expiration timer, or a number indicating the expiration time in minutes
  default: any; // Initial value for the thunder
  reducers?: {
    [key: string]: (thunder: any, payload: any) => any;
  };
  selectors?: {
    [key: string]: (thunder: any, payload: any) => any;
  }
};
```
6. Use the thunder configuration in your component:
```tsx
import { thunderCounter } from "../thunders/counter";
import { useKillua } from "killua";

const Counter = () => {
  // all desctructer property is optional
  const {
    thunder: thunderCounterState,
    setThunder: thunderCounterSetState,
    isReadyInSsr: thunderCounterIsReadyInSsr,
    reducers: thunderCounterReducers,
    selectors: thunderCounterSelectors,
  } = useKillua<number>(thunderCounter);

  return (
    <>
      <h2> === Thunder === </h2>
      <h2>Counter: {thunderCounterIsReadyInSsr ? thunderCounterState : 'wait ...'}</h2>
      <hr />
      <h2> === Set Thunder === </h2>
      <button onClick={() => thunderCounterSetState((prev: number) => prev + 1)}>Set Thunder with callback</button>
      <button onClick={() => thunderCounterSetState(12)}>Set Thunder without callback</button>
      <hr />
      <h2> === Reducers === </h2>
      <button onClick={() => thunderCounterReducers.increment()}>Increment</button>
      <button onClick={() => thunderCounterReducers.incrementWithPayload(5)}>Increment with payload</button>
      <button onClick={() => thunderCounterReducers.reset()}>Reset</button>
      <hr />
      <h2> === Selectors === </h2>
      <button onClick={() => console.log(thunderCounterSelectors.getCounterPlusOne())}>Get counter with plus one</button>
      <button onClick={() => console.log(thunderCounterSelectors.getCounterPlusPayload(10))}>Get counter with plus payload</button>
    </>
  )
};

export default Counter;
```
