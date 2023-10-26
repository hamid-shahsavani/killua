'use client';

import {
  IconArrowRight,
  IconChevron,
  IconCopy,
  IconTick,
} from '@/constants/icons';
import { thunderCounter } from '@/thunders/counter';
import 'highlight.js/styles/atom-one-dark-reasonable.css';
import { useKillua } from 'killua';
import Link from 'next/link';
import { useState } from 'react';
import Highlight from 'react-highlight';

export default function Hero(): JSX.Element {
  // install command copy to clipboard
  const [
    installCommandCopyToClipboardSuccessfully,
    setInstallCommandCopyToClipboardSuccessfully,
  ] = useState(false);
  const installCommandCopyToClipboardHandler = (): void => {
    navigator.clipboard.writeText(`npm i killua`);
    setInstallCommandCopyToClipboardSuccessfully(true);
    setTimeout((): void => {
      setInstallCommandCopyToClipboardSuccessfully(false);
    }, 2000);
  };

  // thunder counter source code
  const {
    thunder: thunderCounterState,
    reducers: thunderCounterReducers,
    isReadyInSsr: thunderCounterIsReadyInSsr,
  } = useKillua(thunderCounter);
  const [activedFileTab, setActivedFileTab] = useState<'counter' | 'Component'>(
    'counter',
  );
  const [activedLanguageType, setActivedLanguageType] = useState<'js' | 'ts'>(
    'ts',
  );

  const [
    sourceCodeCopyToClipboardSuccessfully,
    setSourceCodeCopyToClipboardSuccessfully,
  ] = useState(false);
  const codeCopyToClipboardHandler = (): void => {
    navigator.clipboard.writeText(activedSourceCode);
    setSourceCodeCopyToClipboardSuccessfully(true);
    setTimeout((): void => {
      setSourceCodeCopyToClipboardSuccessfully(false);
    }, 2000);
  };
  const activedSourceCode =
    activedFileTab === 'counter'
      ? `// thunders/counter.${activedLanguageType}
import { thunder } from "killua";

const thunderCounter = thunder({
  key: "counter",
  encrypt: false,
  default: 1${activedLanguageType === 'ts' ? ' as number' : ''},
  expire: null,
  reducers: {
    increment: (thunder${
      activedLanguageType === 'ts' ? ': number' : ''
    }) => thunder + 1,
    decrement: (thunder${
      activedLanguageType === 'ts' ? ': number' : ''
    }) => thunder - 1,
  },
});

export { thunderCounter };`
      : `// components/component.${activedLanguageType}x
import { useKillua } from "killua";
import { thunderCounter } from "@/thunders/counter";

export default function Component() {
  const {
    thunder: thunderCounterState,
    reducers: thunderCounterReducers
  } = useKillua(thunderCounter);
  return (
    <>
      <button
        onClick={thunderCounterReducers.increment}
      >+</button>
      <p>{thunderCounterState}</p>
      <button
        onClick={thunderCounterReducers.decrement}
      >-</button>
    <>
  )
};`;

  return (
    <section
      className={`lg:bg-[url('../assets/images/hero-bg.png')] lg:h-[500px] bg-center bg-cover bg-no-repeat lg:-mb-10 items-center flex ${
        activedFileTab === 'Component' && 'lg:mt-14 lg:mb-4'
      }`}
    >
      <div className="container flex flex-col items-center lg:flex-row lg:gap-4 lg:items-start space-y-14 lg:space-y-0">
        <div className="sm:w-[500px] gap-3 lg:gap-4 sm:text-center lg:text-start flex flex-col sm:flex-col sm:justify-center sm:items-center lg:items-start lg:w-1/2">
          {/* install command */}
          <div className="relative mb-2 group w-fit">
            <button
              onClick={installCommandCopyToClipboardHandler}
              className="btn-animation font-light bg-[#222] w-fit px-2 py-1 rounded-lg"
            >
              $ npm i killua
            </button>
            <p className="invisible absolute -top-9 left-1/2 -translate-x-1/2 z-50 w-fit rounded-md bg-c-purple py-1 px-3 text-[13px] text-white opacity-0 transition-all duration-200 before:absolute before:-top-2 before:right-0 before:h-[10px] before:w-full after:absolute after:right-1/2 after:translate-x-1/2 after:w-1 after:border-x-8 after:border-b-8 after:border-t-0 after:border-solid after:border-x-transparent after:rotate-180 after:-bottom-2 after:border-b-c-purple group-hover:visible group-hover:opacity-100">
              {installCommandCopyToClipboardSuccessfully ? 'Copied!' : 'Copy'}
            </p>
          </div>
          <h1 className="text-white text-[28px] max-w-[400px] lg:max-w-full leading-[30px] lg:text-[40px] lg:leading-[50px] font-daysOne">
            <span className="relative px-3">
              <span className="relative z-20 text-black">Killua</span>
              <div className="w-full h-full rounded-full bg-gradient-to-r from-[#A020F0] to-[#F3F731] absolute top-0 left-0 z-0"></div>
            </span>{' '}
            is a local-storage management library for React applications.
          </h1>
          <h2 className="font-light max-w-[550px]">
            Simplify local storage management in your React applications using
            Killua, a robust library specifically designed for efficient
            handling of local storage operations.
          </h2>
          <Link
            target="_blank"
            href="https://killua-docs.vercel.app/"
            className="flex group p-2.5 gap-1 px-[18px] w-fit rounded-full bg-c-purple"
          >
            <span>Get Started</span>
            <IconArrowRight />
          </Link>
        </div>
        <div className="flex flex-col items-center justify-center w-full gap-3 lg:w-1/2 lg:flex-row lg:justify-end">
          <div className="relative w-full mx-2 sm:mx-0 max-w-[400px] sm:max-w-[450px] p-[1px] bg-gradient-to-tl rounded-xl from-c-purple from-40% via-c-yellow via-50% to-transparent to-60%">
            <div className="h-full w-full minimal-scrollbar bg-[#151515] rounded-xl">
              {/* source code */}
              <div>
                <Highlight className="!bg-transparent minimal-scrollbar mb-2 !pb-0 language-javascript !w-full !text-[13px] sm:text-sm">
                  {activedSourceCode}
                </Highlight>
              </div>
              {/* copy-to-clipboard, switchjs-and-ts */}
              <div className="flex justify-end gap-2 px-3 pb-3">
                <button
                  onClick={(): void =>
                    setActivedLanguageType((prev) =>
                      prev === 'js' ? 'ts' : 'js',
                    )
                  }
                  className="border btn-animation py-[7px] px-3 rounded-full flex justify-center items-center text-white font-light"
                >
                  <span className="text-sm font-light">
                    {activedLanguageType === 'js' ? 'JavaScript' : 'TypeScript'}
                  </span>
                  <IconChevron className="w-[18px] mt-0.5 h-[18px] stroke-white -rotate-90 ml-1" />
                </button>
                <button
                  onClick={codeCopyToClipboardHandler}
                  className="p-1.5 btn-animation rounded-lg border"
                >
                  {sourceCodeCopyToClipboardSuccessfully ? (
                    <IconTick />
                  ) : (
                    <IconCopy />
                  )}
                </button>
              </div>
            </div>
            {/* tabs */}
            <div className="absolute -top-[30px] left-2 lg:left-4 text-sm lg:text-md">
              <button
                onClick={(): void => setActivedFileTab('counter')}
                className={`text-white font-light px-8 h-8 bg-cover ${
                  activedFileTab === 'counter' &&
                  "!font-bold bg-[url('../assets/images/active-file-bg.png')]"
                }`}
              >
                counter.{activedLanguageType}
              </button>
              <button
                onClick={(): void => setActivedFileTab('Component')}
                className={`text-white -ml-8 font-light px-9 h-8 bg-cover ${
                  activedFileTab === 'Component' &&
                  "!font-bold bg-[url('../assets/images/active-file-bg.png')]"
                }`}
              >
                Component.{activedLanguageType}x
              </button>
            </div>
          </div>
          {/* counter */}
          <div
            className={`border-c-gradient rounded-full relative transition-all duration-300 ${
              thunderCounterIsReadyInSsr
                ? 'opacity-100 visible'
                : 'opacity-0 invisible'
            }`}
          >
            <div className="w-full h-full flex lg:flex-col-reverse items-center justify-center gap-6 lg:gap-4 bg-[#222] rounded-full px-3 py-2.5">
              <button
                disabled={thunderCounterState === 1}
                onClick={thunderCounterReducers.decrement}
              >
                <IconChevron
                  className={`lg:-rotate-90 w-[26px] h-[26px] btn-animation ${
                    thunderCounterState === 1
                      ? 'stroke-gray-400'
                      : 'stroke-c-yellow'
                  }`}
                />
              </button>
              <p className="flex items-center justify-center w-5 h-5">
                {thunderCounterState}
              </p>
              <button onClick={thunderCounterReducers.increment}>
                <IconChevron
                  className={`stroke-[10px] btn-animation stroke-c-yellow rotate-180 lg:rotate-90 w-[26px] h-[26px]`}
                />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
