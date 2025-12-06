"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

type User = {
    id: string;
    name: string | null;
    email: string;
};

type Group = {
    id: string;
    name: string;
    thumbnailUrl?: string | null;
    _count: {
        users: number;
        photos: number;
    };
    users?: User[];
};

import { useLanguage } from "@/lib/i18n";

export default function GroupManagement({
    initialGroups,
    allUsers
}: {
    initialGroups: Group[];
    allUsers: User[];
}) {
    const router = useRouter();
    const { dictionary } = useLanguage();
    const [groups, setGroups] = useState<Group[]>(initialGroups);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingGroup, setEditingGroup] = useState<Group | null>(null);
    const [formData, setFormData] = useState<{ name: string; thumbnailUrl?: string }>({
        name: "",
    });

    const resetForm = () => {
        setFormData({ name: "", thumbnailUrl: undefined });
        setEditingGroup(null);
    };

    const handleOpenCreate = () => {
        resetForm();
        setIsModalOpen(true);
    };

    const handleOpenEdit = (group: Group) => {
        setEditingGroup(group);
        setFormData({
            name: group.name,
            thumbnailUrl: group.thumbnailUrl || undefined,
        });
        setIsModalOpen(true);
    };

    const handleDelete = async (id: string) => {
        if (!confirm(dictionary.common.error)) return; // Using error as placeholder for "Are you sure?" or add new key

        try {
            const res = await fetch(`/api/admin/groups/${id}`, {
                method: "DELETE",
            });

            if (res.ok) {
                setGroups(groups.filter((g) => g.id !== id));
                router.refresh();
            } else {
                alert(dictionary.common.error);
            }
        } catch (error) {
            console.error(error);
            alert(dictionary.common.error);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            if (editingGroup) {
                // Update Name
                const res = await fetch(`/api/admin/groups/${editingGroup.id}`, {
                    method: "PUT",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        name: formData.name,
                        thumbnailUrl: formData.thumbnailUrl,
                    }),
                });

                if (res.ok) {
                    const updatedGroup = await res.json();
                    setGroups(groups.map((g) => (g.id === editingGroup.id ? updatedGroup.group : g)));
                    setIsModalOpen(false);
                    router.refresh();
                } else {
                    alert(dictionary.common.error);
                }
            } else {
                // Create
                const res = await fetch("/api/admin/groups", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(formData),
                });

                if (res.ok) {
                    const newGroup = await res.json();
                    setGroups([...groups, newGroup.group]);
                    setIsModalOpen(false);
                    router.refresh();
                } else {
                    const error = await res.json();
                    alert(error.message || dictionary.common.error);
                }
            }
        } catch (error) {
            console.error(error);
            alert(dictionary.common.error);
        }
    };

    const handleAddMember = async (groupId: string, userId: string) => {
        try {
            const res = await fetch(`/api/admin/groups/${groupId}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ addMemberId: userId }),
            });

            if (res.ok) {
                const updatedGroup = await res.json();
                setGroups(groups.map((g) => (g.id === groupId ? updatedGroup.group : g)));
                if (editingGroup?.id === groupId) {
                    setEditingGroup(updatedGroup.group);
                }
                router.refresh();
            }
        } catch (error) {
            console.error(error);
        }
    };

    const handleRemoveMember = async (groupId: string, userId: string) => {
        try {
            const res = await fetch(`/api/admin/groups/${groupId}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ removeMemberId: userId }),
            });

            if (res.ok) {
                const updatedGroup = await res.json();
                setGroups(groups.map((g) => (g.id === groupId ? updatedGroup.group : g)));
                if (editingGroup?.id === groupId) {
                    setEditingGroup(updatedGroup.group);
                }
                router.refresh();
            }
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <div className="rounded-lg bg-gray-800 p-6 shadow">
            <div className="mb-4 flex items-center justify-between">
                <h2 className="text-xl font-semibold text-white">{dictionary.admin.groups}</h2>
                <button
                    onClick={handleOpenCreate}
                    className="rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-indigo-700"
                >
                    {dictionary.groups.createGroup}
                </button>
            </div>

            <ul className="space-y-2">
                {groups.map((group) => (
                    <li
                        key={group.id}
                        className="flex items-center justify-between border-b border-gray-700 pb-2 last:border-0"
                    >
                        <div>
                            <div className="font-medium text-white">{group.name}</div>
                            <div className="text-sm text-gray-400">
                                {group._count.users} {dictionary.groups.members} • {group._count.photos} {dictionary.groups.photosCount}
                            </div>
                        </div>
                        <div className="flex gap-2">
                            <button
                                onClick={() => handleOpenEdit(group)}
                                className="text-sm text-indigo-400 hover:text-indigo-300"
                            >
                                {dictionary.common.edit}
                            </button>
                            <button
                                onClick={() => handleDelete(group.id)}
                                className="text-sm text-red-400 hover:text-red-300"
                            >
                                {dictionary.common.delete}
                            </button>
                        </div>
                    </li>
                ))}
            </ul>

            {isModalOpen && (
                <div className="fixed inset-0 flex items-center justify-center bg-black/50 p-4">
                    <div className="w-full max-w-2xl rounded-lg bg-gray-800 p-6 shadow-lg max-h-[90vh] overflow-y-auto">
                        <h3 className="mb-4 text-xl font-bold text-white">
                            {editingGroup ? dictionary.common.edit : dictionary.groups.createGroup}
                        </h3>
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-300">
                                    {dictionary.groups.groupName}
                                </label>
                                <input
                                    type="text"
                                    required
                                    value={formData.name}
                                    onChange={(e) =>
                                        setFormData({ ...formData, name: e.target.value })
                                    }
                                    className="mt-1 block w-full rounded-md border border-gray-600 bg-gray-700 px-3 py-2 text-white focus:border-indigo-500 focus:outline-none"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-300">
                                    {dictionary.groups.thumbnail}
                                </label>
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={async (e) => {
                                        const file = e.target.files?.[0];
                                        if (!file) return;

                                        const uploadFormData = new FormData();
                                        uploadFormData.append("file", file);

                                        try {
                                            const res = await fetch("/api/admin/upload", {
                                                method: "POST",
                                                body: uploadFormData,
                                            });

                                            if (res.ok) {
                                                const data = await res.json();
                                                setFormData({ ...formData, thumbnailUrl: data.url });
                                            } else {
                                                alert(dictionary.common.error);
                                            }
                                        } catch (error) {
                                            console.error(error);
                                            alert(dictionary.common.error);
                                        }
                                    }}
                                    className="mt-1 block w-full text-sm text-gray-300 file:mr-4 file:rounded-md file:border-0 file:bg-indigo-600 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-white hover:file:bg-indigo-700"
                                />
                                {formData.thumbnailUrl && (
                                    <div className="mt-2">
                                        <p className="text-xs text-green-400">Thumbnail uploaded!</p>
                                        {/* eslint-disable-next-line @next/next/no-img-element */}
                                        <img src={formData.thumbnailUrl} alt="Thumbnail preview" className="mt-1 h-20 w-20 rounded object-cover" />
                                    </div>
                                )}
                            </div>

                            {editingGroup && (
                                <div>
                                    {editingGroup.users && editingGroup.users.length > 0 && (
                                        <>
                                            <h4 className="mb-2 text-lg font-semibold text-white">{dictionary.groups.members}</h4>
                                            <div className="mb-4 max-h-40 overflow-y-auto rounded-md border border-gray-700 bg-gray-900 p-2">
                                                {editingGroup.users.map((user) => (
                                                    <div key={user.id} className="flex items-center justify-between py-1">
                                                        <span className="text-sm text-gray-300">{user.name || user.email}</span>
                                                        <button
                                                            type="button"
                                                            onClick={() => handleRemoveMember(editingGroup.id, user.id)}
                                                            className="text-xs text-red-400 hover:text-red-300"
                                                        >
                                                            {dictionary.common.delete}
                                                        </button>
                                                    </div>
                                                ))}
                                            </div>
                                        </>
                                    )}

                                    {allUsers.filter(u => !editingGroup.users?.some(gu => gu.id === u.id)).length > 0 && (
                                        <>
                                            <h4 className="mb-2 text-lg font-semibold text-white">{dictionary.admin.manageMembers}</h4>
                                            <div className="max-h-40 overflow-y-auto rounded-md border border-gray-700 bg-gray-900 p-2">
                                                {allUsers
                                                    .filter(u => !editingGroup.users?.some(gu => gu.id === u.id))
                                                    .map((user) => (
                                                        <div key={user.id} className="flex items-center justify-between py-1">
                                                            <span className="text-sm text-gray-300">{user.name || user.email}</span>
                                                            <button
                                                                type="button"
                                                                onClick={() => handleAddMember(editingGroup.id, user.id)}
                                                                className="text-xs text-green-400 hover:text-green-300"
                                                            >
                                                                {dictionary.common.create}
                                                            </button>
                                                        </div>
                                                    ))
                                                }
                                            </div>
                                        </>
                                    )}
                                </div>
                            )}

                            <div className="flex justify-end gap-2">
                                <button
                                    type="button"
                                    onClick={() => setIsModalOpen(false)}
                                    className="rounded-md px-4 py-2 text-sm text-gray-400 hover:text-white"
                                >
                                    {dictionary.common.cancel}
                                </button>
                                <button
                                    type="submit"
                                    className="rounded-md bg-indigo-600 px-4 py-2 text-sm text-white hover:bg-indigo-700"
                                >
                                    {dictionary.common.save}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
