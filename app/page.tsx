import PreviewCard from "@/components/PageComponents/PreviewCard";
import BuyMeACoffee from "@/components/utilities/BuyMeACoffee";


const apps = [
    {
        slug: "counter",
        name: "Tap Counter",
        description:
            "Count taps with a custom limit. Plays an alarm when you hit your target.",
        external: false,
    },
    {
        slug: "pomodoro",
        name: "Pomodoro Timer",
        description:
            "Stay focused with a minimalist Pomodoro timer. Customizable focus and break intervals.",
        external: false,
    },

];




export default function AppsPage() {
    return (
        <div className="min-h-screen bg-zinc-950 px-6 py-16">
            <div className="mx-auto max-w-2xl">

                <div className="mb-12">
                    <p className="text-xs font-medium uppercase tracking-widest text-zinc-600">
                        My Apps
                    </p>
                    <h1 className="mt-2 text-3xl font-semibold text-white">
                        Tools & Projects
                    </h1>
                    <p className="mt-2 text-sm text-zinc-500">
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
                            external={app.external}
                        />
                    ))}
                </div>

                <div className="mt-16 flex justify-center">
                    <BuyMeACoffee />
                </div>
            </div>
        </div>
    );
}