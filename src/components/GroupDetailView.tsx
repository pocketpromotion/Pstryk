"use client";

import Link from "next/link";
import PhotoGrid from "@/components/PhotoGrid";
import { useLanguage } from "@/lib/i18n";
import { Session } from "next-auth";

interface GroupDetailViewProps {
    group: any; // Using any to avoid duplicating complex Prisma types for now, or import shared type
    session: Session;
}

export default function GroupDetailView({ group, session }: GroupDetailViewProps) {
    const { dictionary } = useLanguage();

    return (
        <div className="container mx-auto p-8">
            <div className="mb-8 flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-white">{group.name}</h1>
                    <p className="text-gray-400">
                        {group.users.length} {dictionary.groups.members} • {group.photos.length} {dictionary.groups.photosCount}
                    </p>
                </div>
                <div className="flex gap-4">
                    {(session.user.role === "ADMIN" || session.user.role === "SUPERADMIN") && (
                        <Link
                            href={`/groups/${group.id}/invite`}
                            className="rounded-md border border-indigo-500 px-4 py-2 text-indigo-400 hover:bg-indigo-900/20"
                        >
                            {dictionary.groups.invite}
                        </Link>
                    )}
                    <Link
                        href={`/groups/${group.id}/upload`}
                        className="rounded-md bg-indigo-600 px-4 py-2 text-white hover:bg-indigo-700"
                    >
                        {dictionary.groups.upload}
                    </Link>
                </div>
            </div>

            <PhotoGrid photos={group.photos} />
        </div>
    );
}
