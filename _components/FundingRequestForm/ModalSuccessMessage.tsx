'use client';

import { useState, useEffect } from 'react';

type Props = {
  isVisible: boolean;
};

export default function SuccessMessage({ isVisible }: Props) {
  const [fadeOut, setFadeOut] = useState(false);

  useEffect(() => {
    if (isVisible) {
      setFadeOut(false);
      const timer = setTimeout(() => setFadeOut(true), 3000);
      return () => clearTimeout(timer);
    }
  }, [isVisible]);

  return (
    isVisible && (
      <div
        className={`${
          fadeOut ? 'animate-out' : 'animate-in'
        } absolute w-full h-[105%] -mt-20 -ml-6 p-8 bg-btn-background rounded-lg flex flex-col justify-center items-center gap-8`}
      >
        <svg viewBox='0 0 24 24' fill='none' width={40} height={40}>
          <circle cx={12} cy={12} r={12} fill='#fff' opacity='0.2' />
          <path
            d='M7 13l3 3 7-7'
            stroke='#fff'
            strokeWidth={1.5}
            strokeLinecap='round'
            strokeLinejoin='round'
          />
        </svg>
        <p className='text-lg font-medium'>
          Funding request successfully submitted
        </p>
      </div>
    )
  );
}
