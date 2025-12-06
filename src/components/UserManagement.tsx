"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

type User = {
    id: string;
    name: string | null;
    email: string;
    role: string;
};

import { useLanguage } from "@/lib/i18n";
import { validatePassword } from "@/lib/password";

import { useSession } from "next-auth/react";

export default function UserManagement({ initialUsers }: { initialUsers: User[] }) {
    const router = useRouter();
    const { data: session } = useSession();
    const { dictionary } = useLanguage();
    const [users, setUsers] = useState<User[]>(initialUsers);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingUser, setEditingUser] = useState<User | null>(null);
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
        role: "USER",
    });

    const resetForm = () => {
        setFormData({ name: "", email: "", password: "", role: "USER" });
        setEditingUser(null);
    };

    const handleOpenCreate = () => {
        resetForm();
        setIsModalOpen(true);
    };

    const handleOpenEdit = (user: User) => {
        setEditingUser(user);
        setFormData({
            name: user.name || "",
            email: user.email,
            password: "", // Password not required for edit
            role: user.role,
        });
        setIsModalOpen(true);
    };

    const handleDelete = async (id: string) => {
        if (!confirm(dictionary.common.error)) return; // Using error as placeholder

        try {
            const res = await fetch(`/api/admin/users/${id}`, {
                method: "DELETE",
            });

            if (res.ok) {
                setUsers(users.filter((u) => u.id !== id));
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
            if (editingUser) {
                // Update
                const res = await fetch(`/api/admin/users/${editingUser.id}`, {
                    method: "PUT",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        name: formData.name,
                        role: formData.role,
                    }),
                });

                if (res.ok) {
                    const updatedUser = await res.json();
                    setUsers(users.map((u) => (u.id === editingUser.id ? updatedUser.user : u)));
                    setIsModalOpen(false);
                    router.refresh();
                } else {
                    const error = await res.json();
                    alert(error.message || dictionary.common.error);
                }


                // ...

            } else {
                // Create
                const passwordError = validatePassword(formData.password);
                if (passwordError) {
                    alert(dictionary.auth.passwordRequirements);
                    return;
                }

                const res = await fetch("/api/admin/users", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(formData),
                });

                if (res.ok) {
                    const newUser = await res.json();
                    setUsers([...users, newUser.user]);
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

    return (
        <div className="rounded-lg bg-gray-800 p-6 shadow">
            <div className="mb-4 flex items-center justify-between">
                <h2 className="text-xl font-semibold text-white">{dictionary.admin.users}</h2>
                <button
                    onClick={handleOpenCreate}
                    className="rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-indigo-700"
                >
                    {dictionary.admin.addUser}
                </button>
            </div>

            <ul className="space-y-2">
                {users.map((user) => {
                    const isTargetSuperAdmin = user.role === "SUPERADMIN";
                    const canEdit = session?.user?.role === "SUPERADMIN" || !isTargetSuperAdmin;

                    return (
                        <li
                            key={user.id}
                            className="flex items-center justify-between border-b border-gray-700 pb-2 last:border-0"
                        >
                            <div>
                                <div className="font-medium text-white">{user.name}</div>
                                <div className="text-sm text-gray-400">{user.email}</div>
                                <div className="text-xs text-gray-500">{dictionary.admin.role}: {user.role}</div>
                            </div>
                            <div className="flex gap-2">
                                {canEdit && (
                                    <>
                                        <button
                                            onClick={() => handleOpenEdit(user)}
                                            className="text-sm text-indigo-400 hover:text-indigo-300"
                                        >
                                            {dictionary.common.edit}
                                        </button>
                                        <button
                                            onClick={() => handleDelete(user.id)}
                                            className="text-sm text-red-400 hover:text-red-300"
                                        >
                                            {dictionary.common.delete}
                                        </button>
                                    </>
                                )}
                            </div>
                        </li>
                    );
                })}
            </ul>

            {isModalOpen && (
                <div className="fixed inset-0 flex items-center justify-center bg-black/50 p-4">
                    <div className="w-full max-w-md rounded-lg bg-gray-800 p-6 shadow-lg">
                        <h3 className="mb-4 text-xl font-bold text-white">
                            {editingUser ? dictionary.admin.editUser : dictionary.admin.createUser}
                        </h3>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-300">
                                    {dictionary.auth.name}
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
                                    {dictionary.auth.email}
                                </label>
                                <input
                                    type="email"
                                    required
                                    disabled={!!editingUser}
                                    value={formData.email}
                                    onChange={(e) =>
                                        setFormData({ ...formData, email: e.target.value })
                                    }
                                    className="mt-1 block w-full rounded-md border border-gray-600 bg-gray-700 px-3 py-2 text-white disabled:opacity-50 focus:border-indigo-500 focus:outline-none"
                                />
                            </div>
                            {!editingUser && (
                                <div>
                                    <label className="block text-sm font-medium text-gray-300">
                                        {dictionary.auth.password}
                                    </label>
                                    <input
                                        type="password"
                                        required
                                        value={formData.password}
                                        onChange={(e) =>
                                            setFormData({ ...formData, password: e.target.value })
                                        }
                                        className="mt-1 block w-full rounded-md border border-gray-600 bg-gray-700 px-3 py-2 text-white focus:border-indigo-500 focus:outline-none"
                                    />
                                </div>
                            )}
                            <div>
                                <label className="block text-sm font-medium text-gray-300">
                                    {dictionary.admin.role}
                                </label>
                                <select
                                    value={formData.role}
                                    onChange={(e) =>
                                        setFormData({ ...formData, role: e.target.value })
                                    }
                                    className="mt-1 block w-full rounded-md border border-gray-600 bg-gray-700 px-3 py-2 text-white focus:border-indigo-500 focus:outline-none"
                                >
                                    <option value="USER">User</option>
                                    <option value="ADMIN">Admin</option>
                                </select>
                            </div>
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
