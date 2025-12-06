"use client";

import { useState } from "react";
import Image from "next/image";
import { useSession } from "next-auth/react";

interface Photo {
    id: string;
    url: string;
    title: string | null;
    description: string | null;
    createdAt: Date;
    userId: string;
    user: { name: string | null };
    tags: { id: string; name: string }[];
}

import { useRouter } from "next/navigation";

import { useLanguage } from "@/lib/i18n";

export default function PhotoGrid({ photos }: { photos: Photo[] }) {
    const { data: session } = useSession();
    const router = useRouter();
    const { dictionary } = useLanguage();
    const [selectedTag, setSelectedTag] = useState<string | null>(null);
    const [sortOrder, setSortOrder] = useState<"desc" | "asc">("desc");

    // Extract unique tags
    const allTags = Array.from(
        new Set(photos.flatMap((p) => p.tags.map((t) => t.name)))
    ).sort();

    const filteredPhotos = photos
        .filter((p) => {
            if (!selectedTag) return true;
            return p.tags.some((t) => t.name === selectedTag);
        })
        .sort((a, b) => {
            const dateA = new Date(a.createdAt).getTime();
            const dateB = new Date(b.createdAt).getTime();
            return sortOrder === "desc" ? dateB - dateA : dateA - dateB;
        });

    const [selectedPhoto, setSelectedPhoto] = useState<Photo | null>(null);
    const [isEditing, setIsEditing] = useState(false);
    const [hasEdited, setHasEdited] = useState(false);
    const [editDescription, setEditDescription] = useState("");
    const [editTitle, setEditTitle] = useState("");
    const [editTags, setEditTags] = useState("");

    const handleSave = async () => {
        if (!selectedPhoto) return;

        try {
            const res = await fetch(`/api/photos/${selectedPhoto.id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    description: editDescription,
                    title: editTitle,
                    tags: editTags
                }),
            });

            if (res.ok) {
                const updatedPhoto = await res.json();
                // Update local state
                const newPhotos = photos.map(p => p.id === updatedPhoto.id ? {
                    ...p,
                    description: updatedPhoto.description,
                    title: updatedPhoto.title,
                    tags: updatedPhoto.tags
                } : p);

                setSelectedPhoto({
                    ...selectedPhoto,
                    description: updatedPhoto.description,
                    title: updatedPhoto.title,
                    tags: updatedPhoto.tags
                });
                setIsEditing(false);
                setHasEdited(true);
                // In a real app, we might want to update the parent state or re-fetch
            } else {
                alert(dictionary.common.error);
            }
        } catch (error) {
            console.error(error);
            alert(dictionary.common.error);
        }
    };

    const startEditing = () => {
        if (!selectedPhoto) return;
        setEditTitle(selectedPhoto.title || "");
        setEditDescription(selectedPhoto.description || "");
        setEditTags(selectedPhoto.tags.map(t => t.name).join(", "));
        setIsEditing(true);
    };

    const closeLightbox = () => {
        setSelectedPhoto(null);
        setIsEditing(false);
        if (hasEdited) {
            router.refresh();
            setHasEdited(false);
        }
    };

    return (
        <div>
            <div className="mb-6 flex flex-wrap items-center gap-4">
                <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-gray-300">{dictionary.common.filterByTag}:</span>
                    <select
                        className="rounded-md border border-gray-600 bg-gray-700 px-3 py-1.5 text-sm text-white focus:border-indigo-500 focus:outline-none"
                        value={selectedTag || ""}
                        onChange={(e) => setSelectedTag(e.target.value || null)}
                    >
                        <option value="">{dictionary.common.allTags}</option>
                        {allTags.map((tag) => (
                            <option key={tag} value={tag}>
                                {tag}
                            </option>
                        ))}
                    </select>
                </div>

                <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-gray-300">{dictionary.common.sortByDate}:</span>
                    <select
                        className="rounded-md border border-gray-600 bg-gray-700 px-3 py-1.5 text-sm text-white focus:border-indigo-500 focus:outline-none"
                        value={sortOrder}
                        onChange={(e) => setSortOrder(e.target.value as "desc" | "asc")}
                    >
                        <option value="desc">{dictionary.common.newestFirst}</option>
                        <option value="asc">{dictionary.common.oldestFirst}</option>
                    </select>
                </div>
            </div>

            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                {filteredPhotos.map((photo) => (
                    <div
                        key={photo.id}
                        className="overflow-hidden rounded-lg bg-gray-800 shadow cursor-pointer transition hover:scale-105"
                        onClick={() => setSelectedPhoto(photo)}
                    >
                        <div className="relative aspect-square w-full">
                            <Image
                                src={photo.url}
                                alt={photo.title || dictionary.photos.untitled}
                                fill
                                className="object-cover"
                            />
                        </div>
                        <div className="p-4">
                            <h3 className="truncate font-medium text-white">
                                {photo.title || dictionary.photos.untitled}
                            </h3>
                            <div className="mt-1 flex flex-wrap items-center gap-4 text-xs text-gray-400">
                                <span className="flex items-center gap-1">
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="h-3 w-3">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
                                    </svg>
                                    {photo.user.name || dictionary.common.unknown}
                                </span>
                                <span className="flex items-center gap-1">
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="h-3 w-3">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" />
                                    </svg>
                                    {new Date(photo.createdAt).toLocaleDateString()}
                                </span>
                            </div>
                            <div className="mt-2 flex flex-wrap gap-1">
                                {photo.tags.map((tag) => (
                                    <button
                                        key={tag.id}
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            setSelectedTag(tag.name);
                                        }}
                                        className={`rounded-full px-2 py-0.5 text-xs ${selectedTag === tag.name
                                            ? "bg-indigo-900 text-indigo-200"
                                            : "bg-gray-700 text-gray-300 hover:bg-gray-600"
                                            }`}
                                    >
                                        #{tag.name}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {filteredPhotos.length === 0 && (
                <div className="py-12 text-center text-gray-500">
                    {dictionary.photos.noPhotos}
                </div>
            )}

            {selectedPhoto && (
                <div
                    className="fixed inset-0 z-50 overflow-y-auto bg-black/90 p-4"
                    onClick={closeLightbox}
                >
                    <div className="flex min-h-full items-center justify-center">
                        <div
                            className="relative w-full max-w-4xl rounded-lg bg-gray-900 shadow-2xl"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <button
                                onClick={closeLightbox}
                                className="absolute right-4 top-4 z-10 rounded-full bg-black/50 p-2 text-white hover:bg-black/70"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="h-6 w-6">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>

                            <div className="relative h-[50vh] md:h-[60vh] w-full bg-black">
                                <Image
                                    src={selectedPhoto.url}
                                    alt={selectedPhoto.title || dictionary.photos.untitled}
                                    fill
                                    className="object-contain"
                                    unoptimized
                                />
                            </div>

                            <div className="bg-gray-900 p-6">
                                <div className="flex flex-col gap-6">
                                    <div>
                                        {isEditing ? (
                                            <div className="space-y-4">
                                                <div>
                                                    <label className="block text-xs font-medium text-gray-400">{dictionary.photos.title}</label>
                                                    <input
                                                        type="text"
                                                        value={editTitle}
                                                        onChange={(e) => setEditTitle(e.target.value)}
                                                        className="mt-1 w-full rounded-md border border-gray-600 bg-gray-700 p-2 text-sm text-white focus:border-indigo-500 focus:outline-none"
                                                    />
                                                </div>
                                                <div>
                                                    <label className="block text-xs font-medium text-gray-400">{dictionary.photos.description}</label>
                                                    <textarea
                                                        value={editDescription}
                                                        onChange={(e) => setEditDescription(e.target.value)}
                                                        className="mt-1 w-full rounded-md border border-gray-600 bg-gray-700 p-2 text-sm text-white focus:border-indigo-500 focus:outline-none"
                                                        rows={3}
                                                    />
                                                </div>
                                                <div>
                                                    <label className="block text-xs font-medium text-gray-400">{dictionary.photos.tags}</label>
                                                    <input
                                                        type="text"
                                                        value={editTags}
                                                        onChange={(e) => setEditTags(e.target.value)}
                                                        className="mt-1 w-full rounded-md border border-gray-600 bg-gray-700 p-2 text-sm text-white focus:border-indigo-500 focus:outline-none"
                                                    />
                                                </div>
                                                <div className="flex gap-2 pt-2">
                                                    <button
                                                        onClick={handleSave}
                                                        className="rounded-md bg-green-600 px-4 py-2 text-sm font-medium text-white hover:bg-green-700"
                                                    >
                                                        {dictionary.common.save}
                                                    </button>
                                                    <button
                                                        onClick={() => setIsEditing(false)}
                                                        className="rounded-md bg-gray-600 px-4 py-2 text-sm font-medium text-white hover:bg-gray-700"
                                                    >
                                                        {dictionary.common.cancel}
                                                    </button>
                                                </div>
                                            </div>
                                        ) : (
                                            <div className="space-y-4">
                                                <div className="flex items-start justify-between">
                                                    <div>
                                                        <h3 className="text-2xl font-bold text-white">{selectedPhoto.title || dictionary.photos.untitled}</h3>
                                                        <div className="mt-1 flex flex-wrap items-center gap-4 text-sm text-gray-400">
                                                            <span className="flex items-center gap-1">
                                                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="h-4 w-4">
                                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
                                                                </svg>
                                                                {selectedPhoto.user.name || dictionary.common.unknown}
                                                            </span>
                                                            <span className="flex items-center gap-1">
                                                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="h-4 w-4">
                                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" />
                                                                </svg>
                                                                {new Date(selectedPhoto.createdAt).toLocaleDateString()}
                                                            </span>
                                                        </div>
                                                    </div>
                                                    {(session?.user?.role === "ADMIN" || session?.user?.role === "SUPERADMIN" || session?.user?.id === selectedPhoto.userId) && (
                                                        <button
                                                            onClick={startEditing}
                                                            className="flex items-center gap-1 rounded-md bg-indigo-600/20 px-3 py-1.5 text-sm font-medium text-indigo-300 hover:bg-indigo-600/30"
                                                        >
                                                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="h-4 w-4">
                                                                <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
                                                            </svg>
                                                            {dictionary.photos.editDetails}
                                                        </button>
                                                    )}
                                                </div>

                                                <div className="flex flex-wrap gap-2">
                                                    {selectedPhoto.tags.map(tag => (
                                                        <span key={tag.id} className="rounded-full bg-gray-700 px-2 py-1 text-xs text-gray-300">
                                                            #{tag.name}
                                                        </span>
                                                    ))}
                                                </div>

                                                <div className="rounded-lg bg-gray-800 p-4">
                                                    <h4 className="mb-2 text-xs font-semibold uppercase tracking-wider text-gray-500">{dictionary.photos.description}</h4>
                                                    <p className="text-sm text-gray-300 whitespace-pre-wrap leading-relaxed">
                                                        {selectedPhoto.description || <span className="italic text-gray-500">{dictionary.photos.noDescription}</span>}
                                                    </p>
                                                </div>

                                                <div className="pt-2">
                                                    <a
                                                        href={selectedPhoto.url}
                                                        download
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="inline-flex items-center gap-2 rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700"
                                                        onClick={(e) => e.stopPropagation()}
                                                    >
                                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="h-5 w-5">
                                                            <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
                                                        </svg>
                                                        {dictionary.photos.download}
                                                    </a>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
