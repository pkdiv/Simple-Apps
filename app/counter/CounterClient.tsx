'use client';

import dynamic from 'next/dynamic';

const LimitCounter = dynamic(() => import('@/components/utilities/LimitCounter'), {
    ssr: false,
});

export default function CounterClient() {
    return <LimitCounter />;
}
