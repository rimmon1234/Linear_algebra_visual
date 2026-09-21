import type { Metadata } from "next";
import "./globals.css";
import "katex/dist/katex.min.css";
import { Header } from "@/components/layout/Header";

export const metadata: Metadata = {
  title: "Interactive Linear Algebra Platform",
  description:
    "Learn abstract linear algebra through intuitive geometric visualizations, interactive matrix transformations, and verified mathematical explorations.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <body
        className="min-h-screen bg-slate-950 text-slate-100 antialiased flex flex-col font-sans"
        suppressHydrationWarning
      >
        <Header />
        <main className="flex-1 flex flex-col">{children}</main>
      </body>
    </html>
  );
}
