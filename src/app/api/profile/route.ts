import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { compare, hash } from "bcryptjs";
import { validatePassword } from "@/lib/password";

export async function PUT(req: Request) {
    const session = await getServerSession(authOptions);

    if (!session) {
        return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    try {
        const { name, currentPassword, newPassword } = await req.json();
        const userId = session.user.id;

        const user = await prisma.user.findUnique({
            where: { id: userId },
        });

        if (!user) {
            return NextResponse.json({ message: "User not found" }, { status: 404 });
        }

        const updateData: any = { name };



        // ... (existing imports)

        // ... inside PUT function
        if (newPassword) {
            if (!currentPassword) {
                return NextResponse.json(
                    { message: "Current password is required to set a new password" },
                    { status: 400 }
                );
            }

            const passwordError = validatePassword(newPassword);
            if (passwordError) {
                return NextResponse.json(
                    { message: "Password does not meet requirements" },
                    { status: 400 }
                );
            }

            const isPasswordValid = await compare(currentPassword, user.password);

            if (!isPasswordValid) {
                return NextResponse.json(
                    { message: "Incorrect current password" },
                    { status: 400 }
                );
            }

            const hashedPassword = await hash(newPassword, 12);
            updateData.password = hashedPassword;
        }

        const updatedUser = await prisma.user.update({
            where: { id: userId },
            data: updateData,
        });

        return NextResponse.json(
            { message: "Profile updated successfully", user: updatedUser },
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
