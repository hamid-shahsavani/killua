'use client';

import { IconArrowRight } from '@/public/icons/arrow-right';
import IconChevron from '@/public/icons/chevron';
import Image from 'next/image';
import Link from 'next/link';
import { useRef, useState } from 'react';
import 'swiper/css';
import { Swiper, SwiperSlide } from 'swiper/react';

function Card(props: {
  title: string;
  description: string;
  image: string;
  url: string;
}) {
  return (
    <Link
      target="_blank"
      href={props.url}
      className="flex justify-center w-full h-full group"
    >
      <div className="relative w-full h-full">
        <div className="absolute inset-0 transition-all lg:-mb-[2px] duration-300 opacity-0 border-c-gradient group-hover:opacity-100 rounded-3xl" />
        <div className="relative bg-[#222] h-full flex flex-col items-center p-3 rounded-3xl m-[1px]">
          <div className="flex justify-end w-full">
            <div className="px-5 py-[7px] rounded-[14px] bg-c-purple">
              <IconArrowRight />
            </div>
          </div>
          <Image src={props.image} width={60} height={60} alt={props.title} />
          <p className="py-2 font-bold text-[17px]">{props.title}</p>
          <p className="font-normal text-center text-[15px] text-[#eee] max-w-[350px]">
            {props.description}
          </p>
        </div>
      </div>
    </Link>
  );
}

export default function GuideUsage(): JSX.Element {
  const cardsData = [
    {
      url: 'https://killua-docs.vercel.app/usage/react.js/javascript',
      image: '/images/js.png',
      title: 'JavaScript',
      description:
        'Effortlessly handle and optimize local storage operations to enhance the performance and user experience of your JavaScript projects.'
    },
    {
      url: 'https://killua-docs.vercel.app/usage/react.js/typescript',
      image: '/images/ts.png',
      title: 'TypeScript',
      description:
        'Leverage the type safety and enhanced tooling provided by TypeScript to seamlessly manage local storage in your applications, ensuring a robust and error-free development experience.'
    },
    {
      url: 'https://killua-docs.vercel.app/usage/next.js/javascript',
      image: '/images/ssr.png',
      title: 'Nextjs',
      description:
        'you can easy seamlessly integrate the "killua" package with Next.js in both the app directory and the page directory.'
    }
  ];

  // mobile card slider
  const mobileCardSliderRef = useRef<any>(null);
  const [
    mobileCardSliderPrevAndNextIsAvilable,
    setMobileCardSliderPrevAndNextIsAvilable
  ] = useState({
    prev: false,
    next: false
  });
  const mobileCardSliderNavigationHandler = (type: 'next' | 'prev') => {
    if (!mobileCardSliderRef.current) return;
    mobileCardSliderRef.current.swiper[
      type === 'next' ? 'slideNext' : 'slidePrev'
    ]();
  };

  return (
    <section>
      <div className="container flex flex-col gap-5">
        {/* head */}
        <div className="flex items-center justify-between">
          <h3 className="font-daysOne text-[26px] lg:text-[36px]">
            Guide Usage
          </h3>
          <div className="lg:hidden [&>button]:border rotate-180 flex gap-3 [&>button]:transition-all [&>button]:duration-300 [&>button]:rounded-3xl [&>button]:flex [&>button]:justify-center [&>button]:items-center [&>button]:w-[40px] [&>button]:h-[40px]">
            <button
              onClick={() => mobileCardSliderNavigationHandler('next')}
              className={
                mobileCardSliderPrevAndNextIsAvilable.next
                  ? 'bg-c-purple border-transparent'
                  : 'pointer-events-none border-[#676767]'
              }
            >
              <IconChevron className="stroke-white" />
            </button>
            <button
              onClick={() => mobileCardSliderNavigationHandler('prev')}
              className={
                mobileCardSliderPrevAndNextIsAvilable.prev
                  ? 'bg-c-purple border-transparent'
                  : 'pointer-events-none border-[#676767]'
              }
            >
              <IconChevron className="-rotate-180 stroke-white" />
            </button>
          </div>
        </div>
        {/* body */}
        <div>
          {/* mobile */}
          <div className="h-full lg:hidden">
            <Swiper
              ref={mobileCardSliderRef}
              slidesPerView={1}
              breakpoints={{
                550: {
                  slidesPerView: 2,
                  spaceBetween: 20
                }
              }}
              onInit={e => {
                setMobileCardSliderPrevAndNextIsAvilable({
                  prev: !e.isBeginning,
                  next: !e.isEnd
                });
              }}
              onSlideChange={e =>
                setMobileCardSliderPrevAndNextIsAvilable({
                  prev: !e.isBeginning,
                  next: !e.isEnd
                })
              }
              className="flex justify-center overflow-hidden"
            >
              {cardsData.map(item => {
                return (
                  <SwiperSlide key={item.title} className="h-full">
                    <Card {...item} />
                  </SwiperSlide>
                );
              })}
            </Swiper>
          </div>
          {/* desktop */}
          <div className="hidden grid-cols-3 gap-5 lg:grid">
            {cardsData.map(item => {
              return <Card key={item.title} {...item} />;
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
