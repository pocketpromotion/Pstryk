import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function PUT(
    req: Request,
    { params }: { params: { id: string } }
) {
    const session = await getServerSession(authOptions);

    if (!session) {
        return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    try {
        const { description, title, tags } = await req.json();
        const photoId = params.id;

        const photo = await prisma.photo.findUnique({
            where: { id: photoId },
            include: { tags: true },
        });

        if (!photo) {
            return NextResponse.json({ message: "Photo not found" }, { status: 404 });
        }

        // Check permissions: Owner or Admin
        if (photo.userId !== session.user.id && session.user.role !== "ADMIN" && session.user.role !== "SUPERADMIN") {
            return NextResponse.json({ message: "Forbidden" }, { status: 403 });
        }

        // Handle tags update if provided
        let tagsUpdate = {};
        if (tags) {
            const tagList = tags.split(",").map((t: string) => t.trim()).filter((t: string) => t !== "");
            tagsUpdate = {
                tags: {
                    set: [], // Disconnect all existing tags
                    connectOrCreate: tagList.map((tag: string) => ({
                        where: { name: tag },
                        create: { name: tag },
                    })),
                },
            };
        }

        const updatedPhoto = await prisma.photo.update({
            where: { id: photoId },
            data: {
                description,
                title,
                ...tagsUpdate,
            },
            include: { user: true, tags: true },
        });

        return NextResponse.json(updatedPhoto);
    } catch (error) {
        console.error("Update photo error:", error);
        return NextResponse.json(
            { message: "Failed to update photo" },
            { status: 500 }
        );
    }
}
