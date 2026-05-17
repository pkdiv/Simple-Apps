'use client';

import dynamic from 'next/dynamic';

const CSVToChart = dynamic(() => import('@/components/utilities/CSVToChart'), {
    ssr: false,
});

export default function GraphClient() {
    return <CSVToChart />;
}
