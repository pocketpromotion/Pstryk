"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useLanguage } from "@/lib/i18n";
import { validatePassword } from "@/lib/password";

type User = {
    id: string;
    name: string | null;
    email: string;
};

export default function ProfileForm({ user }: { user: User }) {
    const router = useRouter();
    const { dictionary } = useLanguage();
    const [name, setName] = useState(user.name || "");
    const [currentPassword, setCurrentPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmNewPassword, setConfirmNewPassword] = useState("");
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);



    // ...

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setMessage("");
        setError("");

        if (newPassword) {
            const passwordError = validatePassword(newPassword);
            if (passwordError) {
                setError(dictionary.auth.passwordRequirements);
                setLoading(false);
                return;
            }
        }

        if (newPassword && newPassword !== confirmNewPassword) {
            setError(dictionary.profile.passwordMismatch);
            setLoading(false);
            return;
        }

        try {
            const res = await fetch("/api/profile", {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    name,
                    currentPassword: newPassword ? currentPassword : undefined,
                    newPassword: newPassword || undefined,
                }),
            });

            if (res.ok) {
                setMessage(dictionary.profile.success);
                setCurrentPassword("");
                setNewPassword("");
                setConfirmNewPassword("");
                router.refresh();
            } else {
                const data = await res.json();
                if (data.message === "Incorrect current password") {
                    setError(dictionary.profile.wrongPassword);
                } else {
                    setError(data.message || dictionary.common.error);
                }
            }
        } catch (err) {
            setError(dictionary.common.error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="w-full max-w-md rounded-lg bg-gray-800 p-8 shadow-md">
            <h1 className="mb-6 text-2xl font-bold text-white">{dictionary.profile.title}</h1>

            {message && (
                <div className="mb-4 rounded bg-green-900/50 p-3 text-sm text-green-200">
                    {message}
                </div>
            )}
            {error && (
                <div className="mb-4 rounded bg-red-900/50 p-3 text-sm text-red-200">
                    {error}
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-gray-300">
                        {dictionary.auth.email}
                    </label>
                    <input
                        type="email"
                        value={user.email}
                        disabled
                        className="mt-1 block w-full rounded-md border border-gray-600 bg-gray-700 px-3 py-2 text-gray-400 focus:outline-none"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-300">
                        {dictionary.auth.name}
                    </label>
                    <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="mt-1 block w-full rounded-md border border-gray-600 bg-gray-700 px-3 py-2 text-white focus:border-indigo-500 focus:outline-none"
                    />
                </div>

                <div className="border-t border-gray-700 pt-4 mt-4">
                    <h2 className="mb-4 text-lg font-medium text-white">Change Password</h2>
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-300">
                                {dictionary.profile.currentPassword}
                            </label>
                            <input
                                type="password"
                                value={currentPassword}
                                onChange={(e) => setCurrentPassword(e.target.value)}
                                className="mt-1 block w-full rounded-md border border-gray-600 bg-gray-700 px-3 py-2 text-white focus:border-indigo-500 focus:outline-none"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-300">
                                {dictionary.profile.newPassword}
                            </label>
                            <input
                                type="password"
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                                className="mt-1 block w-full rounded-md border border-gray-600 bg-gray-700 px-3 py-2 text-white focus:border-indigo-500 focus:outline-none"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-300">
                                {dictionary.profile.confirmNewPassword}
                            </label>
                            <input
                                type="password"
                                value={confirmNewPassword}
                                onChange={(e) => setConfirmNewPassword(e.target.value)}
                                className="mt-1 block w-full rounded-md border border-gray-600 bg-gray-700 px-3 py-2 text-white focus:border-indigo-500 focus:outline-none"
                            />
                        </div>
                    </div>
                </div>

                <button
                    type="submit"
                    disabled={loading}
                    className="w-full rounded-md bg-indigo-600 px-4 py-2 text-white hover:bg-indigo-700 disabled:opacity-50 mt-6"
                >
                    {loading ? dictionary.common.loading : dictionary.profile.updateProfile}
                </button>
            </form>
        </div>
    );
}
