import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import GroupDetailView from "@/components/GroupDetailView";

export default async function GroupDetailPage({
    params,
}: {
    params: { id: string };
}) {
    const session = await getServerSession(authOptions);

    if (!session) {
        redirect("/login");
    }

    const group = await prisma.group.findUnique({
        where: { id: params.id },
        include: {
            photos: {
                include: { tags: true, user: true },
                orderBy: { createdAt: "desc" },
            },
            users: true,
        },
    });

    if (!group) {
        return <div>Group not found</div>;
    }

    const isMember = group.users.some((u: { id: string }) => u.id === session.user.id);
    if (!isMember) {
        return <div>You are not a member of this group.</div>;
    }

    return <GroupDetailView group={group} session={session} />;
}
