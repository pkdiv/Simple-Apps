import { NavSidebar } from "@/components/nav-sidebar";
import { MobileNav } from "@/components/mobile-nav";
import Particles from "@/components/particles";
import { PortfolioData } from "@/lib/data";

interface LayoutShellProps {
    children: React.ReactNode;
    data: PortfolioData;
}

export function LayoutShell({ children, data }: LayoutShellProps) {
    return (
        <div className="flex min-h-screen text-zinc-300 font-sans selection:bg-zinc-500/30">
            {/* Background Layer */}
            <div className="fixed inset-0 bg-black -z-20" />

            <Particles
                className="fixed inset-0 -z-10 animate-fade-in"
                quantity={100}
            />

            <div className="hidden lg:block">
                <NavSidebar data={data} />
            </div>

            <main className="flex-1 w-full flex flex-col relative z-10">
                <MobileNav data={data} />
                {children}
            </main>
        </div>
    );
}
