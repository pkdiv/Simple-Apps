'use client';

import dynamic from 'next/dynamic';

const PomodoroTimer = dynamic(() => import('@/components/utilities/PomodoroTimer'), {
    ssr: false,
});

export default function PomodoroClient() {
    return <PomodoroTimer />;
}
