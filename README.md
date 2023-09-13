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
:warning: This readme is written for Typescript users. If you are a Java script user, be sure to check out our [Javascript Usage section](#javascript-usage).
<br />
:warning: This readme is written for csr. If you need usage in ssr, be sure to check out our [SSR Usage section](#ssr-usage)
* tip : localstorage key is thunder and need create config for 
1. create 'thunders' directory for thunder config
2. create thunder config file, simple: counter.ts
3. set config ...
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
4. thunder type ...
```ts
type ThunderType = {
  key: string; // uniqe key for local storage, without start with thunder, simple: 'thunderCounter'
  encrypt: boolean;
  expire: null | number; // null for disable expire timer and set number for minuate for expire
  default: any; // initial value for thunder
  reducers?: {
    [key: string]: (thunder: any, payload: any) => any;
  };
  selectors?: {
    [key: string]: (thunder: any, payload: any) => any;
  }
};
```
5. use thunder config in component
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
      <h2> === thunder === </h2>
      <h2>counter one : {thunderCounterState}</h2>
      <hr />
      <h2> === set thunder === </h2>
      <button onClick={() => thunderCounterSetState((prev: number) => prev + 1)}>set thunder with callback</button>
      <button onClick={() => thunderCounterSetState(12)}>set thunder without callback</button>
      <hr />
      <h2> === reducers === </h2>
      <button onClick={() => thunderCounterReducers.increment()}>increment</button>
      <button onClick={() => thunderCounterReducers.incrementWithPayload(5)}>increment with payload</button>
      <button onClick={() => thunderCounterReducers.reset()}>reset</button>
      <hr />
      <h2> === selectors === </h2>
      <button onClick={() => console.log(thunderCounterSelectors.getCounterPlusOne())}>get counter with plus one</button>
      <button onClick={() => console.log(thunderCounterSelectors.getCounterPlusPayload(10))}>get counter with plus payload</button>
    </>
  )
};

export default Counter;
```

## Javascript usage

## SSR usage
