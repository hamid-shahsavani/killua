import Image from 'next/image';
import Link from 'next/link';

export default function Footer(): JSX.Element {
  return (
    <footer className="py-8 mt-10 bg-[url('/images/footer-bg.png')] bg-cover">
      <div
        className={`container flex flex-col gap-6 sm:gap-8 sm:flex-row lg:gap-10`}
      >
        <div className="space-y-2">
          <div className="flex flex-col gap-2">
            <Link href={'/'} className="flex items-center gap-2">
              {/* logo */}
              <Image
                src={'/images/logo.png'}
                width={120}
                height={30}
                alt="logo"
              />
            </Link>
            {/* description */}
            <p className="font-normal text-[#b5b5b5] w-[240px]">
              a local-storage management library for react applications.
            </p>
          </div>
          {/* links */}
          <ul className="[&>li]:lg:text-[17px] [&>li]:font-normal [&>li]:text-[#dedede] [&>li]:transition-all [&>li]:duration-300 hover:[&>li]:text-white">
            <li>
              <Link
                href={'https://github.com/sys113/killua/blob/main/CHANGELOG.md'}
              >
                Changelog
              </Link>
            </li>
            <li>
              <Link
                href={
                  'https://github.com/sys113/killua/blob/main/CONTRIBUTING.md'
                }
              >
                Contributing
              </Link>
            </li>
            <li>
              <Link href={'https://github.com/sys113/killua/blob/main/LICENSE'}>
                License
              </Link>
            </li>
          </ul>
        </div>
        <div className="space-y-1">
          {/* title */}
          <p className="text-lg font-semibold lg:font-bold">Usage</p>
          {/* links */}
          <ul className="[&>li]:lg:text-[17px] [&>li]:font-normal [&>li]:text-[#dedede] [&>li]:transition-all [&>li]:duration-300 hover:[&>li]:text-white">
            <li>
              <Link
                target="_blank"
                href={
                  'https://killua-docs.vercel.app/usage/react.js/javascript'
                }
              >
                react.js with javascript
              </Link>
            </li>
            <li>
              <Link
                target="_blank"
                href={
                  'https://killua-docs.vercel.app/usage/react.js/typescript'
                }
              >
                react.js with typescript
              </Link>
            </li>
            <li>
              <Link
                target="_blank"
                href={'https://killua-docs.vercel.app/usage/next.js/javascript'}
              >
                next.js with javascript
              </Link>
            </li>
            <li>
              <Link
                target="_blank"
                href={'https://killua-docs.vercel.app/usage/next.js/typescript'}
              >
                next.js with typescript
              </Link>
            </li>
          </ul>
        </div>
        <div className="space-y-1">
          {/* title */}
          <p className="text-lg font-semibold lg:font-bold">AVAILABLE ON</p>
          {/* links */}
          <ul className="[&>li]:lg:text-[17px] [&>li]:font-normal [&>li]:text-[#dedede] [&>li]:transition-all [&>li]:duration-300 hover:[&>li]:text-white">
            <li>
              <Link href={'https://github.com/sys113/killua'}>Github</Link>
            </li>
            <li>
              <Link href={'https://www.npmjs.com/package/killua'}>NPM</Link>
            </li>
          </ul>
        </div>
      </div>
    </footer>
  );
}
