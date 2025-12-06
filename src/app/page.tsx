import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import HomeView from "@/components/HomeView";

export default async function Home() {
    const session = await getServerSession(authOptions);

    return <HomeView isLoggedIn={!!session} />;
}
