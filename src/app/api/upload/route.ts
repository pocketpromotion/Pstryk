import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { writeFile, mkdir } from "fs/promises";
import path from "path";

export async function POST(req: Request) {
    const session = await getServerSession(authOptions);

    if (!session) {
        return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    try {
        const formData = await req.formData();
        const file = formData.get("file") as File;
        const title = formData.get("title") as string;
        const groupId = formData.get("groupId") as string;
        const description = formData.get("description") as string;
        const tagsString = formData.get("tags") as string;

        if (!file || !groupId) {
            return NextResponse.json(
                { message: "File and Group ID are required" },
                { status: 400 }
            );
        }

        const buffer = Buffer.from(await file.arrayBuffer());
        const filename = Date.now() + "_" + file.name.replace(/\s/g, "_");

        // Ensure uploads directory exists
        const uploadDir = path.join(process.cwd(), "uploads");
        await mkdir(uploadDir, { recursive: true });

        await writeFile(path.join(uploadDir, filename), buffer);

        const tags = tagsString
            ? tagsString.split(",").map((t) => t.trim()).filter((t) => t)
            : [];

        const photo = await prisma.photo.create({
            data: {
                url: `/uploads/${filename}`,
                title,
                description,
                userId: session.user.id,
                groups: {
                    connect: { id: groupId },
                },
                tags: {
                    connectOrCreate: tags.map((tag) => ({
                        where: { name: tag },
                        create: { name: tag },
                    })),
                },
            },
        });

        return NextResponse.json(photo, { status: 201 });
    } catch (error) {
        console.error("Upload error:", error);
        return NextResponse.json(
            { message: "Upload failed" },
            { status: 500 }
        );
    }
}
