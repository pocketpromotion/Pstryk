import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
    title: "Pstryk",
    description: "Share photos with your groups",
};

import { NextAuthProvider } from "./providers";

import Navbar from "@/components/Navbar";

import { LanguageProvider } from "@/lib/i18n";

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
            <body className={inter.className}>
                <NextAuthProvider>
                    <LanguageProvider>
                        <Navbar />
                        {children}
                    </LanguageProvider>
                </NextAuthProvider>
            </body>
        </html>
    );
}
