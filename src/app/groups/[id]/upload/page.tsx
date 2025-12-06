"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import { useLanguage } from "@/lib/i18n";

export default function UploadPage({ params }: { params: { id: string } }) {
    const router = useRouter();
    const { dictionary } = useLanguage();
    const [file, setFile] = useState<File | null>(null);
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [tags, setTags] = useState("");
    const [uploading, setUploading] = useState(false);

    const handleUpload = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!file) return;

        setUploading(true);
        const formData = new FormData();
        formData.append("file", file);
        formData.append("title", title);
        formData.append("description", description);
        formData.append("tags", tags);
        formData.append("groupId", params.id);

        try {
            const res = await fetch("/api/upload", {
                method: "POST",
                body: formData,
            });

            if (res.ok) {
                router.push(`/groups/${params.id}`);
                router.refresh();
            } else {
                alert(dictionary.common.error);
            }
        } catch (error) {
            console.error("Upload error", error);
            alert(dictionary.common.error);
        } finally {
            setUploading(false);
        }
    };

    return (
        <div className="flex min-h-screen items-center justify-center bg-gray-900">
            <div className="w-full max-w-md rounded-lg bg-gray-800 p-8 shadow-md">
                <h1 className="mb-6 text-2xl font-bold text-white">{dictionary.photos.uploadTitle}</h1>
                <form onSubmit={handleUpload} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-300">
                            {dictionary.photos.selectFile}
                        </label>
                        <input
                            type="file"
                            accept="image/*"
                            required
                            onChange={(e) => setFile(e.target.files?.[0] || null)}
                            className="mt-1 block w-full text-sm text-gray-400 file:mr-4 file:rounded-full file:border-0 file:bg-indigo-900 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-indigo-300 hover:file:bg-indigo-800"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-300">
                            {dictionary.photos.title}
                        </label>
                        <input
                            type="text"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            className="mt-1 block w-full rounded-md border border-gray-600 bg-gray-700 px-3 py-2 text-white focus:border-indigo-500 focus:outline-none"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-300">
                            {dictionary.photos.tags}
                        </label>
                        <input
                            type="text"
                            placeholder={dictionary.photos.tagsPlaceholder}
                            value={tags}
                            onChange={(e) => setTags(e.target.value)}
                            className="mt-1 block w-full rounded-md border border-gray-600 bg-gray-700 px-3 py-2 text-white placeholder-gray-400 focus:border-indigo-500 focus:outline-none"
                        />
                    </div>
                    <button
                        type="submit"
                        disabled={uploading}
                        className="w-full rounded-md bg-indigo-600 px-4 py-2 text-white hover:bg-indigo-700 disabled:opacity-50"
                    >
                        {uploading ? dictionary.common.loading : dictionary.photos.upload}
                    </button>
                    <button
                        type="button"
                        onClick={() => router.back()}
                        className="w-full text-sm text-gray-400 hover:text-gray-300"
                    >
                        {dictionary.common.cancel}
                    </button>
                </form>
            </div>
        </div>
    );
}
