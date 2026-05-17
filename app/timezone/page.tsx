import TimezoneConverter from '@/components/utilities/TimezoneConverter';
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Timezone Converter | Global Time Comparison",
    description: "Compare times across different time zones with a minimalist, easy-to-use interface. Perfect for remote teams and global travelers.",
    keywords: ["timezone converter", "world clock", "time comparison", "global time", "timezone tool"],
};

export default function Page() {
    return (
        <main className="h-screen flex flex-col overflow-hidden">
            <TimezoneConverter />
        </main>
    );
}
