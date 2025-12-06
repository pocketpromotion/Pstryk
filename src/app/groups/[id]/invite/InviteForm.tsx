"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import { useLanguage } from "@/lib/i18n";

export default function InviteForm({ groupId }: { groupId: string }) {
    const router = useRouter();
    const { dictionary } = useLanguage();
    const [email, setEmail] = useState("");
    const [message, setMessage] = useState("");
    const [loading, setLoading] = useState(false);

    const handleInvite = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setMessage("");

        try {
            const res = await fetch("/api/invite", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, groupId }),
            });

            if (res.ok) {
                setMessage("Invitation sent successfully!"); // TODO: Add to dictionary if needed
                setEmail("");
            } else {
                setMessage(dictionary.common.error);
            }
        } catch (error) {
            setMessage(dictionary.common.error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <h1 className="mb-6 text-2xl font-bold text-white">{dictionary.groups.invite}</h1>
            {message && (
                <div className="mb-4 rounded bg-green-900/50 p-3 text-sm text-green-200">
                    {message}
                </div>
            )}

            <form onSubmit={handleInvite} className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-gray-300">
                        {dictionary.auth.email}
                    </label>
                    <input
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="mt-1 block w-full rounded-md border border-gray-600 bg-gray-700 px-3 py-2 text-white placeholder-gray-400 focus:border-indigo-500 focus:outline-none"
                    />
                </div>
                <button
                    type="submit"
                    disabled={loading}
                    className="w-full rounded-md bg-indigo-600 px-4 py-2 text-white hover:bg-indigo-700 disabled:opacity-50"
                >
                    {loading ? dictionary.common.loading : dictionary.groups.invite}
                </button>
                <button
                    type="button"
                    onClick={() => router.back()}
                    className="w-full text-sm text-gray-400 hover:text-gray-300"
                >
                    {dictionary.common.cancel}
                </button>
            </form>
        </>
    );
}
