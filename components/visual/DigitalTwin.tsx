"use client";

import { Canvas } from "@react-three/fiber";
import { OrbitControls, Grid } from "@react-three/drei";
import * as THREE from 'three';

interface DigitalTwinProps {
    isHazard: boolean;
    gasLevel?: number;
    active?: boolean;
    fullScreen?: boolean;
}

function MachineModel({ isHazard }: { isHazard: boolean }) {
    return (
        <group position={[0, 0.5, 0]}>
            {/* Base Platform - Dark Grey Wireframe-ish */}
            <mesh position={[0, -0.25, 0]}>
                <boxGeometry args={[4, 0.5, 4]} />
                <meshStandardMaterial color="#18181b" />
                <lineSegments>
                    <edgesGeometry args={[new THREE.BoxGeometry(4, 0.5, 4)]} />
                    <lineBasicMaterial color="#27272a" />
                </lineSegments>
            </mesh>

            {/* Main Machine Body - Dark with Neon Edges */}
            <mesh position={[0, 1, 0]}>
                <boxGeometry args={[2, 2, 2]} />
                <meshStandardMaterial
                    color="#09090b"
                />
                <lineSegments>
                    <edgesGeometry args={[new THREE.BoxGeometry(2, 2, 2)]} />
                    <lineBasicMaterial color={isHazard ? "#ef4444" : "#3b82f6"} linewidth={2} />
                </lineSegments>
            </mesh>

            {/* Sensor Nodes (Visual Indicators) */}
            <mesh position={[1.2, 0.2, 1.2]}>
                <sphereGeometry args={[0.2]} />
                <meshStandardMaterial
                    emissive={isHazard ? "#ef4444" : "#22c55e"}
                    emissiveIntensity={isHazard ? 2 : 1}
                    color={isHazard ? "#ef4444" : "#22c55e"}
                />
            </mesh>
        </group>
    );
}

export function DigitalTwin({ isHazard, gasLevel = 0, active = true, fullScreen = false }: DigitalTwinProps) {
    return (
        <div className={`w-full overflow-hidden border border-surgical-border bg-surgical-black relative ${fullScreen ? "h-[85vh]" : "h-[400px]"}`}>
            <div className="absolute top-0 left-0 right-0 z-10 flex justify-between items-start p-4 pointer-events-none">
                <div className="bg-black/50 backdrop-blur-md border border-surgical-border px-3 py-1">
                    <span className="font-mono text-[10px] text-neon-blue uppercase tracking-widest">
                        LIVE RENDERING // {isHazard ? "HAZARD DETECTED" : "NOMINAL"}
                    </span>
                </div>
                <div className="bg-black/50 backdrop-blur-md border border-surgical-border px-3 py-1">
                    <span className="font-mono text-[10px] text-text-dim tracking-widest">
                        FOV: 45°
                    </span>
                </div>
            </div>

            <Canvas camera={{ position: [8, 6, 8], fov: 45 }}>
                <color attach="background" args={["#09090b"]} />
                <ambientLight intensity={0.2} />
                <directionalLight position={[10, 10, 5]} intensity={0.5} />
                <pointLight position={[-10, -10, -5]} intensity={0.5} color="#3b82f6" />

                <MachineModel isHazard={isHazard} />

                <Grid
                    position={[0, -0.01, 0]}
                    args={[20, 20]}
                    cellColor="#27272a"
                    sectionColor="#3f3f46"
                    fadeDistance={25}
                />

                <OrbitControls enableZoom={true} />
            </Canvas>

            {/* HUD Overlays */}
            <div className="absolute bottom-4 left-4 font-mono text-[10px] text-text-dim">
                COORD: 34.0522° N, 118.2437° W
            </div>
        </div>
    );
}
