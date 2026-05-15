"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Github, Linkedin, Mail } from "lucide-react";
import { PortfolioData } from "@/lib/data";

const navItems = [
    { label: "Home", href: "#home" },
    { label: "Experience", href: "#experience" },
    { label: "Projects", href: "#projects" },
    { label: "Contact", href: "#contact" },
];

interface NavSidebarProps {
    data: PortfolioData;
}

export function NavSidebar({ data }: NavSidebarProps) {
    const [activeSection, setActiveSection] = useState("home");
    const { personal } = data;

    useEffect(() => {
        const observerOptions = {
            root: null,
            rootMargin: '0px',
            threshold: 0.5,
        };

        const observerCallback = (entries: IntersectionObserverEntry[]) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    setActiveSection(entry.target.id);
                }
            });
        };

        const observer = new IntersectionObserver(observerCallback, observerOptions);

        const sections = ["home", "experience", "projects", "contact"];
        sections.forEach((id) => {
            const element = document.getElementById(id);
            if (element) observer.observe(element);
        });

        return () => observer.disconnect();
    }, []);

    return (
        <aside className="hidden lg:flex w-64 flex-col justify-between h-screen sticky top-0 bg-transparent py-16 px-12">
            {/* Header / Logo */}
            <div className="space-y-2">
                <Link href="/" className="block group">
                    <h1 className="text-xl font-bold tracking-tighter text-zinc-100 group-hover:text-zinc-400 transition-colors font-brand whitespace-nowrap">
                        {personal.name}
                    </h1>
                    <p className="text-[10px] uppercase tracking-[0.2em] text-zinc-500 font-medium">
                        {personal.role}
                    </p>
                </Link>
            </div>

            {/* Navigation */}
            <nav className="flex flex-col space-y-6">
                {navItems.map((item) => {
                    const isActive = activeSection === item.href.substring(1);
                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={`text-sm font-medium transition-all duration-300 hover:translate-x-1 ${isActive
                                ? "text-zinc-100 flex items-center gap-2"
                                : "text-zinc-500 hover:text-zinc-100"
                                }`}
                        >
                            {isActive && <span className="w-4 h-[1px] bg-zinc-100" />}
                            {item.label}
                        </Link>
                    )
                })}
            </nav>

            {/* Footer / Socials */}
            <div className="space-y-8">
                <div className="flex gap-5">
                    {personal.socials.github && (
                        <Link href={personal.socials.github} target="_blank">
                            <Github className="w-4 h-4 text-zinc-500 hover:text-zinc-100 transition-colors" />
                        </Link>
                    )}
                    {personal.socials.linkedin && (
                        <Link href={personal.socials.linkedin} target="_blank">
                            <Linkedin className="w-4 h-4 text-zinc-500 hover:text-zinc-100 transition-colors" />
                        </Link>
                    )}
                    {personal.email && (
                        <Link href={`mailto:${personal.email}`}>
                            <Mail className="w-4 h-4 text-zinc-500 hover:text-zinc-100 transition-colors" />
                        </Link>
                    )}
                </div>

                <div className="text-[10px] text-zinc-600 uppercase tracking-widest font-medium">
                    © {new Date().getFullYear()}
                </div>
            </div>
        </aside>
    );
}
