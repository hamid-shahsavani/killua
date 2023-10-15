'use client';

import { SSRKilluaProvider } from 'killua';

export default function Providers({ children }: any): JSX.Element {
  return <SSRKilluaProvider>{children}</SSRKilluaProvider>;
}
