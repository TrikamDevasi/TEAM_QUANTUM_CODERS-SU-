import type { Metadata } from "next";
import "./globals.css";
import SplashScreen from "../components/SplashScreen";

export const metadata: Metadata = {
    title: "SkillSense AI — Measuring Skills, Predicting Futures",
    description:
        "AI-powered skill gap analysis, verifiable Skill Passports, career matching, and national workforce intelligence for India's IT and software engineering ecosystem.",
};

export default function RootLayout({
    children,
}: Readonly<{ children: React.ReactNode }>) {
    return (
        <html lang="en">
            <head>
                <link rel="preconnect" href="https://fonts.googleapis.com" />
                <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
                <link
                    href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&family=Space+Grotesk:wght@400;500;600;700;800&display=swap"
                    rel="stylesheet"
                />
            </head>
            <body style={{ background: '#050a14' }}>
                <SplashScreen>{children}</SplashScreen>
            </body>
        </html>
    );
}
