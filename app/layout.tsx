import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import { SpeedInsights } from "@vercel/speed-insights/next"

import "@uploadthing/react/styles.css";
import ToasterProvider from "@/components/ui/providers/ToasterProvider";
import ConfettiProvider from "@/components/providers/ConfettiProvider";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
    title: "LMS-Nextjs",
    description: "It's a learning management system",
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <ClerkProvider>
            <html lang="en">
                <body className={inter.className}>
                    <ConfettiProvider />
                    <ToasterProvider />
                    {children}
                    <SpeedInsights />
                </body>
            </html>
        </ClerkProvider>
    );
}
