"use client";

import { signIn } from "next-auth/react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

import { useLanguage } from "@/lib/i18n";

export default function LoginPage() {
    const router = useRouter();
    const { dictionary } = useLanguage();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");

        const res = await signIn("credentials", {
            email,
            password,
            redirect: false,
        });

        if (res?.error) {
            setError(dictionary.auth.loginError);
        } else {
            router.push("/");
            router.refresh();
        }
    };

    return (
        <div className="flex min-h-screen items-center justify-center bg-gray-900">
            <div className="w-full max-w-md rounded-lg bg-gray-800 p-8 shadow-md">
                <h2 className="mb-6 text-center text-2xl font-bold text-white">
                    {dictionary.auth.loginTitle}
                </h2>
                {error && (
                    <div className="mb-4 rounded bg-red-900/50 p-3 text-sm text-red-200">
                        {error}
                    </div>
                )}
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label
                            htmlFor="email"
                            className="block text-sm font-medium text-gray-300"
                        >
                            {dictionary.auth.email}
                        </label>
                        <input
                            id="email"
                            type="email"
                            required
                            className="mt-1 block w-full rounded-md border border-gray-600 bg-gray-700 px-3 py-2 text-white placeholder-gray-400 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </div>
                    <div>
                        <label
                            htmlFor="password"
                            className="block text-sm font-medium text-gray-300"
                        >
                            {dictionary.auth.password}
                        </label>
                        <input
                            id="password"
                            type="password"
                            required
                            className="mt-1 block w-full rounded-md border border-gray-600 bg-gray-700 px-3 py-2 text-white placeholder-gray-400 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </div>
                    <button
                        type="submit"
                        className="w-full rounded-md bg-indigo-600 px-4 py-2 text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                    >
                        {dictionary.auth.signIn}
                    </button>
                </form>
                <div className="mt-4 text-center text-sm">
                    <p className="text-gray-400">
                        {dictionary.auth.noAccount}{" "}
                        <Link
                            href="/register"
                            className="font-medium text-indigo-400 hover:text-indigo-300"
                        >
                            {dictionary.auth.signUp}
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
}
