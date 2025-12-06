"use client";

import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { useLanguage } from "@/lib/i18n";
import LanguageSwitcher from "./LanguageSwitcher";

export default function Navbar() {
    const { data: session } = useSession();
    const { dictionary } = useLanguage();

    return (
        <nav className="bg-gray-800 border-b border-gray-700">
            <div className="container mx-auto px-4">
                <div className="flex h-16 items-center justify-between">
                    <div className="flex items-center">
                        <Link href="/" className="text-xl font-bold text-white hover:text-gray-300">
                            Pstryk
                        </Link>
                        <div className="ml-10 flex items-baseline space-x-4">
                            {session && (
                                <Link
                                    href="/groups"
                                    className="rounded-md px-3 py-2 text-sm font-medium text-gray-300 hover:bg-gray-700 hover:text-white"
                                >
                                    {dictionary.nav.groups}
                                </Link>
                            )}
                            {(session?.user?.role === "ADMIN" || session?.user?.role === "SUPERADMIN") && (
                                <Link
                                    href="/admin"
                                    className="rounded-md px-3 py-2 text-sm font-medium text-gray-300 hover:bg-gray-700 hover:text-white"
                                >
                                    {dictionary.nav.admin}
                                </Link>
                            )}
                        </div>
                    </div>
                    <div>
                        {session ? (
                            <div className="flex items-center gap-4">
                                <LanguageSwitcher />
                                <Link
                                    href="/profile"
                                    className="text-sm text-gray-400 hover:text-white"
                                >
                                    {session.user?.name || session.user?.email}
                                </Link>
                                <button
                                    onClick={() => signOut({ callbackUrl: "/" })}
                                    className="rounded-md bg-red-600 px-3 py-2 text-sm font-medium text-white hover:bg-red-700"
                                >
                                    {dictionary.nav.logout}
                                </button>
                            </div>
                        ) : (
                            <div className="flex items-center gap-4">
                                <LanguageSwitcher />
                                <Link
                                    href="/login"
                                    className="text-sm font-medium text-gray-300 hover:text-white"
                                >
                                    {dictionary.nav.login}
                                </Link>
                                <Link
                                    href="/register"
                                    className="rounded-md bg-indigo-600 px-3 py-2 text-sm font-medium text-white hover:bg-indigo-500"
                                >
                                    {dictionary.nav.register}
                                </Link>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    );
}
