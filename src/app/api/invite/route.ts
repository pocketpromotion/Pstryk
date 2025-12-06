import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import crypto from "crypto";

export async function POST(req: Request) {
    const session = await getServerSession(authOptions);

    if (!session || (session.user.role !== "ADMIN" && session.user.role !== "SUPERADMIN")) {
        return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    try {
        const { email, groupId } = await req.json();

        if (!email) {
            return NextResponse.json(
                { message: "Email is required" },
                { status: 400 }
            );
        }

        const token = crypto.randomBytes(32).toString("hex");
        const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours

        const invitation = await prisma.invitation.create({
            data: {
                email,
                token,
                groupId,
                expiresAt,
            },
        });

        // Mock sending email
        const inviteLink = `${process.env.NEXTAUTH_URL || "http://localhost:3000"}/invite/${token}`;
        console.log(`--------------------------------------------------`);
        console.log(`MOCK EMAIL TO: ${email}`);
        console.log(`SUBJECT: You have been invited!`);
        console.log(`LINK: ${inviteLink}`);
        console.log(`--------------------------------------------------`);

        return NextResponse.json({ message: "Invitation sent", invitation });
    } catch (error) {
        return NextResponse.json(
            { message: "Something went wrong" },
            { status: 500 }
        );
    }
}
