import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import UserManagement from "@/components/UserManagement";
import GroupManagement from "@/components/GroupManagement";
import AdminHeader from "@/components/AdminHeader";

export default async function AdminPage() {
    const session = await getServerSession(authOptions);

    if (!session || (session.user.role !== "ADMIN" && session.user.role !== "SUPERADMIN")) {
        redirect("/");
    }

    const users = await prisma.user.findMany();
    const groups = await prisma.group.findMany({
        include: {
            _count: { select: { users: true, photos: true } },
            users: true
        },
    });

    return (
        <div className="container mx-auto p-8">
            <AdminHeader />

            <div className="grid gap-8 md:grid-cols-2">
                <UserManagement initialUsers={users} />

                <GroupManagement initialGroups={groups} allUsers={users} />
            </div>
        </div>
    );
}
