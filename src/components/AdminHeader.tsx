"use client";

import { useLanguage } from "@/lib/i18n";

export default function AdminHeader() {
    const { dictionary } = useLanguage();
    return <h1 className="mb-8 text-3xl font-bold text-white">{dictionary.admin.dashboard}</h1>;
}
