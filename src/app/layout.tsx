import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { ThemeProvider } from "@/components/theme-provider";
import { AuthProvider } from "@/context/AuthContext";
import { Sidebar } from "@/components/layout/Sidebar";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

export const metadata: Metadata = {
    title: "LIFER - Productivity Superapp",
    description: "Todo, Calendar, and Finance in one place.",
    manifest: "/manifest.json",
    icons: {
        icon: "/icon.png",
        apple: "/icon.png",
        shortcut: "/icon.png",
    },
    appleWebApp: {
        title: "LIFER",
        statusBarStyle: "black-translucent",
        startupImage: "/icon.png",
    },
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en" suppressHydrationWarning>
            <body className={`${inter.variable} antialiased font-sans`}>
                <ThemeProvider
                    attribute="class"
                    defaultTheme="system"
                    enableSystem
                    disableTransitionOnChange
                >
                    <AuthProvider>
                        <div className="flex h-screen overflow-hidden bg-background">
                            {/* Sidebar is fixed on desktop, toggleable on mobile */}
                            <Sidebar />

                            {/* Main Content Area */}
                            <main className="flex-1 overflow-y-auto md:ml-64 transition-all duration-200 ease-in-out">
                                {/* 
                    Add a top spacer or padding if needed, 
                    but Sidebar handles its own fixed positioning.
                    We use md:ml-64 to offset content on desktop.
                 */}
                                <div className="container mx-auto p-4 md:p-8 max-w-7xl">
                                    {children}
                                </div>
                            </main>
                        </div>
                    </AuthProvider>
                </ThemeProvider>
            </body>
        </html>
    );
}
