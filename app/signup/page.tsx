"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ShieldPlus, ArrowRight, User, Mail, Lock, Key, AlertCircle } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

export default function SignupPage() {
    const router = useRouter();
    const { signup, error: authError } = useAuth();

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const [formData, setFormData] = useState({
        username: "",
        email: "",
        password: "",
        inviteCode: ""
    });

    const handleSignup = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            await signup(formData);
            router.push("/login?registered=true");
        } catch (err: any) {
            setError(err.message || "Registration Failed");
            setLoading(false);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    return (
        <div className="flex min-h-screen flex-col items-center justify-center bg-zinc-950 text-white relative overflow-hidden">

            {/* Background Decor */}
            <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 pointer-events-none"></div>
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-emerald-900 to-transparent opacity-50"></div>

            <div className="z-10 w-full max-w-[400px] p-8 border border-zinc-800 bg-zinc-900/50 backdrop-blur-xl relative">

                {/* Header */}
                <div className="mb-6 text-center">
                    <div className="inline-flex items-center justify-center w-12 h-12 mb-4 border border-zinc-700 bg-zinc-800/50">
                        <ShieldPlus className="h-5 w-5 text-gray-400" />
                    </div>
                    <h1 className="font-sans text-xl font-medium tracking-tight text-white mb-2">
                        New Identity Uplink
                    </h1>
                    <p className="font-mono text-[10px] text-zinc-500 uppercase tracking-widest">
                        Register Node Access // Secure Channel
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
                <form onSubmit={handleSignup} className="space-y-4">

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1">
                            <label className="text-[10px] font-mono text-zinc-500 uppercase tracking-wider ml-1">Username</label>
                            <div className="relative group">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <User className="h-4 w-4 text-zinc-600 group-focus-within:text-white transition-colors" />
                                </div>
                                <input
                                    type="text"
                                    name="username"
                                    value={formData.username}
                                    onChange={handleChange}
                                    required
                                    className="block w-full bg-zinc-950 border border-zinc-800 text-white font-mono text-xs py-3 pl-10 pr-3 focus:outline-none focus:border-white focus:ring-0 transition-all placeholder-zinc-700"
                                    placeholder="OPERATOR_ID"
                                />
                            </div>
                        </div>
                        <div className="space-y-1">
                            <label className="text-[10px] font-mono text-zinc-500 uppercase tracking-wider ml-1">Invite Code</label>
                            <div className="relative group">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <Key className="h-4 w-4 text-zinc-600 group-focus-within:text-white transition-colors" />
                                </div>
                                <input
                                    type="text"
                                    name="inviteCode"
                                    value={formData.inviteCode}
                                    onChange={handleChange}
                                    className="block w-full bg-zinc-950 border border-zinc-800 text-white font-mono text-xs py-3 pl-10 pr-3 focus:outline-none focus:border-white focus:ring-0 transition-all placeholder-zinc-700"
                                    placeholder="Optional"
                                />
                            </div>
                        </div>
                    </div>

                    <div className="space-y-1">
                        <label className="text-[10px] font-mono text-zinc-500 uppercase tracking-wider ml-1">Secure Email</label>
                        <div className="relative group">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <Mail className="h-4 w-4 text-zinc-600 group-focus-within:text-white transition-colors" />
                            </div>
                            <input
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                required
                                className="block w-full bg-zinc-950 border border-zinc-800 text-white font-mono text-xs py-3 pl-10 pr-3 focus:outline-none focus:border-white focus:ring-0 transition-all placeholder-zinc-700"
                                placeholder="identity@aether.net"
                            />
                        </div>
                    </div>

                    <div className="space-y-1">
                        <label className="text-[10px] font-mono text-zinc-500 uppercase tracking-wider ml-1">Passphrase</label>
                        <div className="relative group">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <Lock className="h-4 w-4 text-zinc-600 group-focus-within:text-white transition-colors" />
                            </div>
                            <input
                                type="password"
                                name="password"
                                value={formData.password}
                                onChange={handleChange}
                                required
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
                        <span>{loading ? "Verifying..." : "Initialize Registration"}</span>
                        {!loading && <ArrowRight className="h-3 w-3" />}
                    </button>
                </form>

                {/* Footer Links */}
                <div className="mt-6 text-center">
                    <Link href="/login" className="font-mono text-[10px] text-zinc-500 hover:text-white transition-colors uppercase tracking-wider border-b border-transparent hover:border-white pb-0.5">
                        Target: Login Interface
                    </Link>
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
