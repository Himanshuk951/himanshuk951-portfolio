import type { Metadata } from "next";
import { Outfit, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const outfit = Outfit({
    subsets: ["latin"],
    variable: "--font-outfit",
});

const jetbrainsMono = JetBrains_Mono({
    subsets: ["latin"],
    variable: "--font-mono",
});

export const metadata: Metadata = {
    title: "Himanshu Portfolio",
    description: "High-end interactive portfolio of a Designer-Engineer hybrid.",
    icons: {
        icon: "/favicon.svg",
    },
};


export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en" className="dark scroll-smooth">
            <body className={`${outfit.variable} ${jetbrainsMono.variable} antialiased font-sans`}>
                {children}
            </body>
        </html>
    );
}
