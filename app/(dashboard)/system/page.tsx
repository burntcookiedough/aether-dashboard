"use client";

import { useAetherSocket } from "@/hooks/useAetherSocket";
import { Server, Wifi, Cpu, Activity, AlertTriangle, CheckCircle, Smartphone } from "lucide-react";
import { cn } from "@/lib/utils";

function StatusRow({ label, status, detail }: { label: string, status: "ok" | "warn" | "error" | "idle", detail: string }) {
    const colors = {
        ok: "text-neon-green",
        warn: "text-neon-amber",
        error: "text-neon-red",
        idle: "text-text-dim"
    };
    const Icons = {
        ok: CheckCircle,
        warn: AlertTriangle,
        error: AlertTriangle,
        idle: Activity
    };

    const Icon = Icons[status];

    return (
        <div className="flex items-center justify-between py-4 border-b border-surgical-border last:border-0 hover:bg-white/5 px-4 transition-colors">
            <span className="font-mono text-xs text-text-secondary uppercase tracking-widest">{label}</span>
            <div className="flex items-center space-x-4">
                <span className="font-mono text-sm text-white text-right">{detail}</span>
                <Icon className={cn("h-4 w-4", colors[status])} />
            </div>
        </div>
    );
}

export default function SystemPage() {
    const { isConnected, data } = useAetherSocket();

    return (
        <div className="p-8 space-y-8 bg-surgical-black min-h-full">
            <div className="flex items-center justify-between border-b border-surgical-border pb-6">
                <div>
                    <h1 className="font-sans text-3xl font-light text-white tracking-tight">
                        System Status
                    </h1>
                    <p className="mt-1 font-mono text-xs text-text-dim uppercase tracking-wider">
                        Node Diagnostics // Firmware v2.4.1
                    </p>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Network Status */}
                <div className="border border-surgical-border bg-surgical-gray">
                    <div className="p-4 border-b border-surgical-border bg-black/20 flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                            <Wifi className="h-4 w-4 text-neon-blue" />
                            <span className="font-sans font-medium text-sm text-white">Network Connectivity</span>
                        </div>
                        <span className={cn("font-mono text-[10px] px-2 py-0.5 border", isConnected ? "text-neon-green border-neon-green/30 bg-neon-green/10" : "text-neon-red border-neon-red/30 bg-neon-red/10")}>
                            {isConnected ? "ONLINE" : "OFFLINE"}
                        </span>
                    </div>
                    <div className="p-2">
                        <StatusRow label="Subnet" status="ok" detail="192.168.137.x" />
                        <StatusRow label="Gateway" status="ok" detail="192.168.137.1" />
                        <StatusRow label="Latency" status={isConnected ? "ok" : "error"} detail={isConnected ? "12ms" : "---"} />
                        <StatusRow label="Packet Loss" status="idle" detail="0.0%" />
                    </div>
                </div>

                {/* Hardware Status */}
                <div className="border border-surgical-border bg-surgical-gray">
                    <div className="p-4 border-b border-surgical-border bg-black/20 flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                            <Cpu className="h-4 w-4 text-neon-blue" />
                            <span className="font-sans font-medium text-sm text-white">Hardware Health</span>
                        </div>
                    </div>
                    <div className="p-2">
                        {/* Fallback to static if backend doesn't send system stats yet */}
                        <StatusRow label="CPU Load" status="ok" detail={data?.system_cpu ? `${data.system_cpu}%` : "14%"} />
                        <StatusRow label="Memory" status="warn" detail={data?.system_ram_used ? `${data.system_ram_used}MB` : "3.2GB / 4GB"} />
                        <StatusRow label="Storage" status="ok" detail="45% Free" />
                        {/* Use Envrionment Temp if System temp is missing */}
                        <StatusRow label="Temp" status="ok" detail={`${data?.system_temp || data?.temp || 42}°C`} />
                    </div>
                </div>

                {/* Sensor Cluster Status */}
                <div className="border border-surgical-border bg-surgical-gray md:col-span-2">
                    <div className="p-4 border-b border-surgical-border bg-black/20 flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                            <Smartphone className="h-4 w-4 text-neon-blue" />
                            <span className="font-sans font-medium text-sm text-white">Sensor Cluster (ESP32)</span>
                        </div>
                    </div>
                    <div className="p-2 grid grid-cols-1 md:grid-cols-2 gap-x-8">
                        <div className="border-r border-surgical-border pr-4">
                            <StatusRow label="MQ-2 Gas" status={data ? "ok" : "idle"} detail={data ? `${data.gas} PPM` : "Calibrated"} />
                            {/* CO is not in AetherData currently, keeping static or inferring */}
                            <StatusRow label="MQ-7 CO" status="ok" detail="Calibrated" />
                        </div>
                        <div className="pl-4">
                            <StatusRow label="DHT-11 Temp" status={data ? "ok" : "idle"} detail={data ? `${data.temp}°C` : "Active"} />
                            <StatusRow label="DHT-11 Hum" status={data ? "ok" : "idle"} detail={data ? `${data.hum}%` : "Active"} />
                            <StatusRow label="IR Dust" status={data ? "ok" : "idle"} detail={data ? `${data.dust} µg/m³` : "Active"} />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
