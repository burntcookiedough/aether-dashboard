"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Grid, Sparkles, Float, Ring, Cylinder } from "@react-three/drei";
import { useRef, useMemo } from "react";
import * as THREE from 'three';

interface DigitalTwinProps {
    isHazard: boolean;
    mq2?: number;    // Smoke
    mq7?: number;    // CO
    dust?: number;   // Particles
    temp?: number;   // Temperature
    hum?: number;    // Humidity
    active?: boolean;
    fullScreen?: boolean;
    // Legacy support
    gasLevel?: number;
}

function SensorNode({ isHazard, temp, mq2, dust }: { isHazard: boolean, temp: number, mq2: number, dust: number }) {
    const groupRef = useRef<THREE.Group>(null);
    const ringRef = useRef<THREE.Mesh>(null);
    const coreRef = useRef<THREE.Mesh>(null);

    // Reactive Colors
    const coreColor = useMemo(() => {
        if (isHazard) return "#ef4444"; // Red for Hazard
        if (temp > 35) return "#f97316"; // Orange for Hot
        if (temp < 10) return "#3b82f6"; // Blue for Cold
        return "#22c55e"; // Green/Cyan for Nominal
    }, [isHazard, temp]);

    useFrame((state, delta) => {
        // Rotate Main Group slightly
        if (groupRef.current) {
            groupRef.current.rotation.y += delta * 0.2;
        }
        // Spin Scanning Ring
        if (ringRef.current) {
            ringRef.current.rotation.z -= delta * (isHazard ? 2 : 0.5);
            ringRef.current.rotation.x = Math.sin(state.clock.elapsedTime) * 0.2;
        }
        // Pulse Core
        if (coreRef.current) {
            const scale = 1 + Math.sin(state.clock.elapsedTime * (isHazard ? 8 : 2)) * 0.05;
            coreRef.current.scale.set(scale, scale, scale);
        }
    });

    return (
        <group ref={groupRef} position={[0, 1, 0]}>
            <Float speed={2} rotationIntensity={0.2} floatIntensity={0.5}>

                {/* 1. Main Chassis (Cylindrical Hub) */}
                <mesh position={[0, 0, 0]}>
                    <cylinderGeometry args={[1, 1, 2, 32]} />
                    <meshStandardMaterial
                        color="#18181b"
                        roughness={0.2}
                        metalness={0.8}
                        wireframe={false}
                    />
                </mesh>
                {/* Wireframe Overlay */}
                <mesh position={[0, 0, 0]} scale={[1.01, 1.01, 1.01]}>
                    <cylinderGeometry args={[1, 1, 2, 16]} />
                    <meshStandardMaterial color="#27272a" wireframe={true} transparent opacity={0.3} />
                </mesh>

                {/* 2. The Glowing Core (Reactor) */}
                <mesh ref={coreRef} position={[0, 0, 0]}>
                    <sphereGeometry args={[0.6, 32, 32]} />
                    <meshStandardMaterial
                        color={coreColor}
                        emissive={coreColor}
                        emissiveIntensity={2}
                        toneMapped={false}
                    />
                </mesh>

                {/* 3. Scanning Ring (The Radar) */}
                <mesh ref={ringRef} rotation={[Math.PI / 2, 0, 0]}>
                    <torusGeometry args={[1.6, 0.05, 16, 100]} />
                    <meshStandardMaterial
                        color={isHazard ? "#ef4444" : "#3b82f6"}
                        emissive={isHazard ? "#ef4444" : "#3b82f6"}
                        emissiveIntensity={1}
                    />
                </mesh>

                {/* 4. Base Connector */}
                <mesh position={[0, -1.2, 0]}>
                    <cylinderGeometry args={[0.4, 1.2, 0.5, 32]} />
                    <meshStandardMaterial color="#27272a" metalness={1} />
                </mesh>

            </Float>

            {/* 5. Volumetric Atmosphere (Dust/Smoke Particles) */}
            {/* Scale particle count/speed with sensor data */}
            <Sparkles
                count={50 + (dust * 2) + (mq2 / 2)}
                scale={6}
                size={isHazard ? 4 : 2}
                speed={0.4 + (mq2 / 100)}
                opacity={0.6}
                color={mq2 > 100 ? "#a3a3a3" : (dust > 50 ? "#eab308" : "#3b82f6")}
            />
        </group>
    );
}

export function DigitalTwin({
    isHazard,
    mq2 = 0,
    mq7 = 0,
    dust = 0,
    temp = 25,
    hum = 50,
    active = true,
    fullScreen = false,
    gasLevel = 0
}: DigitalTwinProps) {

    // Fallback if legacy props are used
    const effectiveMQ2 = mq2 || gasLevel || 0;

    return (
        <div className={`w-full overflow-hidden border border-surgical-border bg-surgical-black relative ${fullScreen ? "h-[85vh]" : "h-[400px]"}`}>
            {/* HUD Header */}
            <div className="absolute top-0 left-0 right-0 z-10 flex justify-between items-start p-4 pointer-events-none">
                <div className="bg-black/50 backdrop-blur-md border border-surgical-border px-3 py-1">
                    <span className={`font-mono text-[10px] uppercase tracking-widest ${isHazard ? "text-neon-red animate-pulse" : "text-neon-blue"}`}>
                        AETHER NODE // {isHazard ? "CRITICAL HAZARD" : "ONLINE"}
                    </span>
                </div>
                <div className="bg-black/50 backdrop-blur-md border border-surgical-border px-3 py-1">
                    <span className="font-mono text-[10px] text-text-dim tracking-widest">
                        ENV: {temp}°C / {hum}%
                    </span>
                </div>
            </div>

            <Canvas camera={{ position: [4, 2, 5], fov: 45 }}>
                <color attach="background" args={["#09090b"]} />

                {/* Cinematic Lighting */}
                <ambientLight intensity={0.1} />
                <pointLight position={[10, 10, 10]} intensity={0.5} color="#3b82f6" />
                <pointLight position={[-10, -5, -10]} intensity={0.5} color="#f97316" />

                {/* Dynamic Light based on Hazard */}
                {isHazard && (
                    <pointLight position={[0, 0, 0]} intensity={2} color="#ef4444" distance={5} decay={2} />
                )}

                <SensorNode
                    isHazard={isHazard}
                    temp={temp}
                    mq2={effectiveMQ2}
                    dust={dust}
                />

                <Grid
                    position={[0, -2, 0]}
                    args={[20, 20]}
                    cellColor="#27272a"
                    sectionColor="#3f3f46"
                    fadeDistance={20}
                />

                <OrbitControls enableZoom={true} autoRotate={!isHazard} autoRotateSpeed={0.5} />
            </Canvas>

            {/* Footer HUD */}
            <div className="absolute bottom-4 left-4 font-mono text-[10px] text-text-dim">
                PARTICLES: {dust} // SMOKE: {effectiveMQ2}
            </div>
        </div>
    );
}
