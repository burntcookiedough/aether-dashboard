"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Activity, ShieldAlert, Settings, Cpu, Box, Server } from "lucide-react";
import { cn } from "@/lib/utils";

const navigation = [
    { name: "Live Monitor", href: "/", icon: LayoutDashboard },
    { name: "Digital Twin", href: "/twin", icon: Box },
    { name: "System Status", href: "/system", icon: Server },
    { name: "Analytics", href: "/analytics", icon: Activity },
    { name: "Privacy Ledger", href: "/privacy", icon: ShieldAlert },
    { name: "Configuration", href: "/settings", icon: Settings },
];

export function Sidebar() {
    const pathname = usePathname();

    return (
        <div className="flex h-screen w-64 flex-col border-r border-surgical-border bg-surgical-gray">
            <div className="flex h-16 items-center border-b border-surgical-border px-6">
                <Cpu className="mr-2 h-6 w-6 text-neon-blue" />
                <span className="font-sans text-lg font-bold tracking-tight text-white">
                    AETHER<span className="font-light text-neon-blue">IO</span>
                </span>
            </div>
            <nav className="flex-1 space-y-1 px-3 py-4">
                {navigation.map((item) => {
                    const isActive = pathname === item.href;
                    return (
                        <Link
                            key={item.name}
                            href={item.href}
                            className={cn(
                                "group flex items-center px-3 py-2 text-sm font-medium transition-all duration-200 border-l-2",
                                isActive
                                    ? "border-neon-blue bg-white/5 text-white"
                                    : "border-transparent text-text-secondary hover:bg-white/5 hover:text-white"
                            )}
                        >
                            <item.icon
                                className={cn(
                                    "mr-3 h-5 w-5 flex-shrink-0 transition-colors duration-200",
                                    isActive ? "text-neon-blue" : "text-text-dim group-hover:text-text-secondary"
                                )}
                            />
                            {item.name}
                            {isActive && (
                                <div className="ml-auto h-1.5 w-1.5 rounded-full bg-neon-blue animate-pulse shadow-[0_0_8px_rgba(59,130,246,0.6)]" />
                            )}
                        </Link>
                    );
                })}
            </nav>
            <div className="border-t border-surgical-border p-4 bg-black/20">
                <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center">
                        <div className="h-2 w-2 rounded-full bg-neon-green animate-pulse mr-2 shadow-[0_0_8px_rgba(34,197,94,0.6)]" />
                        <p className="text-[10px] font-mono text-text-dim leading-tight">
                            SYSTEM ONLINE
                            <br />
                            ID: <span className="text-white">NODE-01</span>
                        </p>
                    </div>
                </div>

                <Link
                    href="/login"
                    className="flex items-center justify-center w-full py-2 border border-surgical-border bg-surgical-gray hover:bg-neon-red/10 hover:border-neon-red/50 hover:text-neon-red text-text-secondary text-xs font-mono transition-all group"
                >
                    <span className="mr-2 group-hover:mr-3 transition-all">TERMINATE SESSION</span>
                </Link>
            </div>
        </div>
    );
}
