"use client";

import { Sheet, SheetContent, SheetTrigger, SheetTitle } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Menu } from "lucide-react";
import Link from "next/link";
import { useState, useEffect } from "react";
import { PortfolioData } from "@/lib/data";

const navItems = [
    { label: "Home", href: "#home" },
    { label: "Experience", href: "#experience" },
    { label: "Projects", href: "#projects" },
    { label: "Contact", href: "#contact" },
];

interface MobileNavProps {
    data: PortfolioData;
}

export function MobileNav({ data }: MobileNavProps) {
    const [open, setOpen] = useState(false);

    useEffect(() => {
        const mediaQuery = window.matchMedia("(min-width: 1024px)");
        const handleResize = (e: MediaQueryListEvent | MediaQueryList) => {
            if (e.matches) {
                setOpen(false);
            }
        };

        // Initialize
        handleResize(mediaQuery);

        mediaQuery.addEventListener("change", handleResize);
        return () => mediaQuery.removeEventListener("change", handleResize);
    }, []);

    return (
        <div className="lg:hidden flex items-center justify-between p-6 bg-black/50 backdrop-blur-sm sticky top-0 z-50">
            <div className="font-bold text-lg tracking-tighter text-zinc-100 font-brand">{data.personal.name}</div>
            <Sheet open={open} onOpenChange={setOpen}>
                <SheetTrigger asChild>
                    <Button variant="ghost" size="icon" className="text-zinc-400">
                        <Menu className="w-6 h-6" />
                    </Button>
                </SheetTrigger>
                <SheetContent side="right" className="w-full bg-black border-zinc-800 p-12">
                    <SheetTitle className="sr-only">Menu</SheetTitle>
                    <nav className="flex flex-col gap-8 mt-12">
                        {navItems.map((item) => (
                            <Link
                                key={item.href}
                                href={item.href}
                                onClick={() => setOpen(false)}
                                className="text-2xl font-bold tracking-tighter text-zinc-100 hover:text-zinc-400 transition-colors"
                            >
                                {item.label}
                            </Link>
                        ))}
                    </nav>
                </SheetContent>
            </Sheet>
        </div>
    );
}
