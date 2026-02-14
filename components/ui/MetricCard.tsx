import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface MetricCardProps {
    label: string;
    value: string | number;
    unit: string;
    icon: LucideIcon;
    trend?: "up" | "down" | "stable";
    status?: "normal" | "warning" | "critical";
}

export function MetricCard({ label, value, unit, icon: Icon, status = "normal" }: MetricCardProps) {
    const isCritical = status === "critical";
    const isWarning = status === "warning";

    return (
        <div
            className={cn(
                "relative flex flex-col justify-between border border-surgical-border bg-surgical-gray p-6 transition-all duration-300",
                isCritical && "border-neon-red bg-neon-red/5 shadow-[0_0_15px_rgba(239,68,68,0.1)]",
                isWarning && "border-neon-amber bg-neon-amber/5 shadow-[0_0_15px_rgba(245,158,11,0.1)]"
            )}
        >
            <div className="flex items-center justify-between">
                <span className="font-mono text-[10px] font-bold text-text-secondary uppercase tracking-[0.15em]">
                    {label}
                </span>
                <Icon
                    className={cn(
                        "h-5 w-5",
                        isCritical ? "text-neon-red drop-shadow-[0_0_8px_rgba(239,68,68,0.6)]" :
                            isWarning ? "text-neon-amber drop-shadow-[0_0_8px_rgba(245,158,11,0.6)]" :
                                "text-text-dim"
                    )}
                />
            </div>
            <div className="mt-6 flex items-baseline">
                <span
                    className={cn(
                        "font-sans text-4xl font-light tracking-tighter",
                        isCritical ? "text-neon-red" : isWarning ? "text-neon-amber" : "text-white"
                    )}
                >
                    {value}
                </span>
                <span className="ml-2 font-mono text-xs text-text-dim">{unit}</span>
            </div>

            {/* Decorative Corner Instructions */}
            <div className={cn("absolute top-0 right-0 h-2 w-2 border-t border-r",
                isCritical ? "border-neon-red" : isWarning ? "border-neon-amber" : "border-surgical-border")} />
            <div className={cn("absolute bottom-0 left-0 h-2 w-2 border-b border-l",
                isCritical ? "border-neon-red" : isWarning ? "border-neon-amber" : "border-surgical-border")} />
        </div>
    );
}
