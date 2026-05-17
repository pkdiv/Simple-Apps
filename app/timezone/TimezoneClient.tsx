'use client';

import dynamic from 'next/dynamic';

const TimezoneConverter = dynamic(() => import('@/components/utilities/TimezoneConverter'), {
    ssr: false,
});

export default function TimezoneClient() {
    return <TimezoneConverter />;
}
