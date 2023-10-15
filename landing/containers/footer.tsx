import { imageLogo } from '@/constants/images';
import Image from 'next/image';
import Link from 'next/link';

export default function Footer(): JSX.Element {
  return (
    <footer className="py-8 mt-10 bg-[url('../assets/images/footer-bg.png')] bg-cover">
      <div
        className={`container flex flex-col gap-6 sm:gap-8 sm:flex-row lg:gap-10`}
      >
        <div className="space-y-2">
          <div className="flex flex-col gap-2">
            <Link href={'/'} className="flex items-center gap-2">
              {/* logo */}
              <Image src={imageLogo} width={120} height={30} alt="logo" />
              {/* version */}
              <span className="text-lg font-medium">
                {process.env.KILLUA_VERSION}
              </span>
            </Link>
            {/* description */}
            <p className="font-light text-[#b5b5b5] w-[240px]">
              a local-storage management library for react applications.
            </p>
          </div>
          {/* links */}
          <ul className="[&>li]:lg:text-[17px] [&>li]:font-light [&>li]:text-[#dedede] [&>li]:transition-all [&>li]:duration-300 hover:[&>li]:text-white">
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
          <p className="text-lg font-semibold lg:font-bold">DOCUMENTATION</p>
          {/* links */}
          <ul className="[&>li]:lg:text-[17px] [&>li]:font-light [&>li]:text-[#dedede] [&>li]:transition-all [&>li]:duration-300 hover:[&>li]:text-white">
            <li>
              <Link
                href={'https://github.com/sys113/killua/blob/main/CHANGELOG.md'}
              >
                installation
              </Link>
            </li>
            <li>
              <Link
                href={
                  'https://github.com/sys113/killua/blob/main/CONTRIBUTING.md'
                }
              >
                Usage
              </Link>
            </li>
            <li>
              <Link href={'https://github.com/sys113/killua/blob/main/LICENSE'}>
                Features
              </Link>
            </li>
          </ul>
        </div>
        <div className="space-y-1">
          {/* title */}
          <p className="text-lg font-semibold lg:font-bold">AVAILABLE ON</p>
          {/* links */}
          <ul className="[&>li]:lg:text-[17px] [&>li]:font-light [&>li]:text-[#dedede] [&>li]:transition-all [&>li]:duration-300 hover:[&>li]:text-white">
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
