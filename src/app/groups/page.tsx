"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/navigation";

interface Group {
    id: string;
    name: string;
    thumbnailUrl?: string | null;
    _count: {
        photos: number;
        users: number;
    };
}

import { useLanguage } from "@/lib/i18n";

export default function GroupsPage() {
    const { data: session } = useSession();
    const { dictionary } = useLanguage();
    const [groups, setGroups] = useState<Group[]>([]);
    const [newGroupName, setNewGroupName] = useState("");
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        fetchGroups();
    }, []);

    const fetchGroups = async () => {
        try {
            const res = await fetch("/api/groups");
            if (res.ok) {
                const data = await res.json();
                setGroups(data);
            }
        } catch (error) {
            console.error("Failed to fetch groups", error);
        } finally {
            setLoading(false);
        }
    };

    const createGroup = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newGroupName.trim()) return;

        try {
            const res = await fetch("/api/groups", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ name: newGroupName }),
            });

            if (res.ok) {
                setNewGroupName("");
                fetchGroups();
            }
        } catch (error) {
            console.error("Failed to create group", error);
        }
    };

    if (loading) return <div className="p-8 text-white">{dictionary.common.loading}</div>;

    return (
        <div className="container mx-auto p-8">
            <div className="mb-8 flex items-center justify-between">
                <h1 className="text-3xl font-bold text-white">{dictionary.groups.myGroups}</h1>
            </div>

            {(session?.user?.role === "ADMIN" || session?.user?.role === "SUPERADMIN") && (
                <div className="mb-8 rounded-lg bg-gray-800 p-6 shadow">
                    <h2 className="mb-4 text-xl font-semibold text-white">{dictionary.groups.createGroup}</h2>
                    <form onSubmit={createGroup} className="flex gap-4">
                        <input
                            type="text"
                            placeholder={dictionary.groups.groupName}
                            className="flex-1 rounded-md border border-gray-600 bg-gray-700 px-4 py-2 text-white placeholder-gray-400 focus:border-indigo-500 focus:outline-none"
                            value={newGroupName}
                            onChange={(e) => setNewGroupName(e.target.value)}
                        />
                        <button
                            type="submit"
                            className="rounded-md bg-indigo-600 px-6 py-2 text-white hover:bg-indigo-700"
                        >
                            {dictionary.groups.create}
                        </button>
                    </form>
                </div>
            )}

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {groups.map((group) => (
                    <Link
                        key={group.id}
                        href={`/groups/${group.id}`}
                        className="block rounded-lg bg-gray-800 p-6 shadow transition hover:bg-gray-750 hover:shadow-md"
                    >
                        {group.thumbnailUrl ? (
                            <div className="relative mb-2 h-32 w-full overflow-hidden rounded-md">
                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                <img
                                    src={group.thumbnailUrl}
                                    alt={group.name}
                                    className="h-full w-full object-cover"
                                />
                            </div>
                        ) : (
                            <div className="mb-2 h-32 w-full rounded-md bg-gray-700"></div>
                        )}
                        <h3 className="mb-2 text-xl font-bold text-white">
                            {group.name}
                        </h3>
                        <div className="flex justify-between text-sm text-gray-400">
                            <span>{group._count.photos} {dictionary.groups.photosCount}</span>
                            <span>{group._count.users} {dictionary.groups.members}</span>
                        </div>
                    </Link>
                ))}
            </div>

            {groups.length === 0 && (
                <p className="text-center text-gray-500">
                    {dictionary.groups.noPhotos}
                </p>
            )}
        </div>
    );
}
