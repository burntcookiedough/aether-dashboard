"use client";

import { Save, RefreshCw, Power } from "lucide-react";

export default function SettingsPage() {
    return (
        <div className="p-8 space-y-8 bg-surgical-black min-h-full">
            <div className="flex items-center justify-between border-b border-surgical-border pb-6">
                <div>
                    <h1 className="font-sans text-3xl font-light text-white tracking-tight">
                        System Configuration
                    </h1>
                    <p className="mt-1 font-mono text-xs text-text-dim uppercase tracking-wider">
                        Node Settings // Firmware Management
                    </p>
                </div>
                <div className="flex space-x-3">
                    <button className="flex items-center space-x-2 px-4 py-2 bg-neon-blue/10 border border-neon-blue/30 text-neon-blue hover:bg-neon-blue/20 transition-colors">
                        <Save className="h-4 w-4" />
                        <span className="font-mono text-xs font-bold">SAVE_CHANGES</span>
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Network Config */}
                <div className="border border-surgical-border bg-surgical-gray p-6 space-y-6">
                    <h2 className="font-mono text-xs font-bold text-text-secondary uppercase tracking-widest border-b border-surgical-border pb-2">
                        Network Parameters
                    </h2>

                    <div className="space-y-4">
                        <div className="space-y-1">
                            <label className="text-[10px] font-mono text-text-dim uppercase">WebSocket Endpoint</label>
                            <input
                                type="text"
                                defaultValue="ws://127.0.0.1:8000/ws"
                                className="w-full bg-black border border-surgical-border text-white font-mono text-xs p-2 focus:border-neon-blue focus:outline-none"
                            />
                        </div>

                        <div className="space-y-1">
                            <label className="text-[10px] font-mono text-text-dim uppercase">Gateway IP</label>
                            <input
                                type="text"
                                defaultValue="192.168.137.1"
                                className="w-full bg-black border border-surgical-border text-white font-mono text-xs p-2 focus:border-neon-blue focus:outline-none"
                            />
                        </div>
                    </div>
                </div>

                {/* System Controls */}
                <div className="border border-surgical-border bg-surgical-gray p-6 space-y-6">
                    <h2 className="font-mono text-xs font-bold text-text-secondary uppercase tracking-widest border-b border-surgical-border pb-2">
                        Power Management
                    </h2>

                    <div className="space-y-4">
                        <div className="flex items-center justify-between p-3 border border-surgical-border bg-black/20">
                            <div>
                                <p className="font-sans text-sm text-white">System Reboot</p>
                                <p className="font-mono text-[10px] text-text-dim">Soft restart of all services</p>
                            </div>
                            <button className="p-2 border border-surgical-border hover:bg-white/5 text-text-secondary hover:text-white transition-colors">
                                <RefreshCw className="h-4 w-4" />
                            </button>
                        </div>

                        <div className="flex items-center justify-between p-3 border border-neon-red/30 bg-neon-red/5">
                            <div>
                                <p className="font-sans text-sm text-neon-red">Emergency Shutdown</p>
                                <p className="font-mono text-[10px] text-text-dim">Immediate halt of operations</p>
                            </div>
                            <button className="p-2 border border-neon-red/30 hover:bg-neon-red/20 text-neon-red transition-colors">
                                <Power className="h-4 w-4" />
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
