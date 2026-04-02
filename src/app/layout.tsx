import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { Sidebar } from "@/components/layout/Sidebar";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains",
});

export const metadata: Metadata = {
  title: "HireLens — AI Resume Intelligence",
  description:
    "AI-powered resume parsing, analysis, and candidate ranking system. Upload resumes, get instant skill assessments, and find the best candidates faster.",
  keywords: [
    "resume parser",
    "AI recruitment",
    "candidate ranking",
    "skill assessment",
    "hiring tool",
  ],
  openGraph: {
    title: "HireLens — AI Resume Intelligence",
    description: "Transform resumes into actionable hiring insights with AI.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${inter.variable} ${jetbrainsMono.variable}`}>
      <body className="gradient-bg">
        <div className="flex min-h-screen">
          <Sidebar />
          <main className="flex-1 ml-0 md:ml-64 min-h-screen">
            <div className="p-4 md:p-8 max-w-7xl mx-auto">{children}</div>
          </main>
        </div>
      </body>
    </html>
  );
}
