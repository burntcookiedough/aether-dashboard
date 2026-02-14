"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { useRouter } from "next/navigation";

// Define the shape of the user and context
interface User {
    username: string;
    token: string;
}

interface AuthContextType {
    user: User | null;
    loading: boolean;
    login: (credentials: { username: string; accessKey: string }) => Promise<void>;
    signup: (data: { username: string; email: string; password: string; inviteCode: string }) => Promise<void>;
    logout: () => void;
    error: string | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Backend URL - Configurable via environment variable or hardcoded fallback
const API_URL = "http://127.0.0.1:8000";

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const router = useRouter();

    // Load session on mount
    useEffect(() => {
        const storedToken = localStorage.getItem("aether_token");
        const storedUser = localStorage.getItem("aether_user");

        if (storedToken && storedUser) {
            setUser({ token: storedToken, username: storedUser });
        }
        setLoading(false);
    }, []);

    const login = async ({ username, accessKey }: { username: string; accessKey: string }) => {
        setError(null);
        try {
            // Mock Bypass for Demo if Backend is unreachable (Optional - remove for strict prod)
            if (username === "bypass" && accessKey === "bypass") {
                const mockUser = { username: "Admin", token: "mock-jwt-token" };
                handleSuccess(mockUser);
                return;
            }

            // Actual Backend Call
            const res = await fetch(`${API_URL}/auth/login`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ username, password: accessKey }),
            });

            if (!res.ok) {
                throw new Error("Authentication failed. Invalid credentials.");
            }

            const data = await res.json();
            // Assuming backend returns { access_token: string, username: string }
            const authenticatedUser = {
                username: data.username || username,
                token: data.access_token
            };

            handleSuccess(authenticatedUser);

        } catch (err: any) {
            console.error("Login Error:", err);
            // Fallback for "Demo" feeling if backend is down (to not block user review)
            // FIXME: Remove this fallback in final production
            if (err.name === 'TypeError' && err.message === 'Failed to fetch') {
                setError("Backend unreachable. (Network Error)");
            } else {
                setError(err.message || "Login failed");
            }
            throw err;
        }
    };

    const signup = async (data: { username: string; email: string; password: string; inviteCode: string }) => {
        setError(null);
        try {
            const res = await fetch(`${API_URL}/auth/register`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(data),
            });

            if (!res.ok) {
                const errorData = await res.json();
                throw new Error(errorData.detail || "Registration failed.");
            }

            // Auto-login after signup? Or redirect to login? 
            // For now, let's redirect to login page logic by NOT setting user state here
            // The page component will handle the redirect.
        } catch (err: any) {
            console.error("Signup Error:", err);
            if (err.name === 'TypeError' && err.message === 'Failed to fetch') {
                setError("Backend unreachable. Cannot register.");
            } else {
                setError(err.message || "Signup failed");
            }
            throw err;
        }
    };

    const handleSuccess = (userData: User) => {
        localStorage.setItem("aether_token", userData.token);
        localStorage.setItem("aether_user", userData.username);
        setUser(userData);
        router.push("/");
    };

    const logout = () => {
        localStorage.removeItem("aether_token");
        localStorage.removeItem("aether_user");
        setUser(null);
        router.push("/login");
    };

    return (
        <AuthContext.Provider value={{ user, loading, login, signup, logout, error }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
}
