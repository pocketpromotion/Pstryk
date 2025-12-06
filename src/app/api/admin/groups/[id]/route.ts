import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";


export const dynamic = 'force-dynamic';

export async function PUT(
    req: Request,
    { params }: { params: { id: string } }
) {
    const session = await getServerSession(authOptions);

    if (!session || (session.user.role !== "ADMIN" && session.user.role !== "SUPERADMIN")) {
        return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    try {
        const { name, addMemberId, removeMemberId, thumbnailUrl } = await req.json();
        const id = params.id;

        const data: any = {};
        if (name) data.name = name;
        if (thumbnailUrl !== undefined) data.thumbnailUrl = thumbnailUrl;
        if (addMemberId) {
            data.users = { connect: { id: addMemberId } };
        }
        if (removeMemberId) {
            data.users = { disconnect: { id: removeMemberId } };
        }

        const group = await prisma.group.update({
            where: { id },
            data,
            include: {
                _count: { select: { users: true, photos: true } },
                users: true,
            },
        });

        return NextResponse.json(
            { message: "Group updated successfully", group },
            { status: 200 }
        );
    } catch (error) {
        console.error(error);
        return NextResponse.json(
            { message: "Something went wrong" },
            { status: 500 }
        );
    }
}

export async function DELETE(
    req: Request,
    { params }: { params: { id: string } }
) {
    const session = await getServerSession(authOptions);

    if (!session || (session.user.role !== "ADMIN" && session.user.role !== "SUPERADMIN")) {
        return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    try {
        const id = params.id;

        await prisma.group.delete({
            where: { id },
        });

        return NextResponse.json(
            { message: "Group deleted successfully" },
            { status: 200 }
        );
    } catch (error) {
        return NextResponse.json(
            { message: "Something went wrong" },
            { status: 500 }
        );
    }
}
