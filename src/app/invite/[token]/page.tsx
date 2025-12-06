import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { redirect } from "next/navigation";

export default async function InvitePage({
    params,
}: {
    params: { token: string };
}) {
    const invitation = await prisma.invitation.findUnique({
        where: { token: params.token },
        include: { group: true },
    });

    if (!invitation || invitation.expiresAt < new Date()) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-gray-100">
                <div className="rounded-lg bg-white p-8 shadow-md">
                    <h1 className="text-xl font-bold text-red-600">
                        Invalid or Expired Invitation
                    </h1>
                    <p className="mt-4">
                        This invitation link is no longer valid. Please ask for a new one.
                    </p>
                    <Link
                        href="/"
                        className="mt-6 block text-center text-indigo-600 hover:underline"
                    >
                        Go Home
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="flex min-h-screen items-center justify-center bg-gray-100">
            <div className="w-full max-w-md rounded-lg bg-white p-8 shadow-md">
                <h1 className="mb-4 text-2xl font-bold text-center">
                    You've been invited!
                </h1>
                <p className="mb-6 text-center text-gray-600">
                    You have been invited to join{" "}
                    <span className="font-semibold">
                        {invitation.group?.name || "the app"}
                    </span>
                    .
                </p>

                <div className="space-y-4">
                    <Link
                        href={`/register?email=${encodeURIComponent(
                            invitation.email
                        )}&token=${invitation.token}`}
                        className="block w-full rounded-md bg-indigo-600 px-4 py-2 text-center text-white hover:bg-indigo-700"
                    >
                        Create Account & Join
                    </Link>
                    <Link
                        href={`/login?email=${encodeURIComponent(
                            invitation.email
                        )}&token=${invitation.token}`}
                        className="block w-full rounded-md border border-gray-300 bg-white px-4 py-2 text-center text-gray-700 hover:bg-gray-50"
                    >
                        Login to Existing Account
                    </Link>
                </div>
            </div>
        </div>
    );
}
