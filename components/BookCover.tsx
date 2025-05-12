// components/BookCover.tsx
"use client";

import Image from 'next/image';
import React from 'react';
import { UIBook } from '../utils/bookService'; // UIBook 임포트

type BookCoverProps = {
    book: UIBook; // UIBook 타입으로 변경
    onSelect: () => void;
    onDelete: () => void;
};

export default function BookCover({ book, onSelect, onDelete }: BookCoverProps) {
    const defaultCover = '/images/default-cover.png'; // public/images 폴더에 default-cover.png 필요

    const handleDeleteClick = (e: React.MouseEvent<HTMLButtonElement>) => {
        e.stopPropagation(); // 부모 요소의 onSelect 이벤트 방지
        onDelete();
    };

    // book.id가 undefined일 경우를 대비 (UIBook 타입에 id가 optional로 되어있다면)
    // 하지만 db.ts에서 id는 BookRecord에 필수이므로 UIBook에도 id가 있어야 함
    const bookIdForAria = book.id ?? 'unknown-book';

    return (
        <div className="group relative bg-white rounded-lg shadow-xl hover:shadow-2xl transition-all duration-300 ease-in-out transform hover:-translate-y-1.5 aspect-[2/3] flex flex-col overflow-hidden border border-slate-200">
            <button
                onClick={onSelect}
                className="flex-grow w-full h-full flex items-center justify-center p-2.5 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-opacity-60 rounded-t-lg"
                aria-label={`"${book.title}" 책 정보 보기`}
            >
                <div className="relative w-full h-full">
                    <Image
                        src={book.coverImage || defaultCover} // book.coverImage (Data URL) 사용
                        alt={`${book.title} 표지`}
                        fill // 부모 요소에 맞춰 채우도록 fill 사용
                        sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, (max-width: 1024px) 25vw, 20vw" // 반응형 이미지 크기 최적화
                        className="object-contain rounded-md" // 이미지가 잘리지 않고 비율 유지
                        priority={false} // 중요 이미지인 경우 true로 설정 (LCP 최적화)
                        // unoptimized prop은 Next.js 외부 이미지가 아닌 경우(Data URL 포함) 자동으로 처리될 수 있으나,
                        // 명시적으로 true로 설정하여 Next.js의 이미지 최적화(외부 URL 변환 등)를 건너뛰게 할 수 있음
                        // Data URL은 이미 최적화된 형태이거나 로컬 데이터이므로 unoptimized={true}가 적절할 수 있음
                        unoptimized={true}
                    />
                </div>
            </button>
            <div className="p-3 bg-slate-800 text-white text-center rounded-b-lg">
                <h3 className="text-xs sm:text-sm font-semibold truncate group-hover:whitespace-normal group-hover:overflow-visible" title={book.title}>
                    {book.title}
                </h3>
                {book.author && (
                    <p className="text-xs text-slate-300 truncate group-hover:whitespace-normal group-hover:overflow-visible" title={book.author}>
                        {book.author}
                    </p>
                )}
            </div>
            <button
                onClick={handleDeleteClick}
                className="absolute top-2 right-2 bg-red-600 text-white rounded-full p-0 w-7 h-7 flex items-center justify-center text-sm opacity-0 group-hover:opacity-100 transition-all duration-200 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-75 shadow-md"
                title="이 책 삭제하기"
                aria-label={`"${book.title}" 책 삭제하기`}
            >
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
                    <path fillRule="evenodd" d="M8.75 1A2.75 2.75 0 0 0 6 3.75v.443c-.795.077-1.58.177-2.365.298a.75.75 0 1 0 .26 1.482l.149-.022.841 10.518A2.75 2.75 0 0 0 7.596 19h4.807a2.75 2.75 0 0 0 2.742-2.53l.841-10.52.149.023a.75.75 0 0 0 .26-1.482A41.03 41.03 0 0 0 14 4.193v-.443A2.75 2.75 0 0 0 11.25 1h-2.5ZM10 4c.84 0 1.673.025 2.5.075V3.75c0-.69-.56-1.25-1.25-1.25h-2.5c-.69 0-1.25.56-1.25 1.25v.325C8.327 4.025 9.16 4 10 4ZM8.58 7.72a.75.75 0 0 0-1.5.06l.3 7.5a.75.75 0 1 0 1.5-.06l-.3-7.5Zm4.34.06a.75.75 0 1 0-1.5-.06l-.3 7.5a.75.75 0 1 0 1.5.06l.3-7.5Z" clipRule="evenodd" />
                </svg>
            </button>
        </div>
    );
}