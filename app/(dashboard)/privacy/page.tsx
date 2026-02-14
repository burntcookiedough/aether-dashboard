"use client";

import { useAetherSocket, AetherData } from "@/hooks/useAetherSocket";
import { ShieldAlert, ShieldCheck, Clock, Terminal } from "lucide-react";
import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";

type LogEntry = {
    id: string;
    timestamp: string;
    node: string;
    action: string;
    hash: string;
    status: "verified" | "pending" | "hazard";
};

export default function PrivacyPage() {
    const { data } = useAetherSocket();
    const [logs, setLogs] = useState<LogEntry[]>([]);

    // Simulate initial logs or fetch from API
    useEffect(() => {
        const initialLogs: LogEntry[] = [
            { id: "LOG-8921", timestamp: "09:41:22", node: "NODE-01", action: "SYSTEM_INIT", hash: "0x7f...9a21", status: "verified" },
            { id: "LOG-8922", timestamp: "09:41:25", node: "NODE-01", action: "SOCKET_OPEN", hash: "0x8a...b112", status: "verified" },
        ];
        setLogs(initialLogs);
    }, []);

    // Listen for new data packets and append interesting events
    useEffect(() => {
        if (!data) return;

        const newLog: LogEntry = {
            id: `LOG-${Math.floor(Math.random() * 9000) + 1000}`,
            timestamp: new Date().toLocaleTimeString('en-US', { hour12: false }),
            node: "NODE-01",
            action: data.hazard ? "HAZARD_DETECTED" : "TELEMETRY_SYNC",
            hash: `0x${Math.random().toString(16).substr(2, 8)}...`,
            status: data.hazard ? "hazard" : "verified"
        };

        setLogs(prev => [newLog, ...prev].slice(0, 50)); // Keep last 50
    }, [data]);

    return (
        <div className="p-8 space-y-8 bg-surgical-black min-h-full">
            <div className="flex items-center justify-between border-b border-surgical-border pb-6">
                <div>
                    <h1 className="font-sans text-3xl font-light text-white tracking-tight">
                        Privacy Ledger
                    </h1>
                    <p className="mt-1 font-mono text-xs text-text-dim uppercase tracking-wider">
                        Immutable Audit Trail // 30-Day Retention
                    </p>
                </div>
            </div>

            <div className="border border-surgical-border bg-surgical-gray overflow-hidden">
                <div className="grid grid-cols-12 gap-4 p-4 border-b border-surgical-border bg-black/20 text-[10px] font-mono text-text-dim uppercase tracking-widest">
                    <div className="col-span-2">Timestamp</div>
                    <div className="col-span-2">Log ID</div>
                    <div className="col-span-2">Node</div>
                    <div className="col-span-3">Action</div>
                    <div className="col-span-2">Hash</div>
                    <div className="col-span-1 text-right">Status</div>
                </div>

                <div className="max-h-[600px] overflow-y-auto">
                    {logs.map((log) => (
                        <div key={log.id} className="grid grid-cols-12 gap-4 p-4 border-b border-surgical-border/50 text-xs font-mono hover:bg-white/5 transition-colors items-center group">
                            <div className="col-span-2 text-text-dim flex items-center">
                                <Clock className="h-3 w-3 mr-2 opacity-50" />
                                {log.timestamp}
                            </div>
                            <div className="col-span-2 text-neon-blue">{log.id}</div>
                            <div className="col-span-2 text-white">{log.node}</div>
                            <div className={cn("col-span-3 font-bold", log.status === 'hazard' ? "text-neon-red" : "text-white")}>
                                {log.action}
                            </div>
                            <div className="col-span-2 text-text-dim font-mono text-[10px]">{log.hash}</div>
                            <div className="col-span-1 text-right flex justify-end">
                                {log.status === 'verified' && <ShieldCheck className="h-4 w-4 text-neon-green" />}
                                {log.status === 'hazard' && <ShieldAlert className="h-4 w-4 text-neon-red animate-pulse" />}
                                {log.status === 'pending' && <Terminal className="h-4 w-4 text-neon-amber" />}
                            </div>
                        </div>
                    ))}
                    {logs.length === 0 && (
                        <div className="p-8 text-center text-text-dim font-mono text-xs">
                            No active logs in current session...
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
