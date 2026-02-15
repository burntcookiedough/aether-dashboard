"use client";

import { useAetherSocket } from "@/hooks/useAetherSocket";
import { DigitalTwin } from "@/components/visual/DigitalTwin";
import { Copy, Terminal } from "lucide-react";

export default function TwinPage() {
    const { data } = useAetherSocket();
    const isHazard = data?.hazard || false;

    return (
        <div className="flex h-full flex-col p-6 space-y-6 bg-surgical-black text-text-primary">
            {/* Header */}
            <div className="flex items-center justify-between border-b border-surgical-border pb-6">
                <div>
                    <h1 className="font-sans text-2xl font-light tracking-tight text-white">
                        Digital Twin Interface
                    </h1>
                    <p className="mt-1 font-mono text-[10px] text-text-dim uppercase tracking-wider">
                        Real-time Spatial Synchronization // Latency: &lt;15ms
                    </p>
                </div>
                <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-2 bg-surgical-gray px-3 py-1 border border-surgical-border">
                        <Terminal className="h-4 w-4 text-neon-blue" />
                        <span className="font-mono text-xs text-neon-blue">Socket: CONNECTED</span>
                    </div>
                </div>
            </div>

            {/* Main Content - Full Screen Twin */}
            <div className="relative flex-1 min-h-0 border border-surgical-border bg-surgical-gray overflow-hidden">
                <DigitalTwin
                    isHazard={isHazard}
                    fullScreen={true}
                    mq2={data?.mq2}
                    mq7={data?.mq7}
                    dust={data?.dust}
                    temp={data?.temp}
                    hum={data?.hum}
                />

                {/* Overlay Data Panel */}
                <div className="absolute top-4 right-4 w-64 space-y-2">
                    <div className="bg-black/80 backdrop-blur border border-surgical-border p-4">
                        <h3 className="font-mono text-[10px] text-text-secondary uppercase mb-2">Object Detection</h3>
                        <div className="flex justify-between items-center mb-1">
                            <span className="font-sans text-sm text-white">{data?.object_name || "Scanning..."}</span>
                            <span className="font-mono text-xs text-neon-green">98.2%</span>
                        </div>
                        <div className="w-full bg-surgical-border h-1">
                            <div className="bg-neon-green h-1 w-[98%]" />
                        </div>
                    </div>

                    <div className="bg-black/80 backdrop-blur border border-surgical-border p-4">
                        <h3 className="font-mono text-[10px] text-text-secondary uppercase mb-2">Telemetry</h3>

                        <div className="space-y-2">
                            <div className="flex justify-between items-center">
                                <span className="font-mono text-xs text-text-dim">SMOKE</span>
                                <span className="font-mono text-xs text-white">{data?.mq2 || 0} PPM</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="font-mono text-xs text-text-dim">CO</span>
                                <span className="font-mono text-xs text-white">{data?.mq7 || 0} PPM</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="font-mono text-xs text-text-dim">DUST</span>
                                <span className="font-mono text-xs text-white">{data?.dust || 0}</span>
                            </div>
                            <div className="w-full bg-surgical-border h-[1px] my-2" />
                            <div className="flex justify-between items-center">
                                <span className="font-mono text-xs text-text-dim">TEMP</span>
                                <span className="font-mono text-xs text-white">{data?.temp || 0}°C</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="font-mono text-xs text-text-dim">HUM</span>
                                <span className="font-mono text-xs text-white">{data?.hum || 0}%</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
