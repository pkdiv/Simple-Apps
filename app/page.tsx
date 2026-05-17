import PreviewCard from "@/components/PageComponents/PreviewCard";
import BuyMeACoffee from "@/components/utilities/BuyMeACoffee";

import counterImg from "@/public/previews/counter.webp";
import pomodoroImg from "@/public/previews/pomodoro.webp";
import graphImg from "@/public/previews/graph.webp";
import timezoneImg from "@/public/previews/timezone.webp";

const apps = [
    {
        slug: "counter",
        name: "Tap Counter",
        description:
            "Count taps with a custom limit. Plays an alarm when you hit your target.",
        external: false,
        previewImage: counterImg,
    },
    {
        slug: "pomodoro",
        name: "Pomodoro Timer",
        description:
            "Stay focused with a minimalist Pomodoro timer. Customizable focus and break intervals.",
        external: false,
        previewImage: pomodoroImg,
    },
    {
        slug: "graph",
        name: "Data Visualizer",
        description:
            "Visualize your data instantly. Upload or paste CSV data to generate beautiful bar charts.",
        external: false,
        previewImage: graphImg,
    },
    {
        slug: "timezone",
        name: "Timezone Converter",
        description:
            "Compare times across different time zones. Minimalist tool for global scheduling.",
        external: false,
        previewImage: timezoneImg,
    },
];




export default function AppsPage() {
    return (
        <main className="min-h-screen bg-zinc-950 px-6 py-16">
            <div className="mx-auto max-w-2xl">

                <div className="mb-12">
                    <p className="text-xs font-medium uppercase tracking-widest text-zinc-400">
                        My Apps
                    </p>
                    <h1 className="mt-2 text-3xl font-semibold text-white">
                        Tools & Projects
                    </h1>
                    <p className="mt-2 text-sm text-zinc-400">
                        A collection of small apps and tools I&apos;ve built.
                    </p>
                </div>

                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                    {apps.map((app) => (
                        <PreviewCard
                            key={app.name}
                            name={app.name}
                            description={app.description}
                            href={app.external ? app.slug : `/${app.slug}`}
                            previewSrc={app.external ? app.slug : `/${app.slug}`}
                            previewImage={app.previewImage}
                            external={app.external}
                        />
                    ))}
                </div>

                <div className="mt-16 flex justify-center">
                    <BuyMeACoffee />
                </div>
            </div>
        </main>
    );
}