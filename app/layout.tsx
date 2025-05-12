// app/layout.tsx
import type { Metadata } from 'next';
import { Inter } from 'next/font/google'; // 예시 폰트, 원하는 폰트로 변경 가능
import './globals.css'; // Tailwind CSS 및 전역 스타일
import React from 'react';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
    title: '대전과고 과학자의 서재',
    description: '대전과고 과학자의 서재 by KOI3125',
};

export default function RootLayout({
                                       children,
                                   }: {
    children: React.ReactNode;
}) {
    return (
        <html lang="ko">
        <body className={`${inter.className} min-h-screen bg-gray-100 text-gray-800`}>
        <header className="bg-blue-700 text-white p-4 shadow-lg sticky top-0 z-50">
            <div className="container mx-auto">
                <h1 className="text-3xl font-bold text-center tracking-tight">나의 온라인 서재</h1>
            </div>
        </header>

        <main className="container mx-auto p-4 sm:p-6 md:p-8">
            {children}
        </main>

        <footer className="text-center p-6 text-gray-500 text-sm border-t border-gray-200 mt-8">
            © {new Date().getFullYear()} My Digital Bookshelf.
        </footer>
        </body>
        </html>
    );
}