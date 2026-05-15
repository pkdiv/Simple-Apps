import { PortfolioData } from "@/lib/data";

export function About({ data }: { data: PortfolioData['personal'] }) {
    return (
        <section className="py-24 space-y-8 border-t border-border/50">
            <h2 className="text-3xl font-bold tracking-tight text-foreground">About</h2>
            <div className="prose prose-zinc dark:prose-invert max-w-none text-foreground/90 space-y-4 text-lg leading-relaxed">
                <p>
                    I am {data.name}, a Cloud and Security Engineer with a strong focus on designing, deploying, and operating resilient infrastructure at scale. My background spans both traditional network engineering and modern cloud-native architectures.
                </p>
                <p>
                    Rather than building generic software, I thrive on the complexities of system design—automating away toil, securing the software supply chain, and ensuring that platforms can withstand failure without compromising data integrity or availability.
                </p>
                <p>
                    I&apos;m constantly exploring the trade-offs between zero-trust security postures and developer velocity, aiming to build environments that are both impenetrable by default and seamless to use.
                </p>
            </div>
        </section>
    );
}
