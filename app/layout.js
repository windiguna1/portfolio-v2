import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

export const metadata = {
  title: "Creative Portfolio",
  description: "A modern, minimal portfolio.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${inter.variable}`}>
        <div className="bg-shape shape-1"></div>
        <div className="bg-shape shape-2"></div>
        {children}
      </body>
    </html>
  );
}
