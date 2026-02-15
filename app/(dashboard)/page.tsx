"use client";

import { useAetherSocket } from "@/hooks/useAetherSocket";
import { MetricCard } from "@/components/ui/MetricCard";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { DigitalTwin } from "@/components/visual/DigitalTwin";
import { ShieldCheck, Wind, Thermometer, Droplets, AlertTriangle, Scan, Camera } from "lucide-react";
import Link from "next/link";

// Mock Data for UI Testing (fallback)
const mockData: any = {
  gas: 45,
  mq2: 45,
  mq7: 12,
  temp: 24,
  hum: 58,
  dust: 12,
  hazard: false,
  image: null,
  object_name: "Safety_Goggles",
  system_cpu: 14,
  system_ram_used: 1024,
  system_temp: 42,
  risk_score: 15,
  risk_level: "LOW",
  detections: []
};

export default function Dashboard() {
  const { data: socketData, isConnected } = useAetherSocket();

  // Toggle this to test mock data vs real data
  const useMock = false;
  const data = useMock ? mockData : socketData;

  return (
    <div className="flex h-screen flex-col bg-surgical-black overflow-hidden relative">
      {/* Background Grid */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#18181b_1px,transparent_1px),linear-gradient(to_bottom,#18181b_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] pointer-events-none" />

      <header className="flex h-16 items-center justify-between border-b border-surgical-border bg-surgical-gray/50 px-8 z-10 backdrop-blur-sm">
        <div>
          <h1 className="font-sans text-2xl font-light tracking-tight text-white">
            Live Monitor
          </h1>
          <p className="font-mono text-[10px] text-text-dim uppercase tracking-wider">
            Sector 7-G // Industrial Compliance
          </p>
        </div>
        <div className="flex items-center space-x-6">
          <StatusBadge
            label="WebSocket"
            status={isConnected ? "connected" : "disconnected"}
            pulse={isConnected}
          />
          <StatusBadge
            label="AI Inference"
            status={data?.object_name ? "active" : "standby"}
            pulse={!!data?.object_name}
          />
          <StatusBadge
            label="System Health"
            status={data?.hazard ? "warning" : "nominal"}
          />
        </div>
      </header>

      <main className="flex-1 overflow-hidden p-6 z-10">
        <div className="grid h-full grid-cols-12 gap-6">

          {/* LEFT COLUMN: VISUALS */}
          <div className="col-span-8 flex flex-col gap-6">

            {/* CAMERA FEED - PRIMARY VISUAL */}
            <div className="relative flex-1 overflow-hidden border border-surgical-border bg-black group max-h-[60%]">
              {/* Header Overlay */}
              <div className="absolute top-0 left-0 right-0 p-3 bg-gradient-to-b from-black/80 to-transparent flex justify-between z-20">
                <div className="flex items-center space-x-2">
                  <Camera className="h-4 w-4 text-neon-blue" />
                  <span className="font-mono text-xs text-white">CAM-01 [LIVE]</span>
                </div>
                <span className="font-mono text-[10px] text-text-dim">1080p // 30fps</span>
              </div>

              {/* The Feed */}
              {data?.image ? (
                <img
                  src={`data:image/jpeg;base64,${data.image}`}
                  alt="Live Feed"
                  className="h-full w-full object-cover opacity-90"
                />
              ) : (
                <div className="flex h-full items-center justify-center bg-zinc-900">
                  <div className="text-center space-y-2">
                    <Scan className="h-8 w-8 text-text-dim mx-auto animate-pulse" />
                    <p className="font-mono text-xs text-text-secondary">ESTABLISHING UPLINK...</p>
                  </div>
                </div>
              )}

              {/* Detection Overlay */}
              {data?.object_name && (
                <div className="absolute bottom-4 left-4 bg-black/60 border-l-2 border-neon-blue px-4 py-2 backdrop-blur-md">
                  <p className="font-mono text-[10px] text-text-dim uppercase">Object Detected</p>
                  <p className="font-sans text-lg font-bold text-white">{data.object_name}</p>
                  <p className="font-mono text-[10px] text-neon-blue mt-1">CONFIDENCE: 98.4%</p>
                </div>
              )}

              {/* Scanlines */}
              <div className="absolute inset-0 bg-[linear-gradient(transparent_50%,rgba(0,0,0,0.5)_50%)] bg-[size:100%_4px] pointer-events-none opacity-20" />
            </div>

            {/* 3D TWIN PREVIEW or SECONDARY METRICS */}
            <div className="flex-1 border border-surgical-border bg-surgical-gray relative overflow-hidden group">
              <Link href="/twin" className="absolute top-4 right-4 z-20 px-3 py-1 bg-black/50 border border-surgical-border hover:border-neon-blue text-xs font-mono text-white transition-colors">
                ENLARGE VIEW
              </Link>

              <div className="h-full w-full opacity-60 group-hover:opacity-100 transition-opacity">
                <DigitalTwin
                  isHazard={data?.hazard || false}
                  mq2={data?.mq2 || 0}
                  dust={data?.dust || 0}
                  temp={data?.temp || 0}
                  active={isConnected}
                />
              </div>

              {/* Data Overlay */}
              <div className="absolute bottom-4 left-4 z-20">
                <h3 className="font-mono text-xs text-text-secondary uppercase">Holistic Status</h3>
                <p className="font-sans text-xl text-white">
                  {data?.hazard ? "CRITICAL ALERT" : "OPTIMAL OPERATION"}
                </p>
              </div>
            </div>

          </div>


          {/* RIGHT COLUMN: METRICS */}
          <div className="col-span-4 flex flex-col gap-4 overflow-y-auto pr-1">
            {/* WEIGHTED AVERAGE / RISK SCORE */}
            <MetricCard
              label="Safety Risk Score"
              value={data?.risk_score !== undefined ? `${data.risk_score}` : "--"}
              unit="%"
              icon={ShieldCheck}
              status={data && data.risk_score > 50 ? "critical" : (data && data.risk_score > 25 ? "warning" : "normal")}
              trend="stable"
            />

            {/* GAS SENSORS */}
            <div className="grid grid-cols-2 gap-4">
              <MetricCard
                label="Smoke/LPG"
                value={data?.mq2 ? `${data.mq2}` : "--"}
                unit="PPM"
                icon={Wind}
                status={data && data.mq2 > 200 ? "critical" : "normal"}
                trend="up"
              />
              <MetricCard
                label="CO Level"
                value={data?.mq7 ? `${data.mq7}` : "--"}
                unit="PPM"
                icon={AlertTriangle}
                status={data && data.mq7 > 100 ? "warning" : "normal"}
                trend="stable"
              />
            </div>

            <MetricCard
              label="Temperature"
              value={data?.temp ? `${data.temp}` : "--"}
              unit="°C"
              icon={Thermometer}
              status={data && data.temp > 35 ? "warning" : "normal"}
              trend="stable"
            />
            <MetricCard
              label="Humidity"
              value={data?.hum ? `${data.hum}` : "--"}
              unit="%"
              icon={Droplets}
              status="normal"
              trend="stable"
            />
            <MetricCard
              label="Particulate (IR)"
              value={data?.dust ? `${data.dust}` : "--"}
              unit="V/Units"
              icon={Scan}
              status={data && data.dust > 100 ? "critical" : "normal"}
              trend="up"
            />

            {/* Alert Box */}
            <div className="mt-auto border border-neon-red/30 bg-neon-red/5 p-4 relative overflow-hidden">
              <div className="absolute top-0 right-0 p-2">
                <div className="h-2 w-2 bg-neon-red rounded-full animate-pulse" />
              </div>
              <h3 className="font-mono text-xs font-bold text-neon-red uppercase tracking-widest mb-2">
                Hazard Log
              </h3>
              <div className="space-y-2">
                {data?.hazard ? (
                  <div className="flex items-start space-x-2 text-xs text-white">
                    <AlertTriangle className="h-4 w-4 text-neon-red shrink-0" />
                    <p>Automated safety protocols engaged. Ventilation systems active.</p>
                  </div>
                ) : (
                  <div className="flex items-center space-x-2 text-xs text-text-dim">
                    <ShieldCheck className="h-4 w-4" />
                    <p>No active hazards detected within last 15 minutes.</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
