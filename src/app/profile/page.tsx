import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import ProfileForm from "@/components/ProfileForm";

export default async function ProfilePage() {
    const session = await getServerSession(authOptions);

    if (!session) {
        redirect("/login");
    }

    const user = await prisma.user.findUnique({
        where: { id: session.user.id },
        select: {
            id: true,
            name: true,
            email: true,
        },
    });

    if (!user) {
        redirect("/login");
    }

    return (
        <div className="flex min-h-screen items-center justify-center bg-gray-900 p-4">
            <ProfileForm user={user} />
        </div>
    );
}
