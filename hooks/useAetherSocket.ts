import { useState, useEffect, useRef } from 'react';

export type Detection = {
    class_id: number;
    name: string;
    confidence: number;
    hazard: boolean;
};

export type AetherData = {
    gas: number;
    temp: number;
    hum: number;
    dust: number;
    hazard: boolean;
    image: string; // Base64 image
    object_name: string;
    timestamp?: string; // Optional timestamp for history

    // Risk Assessment
    risk_score: number;       // 0-100 composite score
    risk_level: string;       // "LOW" | "MODERATE" | "HIGH" | "CRITICAL"
    detections: Detection[];  // YOLO detection results

    // System Telemetry (Optional/Mocked if missing)
    system_cpu?: number;
    system_ram_used?: number;
    system_ram_total?: number;
    system_temp?: number;
};

export function useAetherSocket() {
    const [data, setData] = useState<AetherData | null>(null);
    const [history, setHistory] = useState<AetherData[]>([]);
    const [isConnected, setIsConnected] = useState(false);
    const ws = useRef<WebSocket | null>(null);

    useEffect(() => {
        // Connect to the Backend (Running on Laptop now)
        const socketUrl = "ws://127.0.0.1:8000/ws";

        function connect() {
            if (ws.current?.readyState === WebSocket.OPEN) return;

            ws.current = new WebSocket(socketUrl);

            ws.current.onopen = () => {
                console.log("[AETHER-WS] Connected to Brain");
                setIsConnected(true);
            };

            ws.current.onmessage = (event) => {
                try {
                    const parsedData = JSON.parse(event.data);

                    // COMPATIBILITY FIX: Map 'voc' from Old Pi Code to 'gas' for New Dashboard
                    if (parsedData.voc !== undefined && parsedData.gas === undefined) {
                        parsedData.gas = parsedData.voc;
                    }

                    // Add timestamp if missing
                    const timestampedData = {
                        ...parsedData,
                        timestamp: new Date().toLocaleTimeString('en-US', { hour12: false })
                    };

                    setData(timestampedData);

                    // Update History (Keep last 50 points)
                    setHistory(prev => {
                        const newHistory = [...prev, timestampedData];
                        if (newHistory.length > 50) newHistory.shift();
                        return newHistory;
                    });

                } catch (err) {
                    console.error("[AETHER-WS] Parse Error:", err);
                }
            };

            ws.current.onerror = (error) => {
                console.error("[AETHER-WS] Connection Error:", error);
                ws.current?.close();
            };

            ws.current.onclose = () => {
                console.log("[AETHER-WS] Disconnected. Retrying...");
                setIsConnected(false);
                ws.current = null;
                setTimeout(connect, 3000);
            };
        }

        connect();

        return () => {
            if (ws.current) ws.current.close();
        };
    }, []);

    return { data, history, isConnected };
}
