import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function PUT(
    req: Request,
    { params }: { params: { id: string } }
) {
    const session = await getServerSession(authOptions);

    if (!session || (session.user.role !== "ADMIN" && session.user.role !== "SUPERADMIN")) {
        return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    try {
        const { name, role } = await req.json();
        const id = params.id;

        // Check if target user is SUPERADMIN
        const targetUser = await prisma.user.findUnique({ where: { id } });
        if (targetUser?.role === "SUPERADMIN" && session.user.role !== "SUPERADMIN") {
            return NextResponse.json({ message: "Only SUPERADMIN can edit another SUPERADMIN" }, { status: 403 });
        }

        // Prevent promoting to SUPERADMIN if not SUPERADMIN
        if (role === "SUPERADMIN" && session.user.role !== "SUPERADMIN") {
            return NextResponse.json({ message: "Only SUPERADMIN can promote users to SUPERADMIN" }, { status: 403 });
        }

        const user = await prisma.user.update({
            where: { id },
            data: {
                name,
                role,
            },
        });

        return NextResponse.json(
            { message: "User updated successfully", user },
            { status: 200 }
        );
    } catch (error) {
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

        // Check if target user is SUPERADMIN
        const targetUser = await prisma.user.findUnique({ where: { id } });
        if (targetUser?.role === "SUPERADMIN" && session.user.role !== "SUPERADMIN") {
            return NextResponse.json({ message: "Only SUPERADMIN can delete another SUPERADMIN" }, { status: 403 });
        }

        await prisma.user.delete({
            where: { id },
        });

        return NextResponse.json(
            { message: "User deleted successfully" },
            { status: 200 }
        );
    } catch (error) {
        return NextResponse.json(
            { message: "Something went wrong" },
            { status: 500 }
        );
    }
}
