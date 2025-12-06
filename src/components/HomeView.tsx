"use client";

import Link from "next/link";
import { useLanguage } from "@/lib/i18n";

export default function HomeView({ isLoggedIn }: { isLoggedIn: boolean }) {
    const { dictionary } = useLanguage();

    return (
        <main className="flex min-h-screen flex-col items-center justify-center gap-8 p-24 bg-gray-900 text-white">
            <h1 className="text-5xl font-bold tracking-tight text-center">{dictionary.home.title}</h1>
            <p className="text-xl text-gray-400 text-center">{dictionary.home.subtitle}</p>

            <div className="flex gap-4">
                {isLoggedIn ? (
                    <Link
                        href="/groups"
                        className="rounded-md bg-indigo-600 px-6 py-3 font-semibold text-white hover:bg-indigo-500"
                    >
                        {dictionary.home.goToGroups}
                    </Link>
                ) : (
                    <>
                        <Link
                            href="/login"
                            className="rounded-md bg-indigo-600 px-6 py-3 font-semibold text-white hover:bg-indigo-500"
                        >
                            {dictionary.home.signIn}
                        </Link>
                        <Link
                            href="/register"
                            className="rounded-md border border-gray-600 bg-gray-800 px-6 py-3 font-semibold text-white hover:bg-gray-700"
                        >
                            {dictionary.home.createAccount}
                        </Link>
                    </>
                )}
            </div>
        </main>
    );
}
