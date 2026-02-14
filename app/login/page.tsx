"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ShieldCheck, ArrowRight, User, Terminal, AlertCircle } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import Link from "next/link";

export default function LoginPage() {
    const { login, error: authError } = useAuth();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [formData, setFormData] = useState({
        username: "OP-742-ALPHA",
        accessKey: "password"
    });

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            await login(formData);
            // Redirect is handled in AuthContext
        } catch (err) {
            // Error is set in AuthContext usually, but we can set local state too if we want specific overrides
            setError("Authorization Failed");
            setLoading(false);
        }
    };

    return (
        <div className="flex min-h-screen flex-col items-center justify-center bg-zinc-950 text-white relative overflow-hidden">

            {/* Background Decor */}
            <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 pointer-events-none"></div>
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-cyan-900 to-transparent opacity-50"></div>

            <div className="z-10 w-full max-w-[360px] p-8 border border-zinc-800 bg-zinc-900/50 backdrop-blur-xl relative">

                {/* Header */}
                <div className="mb-10 text-center">
                    <div className="inline-flex items-center justify-center w-12 h-12 mb-4 border border-zinc-700 bg-zinc-800/50">
                        <ShieldCheck className="h-5 w-5 text-gray-400" />
                    </div>
                    <h1 className="font-sans text-xl font-medium tracking-tight text-white mb-2">
                        Restricted Access
                    </h1>
                    <p className="font-mono text-[10px] text-zinc-500 uppercase tracking-widest">
                        AetherIO Secure Gateway // Node-01
                    </p>
                </div>

                {/* Error Display */}
                {(error || authError) && (
                    <div className="mb-6 p-3 bg-red-500/10 border border-red-500/20 flex items-center space-x-2">
                        <AlertCircle className="h-4 w-4 text-red-500" />
                        <span className="text-[10px] font-mono text-red-500">{authError || error}</span>
                    </div>
                )}

                {/* Form */}
                <form onSubmit={handleLogin} className="space-y-5">
                    <div className="space-y-1">
                        <label className="text-[10px] font-mono text-zinc-500 uppercase tracking-wider ml-1">Identity Hash</label>
                        <div className="relative group">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <User className="h-4 w-4 text-zinc-600 group-focus-within:text-white transition-colors" />
                            </div>
                            <input
                                type="text"
                                value={formData.username}
                                onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                                className="block w-full bg-zinc-950 border border-zinc-800 text-white font-mono text-xs py-3 pl-10 pr-3 focus:outline-none focus:border-white focus:ring-0 transition-all placeholder-zinc-700"
                                placeholder="ID_HASH"
                            />
                        </div>
                    </div>

                    <div className="space-y-1">
                        <label className="text-[10px] font-mono text-zinc-500 uppercase tracking-wider ml-1">Access Key</label>
                        <div className="relative group">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <Terminal className="h-4 w-4 text-zinc-600 group-focus-within:text-white transition-colors" />
                            </div>
                            <input
                                type="password"
                                value={formData.accessKey}
                                onChange={(e) => setFormData({ ...formData, accessKey: e.target.value })}
                                className="block w-full bg-zinc-950 border border-zinc-800 text-white font-mono text-xs py-3 pl-10 pr-3 focus:outline-none focus:border-white focus:ring-0 transition-all placeholder-zinc-700"
                                placeholder="••••••••••••"
                            />
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full flex items-center justify-center space-x-2 bg-white text-black py-3 font-mono text-xs font-bold uppercase tracking-wider hover:bg-zinc-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-zinc-950 focus:ring-white transition-all disabled:opacity-50 disabled:cursor-not-allowed mt-4"
                    >
                        <span>{loading ? "Authenticating..." : "Initiate Uplink"}</span>
                        {!loading && <ArrowRight className="h-3 w-3" />}
                    </button>
                </form>

                {/* Footer Status */}
                <div className="mt-8 pt-6 border-t border-zinc-800/50 flex justify-between items-center">
                    <Link href="/signup" className="font-mono text-[9px] text-zinc-500 hover:text-white transition-colors uppercase border-b border-transparent hover:border-white pb-0.5">
                        Request Access
                    </Link>
                    <span className="font-mono text-[9px] text-zinc-600">v2.4.1-stable</span>
                </div>

                {/* Corners */}
                <div className="absolute top-0 left-0 w-2 h-2 border-l border-t border-zinc-600"></div>
                <div className="absolute top-0 right-0 w-2 h-2 border-r border-t border-zinc-600"></div>
                <div className="absolute bottom-0 left-0 w-2 h-2 border-l border-b border-zinc-600"></div>
                <div className="absolute bottom-0 right-0 w-2 h-2 border-r border-b border-zinc-600"></div>
            </div>
        </div>
    );
}
