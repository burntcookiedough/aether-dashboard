"use client";

import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip } from "recharts";
import { Activity, Download, Calendar, WifiOff } from "lucide-react";
import { useAetherSocket } from "@/hooks/useAetherSocket";

function ChartCard({ title, dataKey, color, data, unit }: { title: string, dataKey: string, color: string, data: any[], unit: string }) {
    return (
        <div className="border border-surgical-border bg-surgical-gray p-6 relative group">
            <div className="flex justify-between items-center mb-6">
                <h3 className="font-mono text-xs font-bold text-text-secondary uppercase tracking-widest">
                    {title} <span className="text-text-dim ml-2">({unit})</span>
                </h3>
                <div className="flex items-center space-x-2">
                    <span className="font-mono text-[10px] text-white">
                        {data.length > 0 ? data[data.length - 1][dataKey]?.toFixed(1) : "--"}
                    </span>
                    <div className="h-2 w-2 rounded-full" style={{ backgroundColor: color }}></div>
                </div>
            </div>

            <div className="h-[250px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={data}>
                        <defs>
                            <linearGradient id={`color${dataKey}`} x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor={color} stopOpacity={0.2} />
                                <stop offset="95%" stopColor={color} stopOpacity={0} />
                            </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#27272a" />
                        <XAxis
                            dataKey="timestamp"
                            tick={{ fontSize: 10, fontFamily: 'var(--font-space-mono)', fill: '#52525b' }} // Show timestamp on X
                            axisLine={false}
                            tickLine={false}
                            minTickGap={30}
                            interval="preserveStartEnd"
                        />
                        <YAxis
                            tick={{ fontSize: 10, fontFamily: 'var(--font-space-mono)', fill: '#52525b' }}
                            axisLine={false}
                            tickLine={false}
                            width={30}
                        />
                        <Tooltip
                            contentStyle={{
                                backgroundColor: '#09090b',
                                border: '1px solid #27272a',
                                borderRadius: '0px',
                                padding: '8px 12px'
                            }}
                            itemStyle={{ fontFamily: 'var(--font-space-mono)', fontSize: '10px', color: '#fff' }}
                            labelStyle={{ fontFamily: 'var(--font-space-mono)', fontSize: '10px', color: '#a1a1aa', marginBottom: '4px' }}
                        />
                        <Area
                            type="monotone"
                            dataKey={dataKey}
                            stroke={color}
                            strokeWidth={2}
                            fillOpacity={1}
                            fill={`url(#color${dataKey})`}
                            isAnimationActive={false} // Disable animation for smoother streaming
                        />
                    </AreaChart>
                </ResponsiveContainer>
            </div>

            {/* Corners */}
            <div className="absolute top-0 right-0 h-2 w-2 border-t border-r border-surgical-border opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="absolute bottom-0 left-0 h-2 w-2 border-b border-l border-surgical-border opacity-0 group-hover:opacity-100 transition-opacity" />
        </div>
    );
}

export default function AnalyticsPage() {
    const { history, isConnected } = useAetherSocket();

    // Use history or fallback empty array to prevent crash
    const chartData = history.length > 0 ? history : [];

    return (
        <div className="p-8 space-y-8 bg-surgical-black min-h-full">
            <div className="flex items-center justify-between border-b border-surgical-border pb-6">
                <div>
                    <h1 className="font-sans text-3xl font-light text-white tracking-tight">
                        Real-time Telemetry
                    </h1>
                    <p className="mt-1 font-mono text-xs text-text-dim uppercase tracking-wider flex items-center">
                        Live Stream // {isConnected ? <span className="text-neon-green ml-1">Connected</span> : <span className="text-neon-red ml-1">Offline</span>}
                    </p>
                </div>

                <div className="flex space-x-3">
                    <button className="flex items-center space-x-2 px-4 py-2 border border-surgical-border bg-surgical-gray hover:bg-white/5 transition-colors">
                        <Download className="h-4 w-4 text-neon-blue" />
                        <span className="font-mono text-xs text-neon-blue">EXPORT LOGS</span>
                    </button>
                </div>
            </div>

            {!isConnected && history.length === 0 && (
                <div className="flex flex-col items-center justify-center p-12 border border-surgical-border border-dashed text-text-dim">
                    <WifiOff className="h-8 w-8 mb-4 opacity-50" />
                    <p className="font-mono text-sm">Waiting for Data Stream...</p>
                </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {/* Air Quality Section */}
                <ChartCard title="Smoke & LPG (MQ-2)" dataKey="mq2" color="#ef4444" data={chartData} unit="PPM" />
                <ChartCard title="Carbon Monoxide (MQ-7)" dataKey="mq7" color="#f59e0b" data={chartData} unit="PPM" />

                {/* Particulate Section */}
                <ChartCard title="Particulate Matter (IR)" dataKey="dust" color="#8b5cf6" data={chartData} unit="V/Units" />

                {/* Environment Section */}
                <ChartCard title="Ambient Temperature" dataKey="temp" color="#3b82f6" data={chartData} unit="°C" />
                <ChartCard title="Relative Humidity" dataKey="hum" color="#10b981" data={chartData} unit="%" />
            </div>
        </div>
    );
}
