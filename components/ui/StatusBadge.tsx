"use client";

import { cn } from "@/lib/utils";

interface StatusBadgeProps {
    label: string;
    status: "connected" | "disconnected" | "active" | "standby" | "nominal" | "warning" | "critical";
    pulse?: boolean;
    className?: string;
}

export function StatusBadge({ label, status, pulse = false, className }: StatusBadgeProps) {
    const colorMap = {
        connected: "bg-neon-green",
        disconnected: "bg-zinc-500",
        active: "bg-neon-blue",
        standby: "bg-zinc-600",
        nominal: "bg-neon-green",
        warning: "bg-neon-amber",
        critical: "bg-neon-red"
    };

    const colorClass = colorMap[status] || "bg-zinc-500";

    return (
        <div className={cn("flex items-center space-x-2 border border-surgical-border px-3 py-1 bg-black/40", className)}>
            <div className="relative flex h-2 w-2">
                {pulse && (
                    <span
                        className={cn(
                            "absolute inline-flex h-full w-full animate-ping rounded-full opacity-75",
                            colorClass
                        )}
                    />
                )}
                <span className={cn("relative inline-flex h-2 w-2 rounded-full", colorClass)} />
            </div>
            <div className="flex flex-col leading-none">
                <span className="font-mono text-[9px] text-text-dim uppercase tracking-wider">{label}</span>
                <span className={cn("font-mono text-[10px] font-bold uppercase tracking-widest text-white")}>
                    {status}
                </span>
            </div>
        </div>
    );
}
