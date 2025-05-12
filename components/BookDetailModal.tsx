// components/BookDetailModal.tsx
"use client";

import Image from 'next/image';
import React from 'react';
import { UIBook } from '../utils/bookService'; // UIBook 임포트

type BookDetailModalProps = {
    book: UIBook | null; // UIBook 타입으로 변경, null 가능
    onClose: () => void;
};

export default function BookDetailModal({ book, onClose }: BookDetailModalProps) {
    if (!book) return null;

    const defaultCover = '/images/default-cover.png';

    const handleModalContentClick = (e: React.MouseEvent<HTMLDivElement>) => {
        e.stopPropagation(); // 모달 외부 클릭 시 닫기 이벤트 전파 방지
    };

    return (
        <div
            className="fixed inset-0 bg-slate-800 bg-opacity-90 flex items-center justify-center p-4 z-[100] animate-fadeIn"
            onClick={onClose} // 오버레이 클릭 시 닫기
        >
            <div
                className="bg-white p-6 sm:p-8 rounded-xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto transform animate-scaleUp"
                onClick={handleModalContentClick}
            >
                <div className="flex justify-between items-start mb-6 pb-4 border-b border-slate-200">
                    <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 mr-4 leading-tight">{book.title}</h2>
                    <button onClick={onClose} className="text-slate-400 hover:text-slate-600 transition-colors p-1 -mt-1 -mr-2">
                        <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                    </button>
                </div>

                <div className="md:flex md:space-x-8">
                    <div className="md:w-1/3 mb-6 md:mb-0 flex-shrink-0">
                        <div className="w-full aspect-[2/3] relative rounded-lg shadow-xl overflow-hidden border border-slate-200">
                            <Image
                                src={book.coverImage || defaultCover} // book.coverImage (Data URL) 사용
                                alt={`${book.title} 표지`}
                                fill
                                sizes="(max-width: 768px) 80vw, (max-width: 1024px) 40vw, 33vw"
                                className="object-contain" // 이미지가 컨테이너 내부에 비율 유지하며 맞춤
                                unoptimized={true} // Data URL은 최적화 불필요
                            />
                        </div>
                    </div>
                    <div className="md:w-2/3 space-y-5 text-slate-700">
                        <div>
                            <p className="text-sm font-semibold text-slate-500 uppercase tracking-wider">저자</p>
                            <p className="text-lg sm:text-xl text-slate-800">{book.author}</p>
                        </div>
                        {book.description && (
                            <div>
                                <p className="text-sm font-semibold text-slate-500 uppercase tracking-wider">설명</p>
                                <p className="text-base whitespace-pre-wrap leading-relaxed bg-slate-50 p-4 rounded-md border border-slate-200">
                                    {book.description}
                                </p>
                            </div>
                        )}
                        {book.recommender && (
                            <div>
                                <p className="text-sm font-semibold text-slate-500 uppercase tracking-wider">추천자</p>
                                <p className="text-base">{book.recommender}</p>
                            </div>
                        )}
                    </div>
                </div>

                <div className="mt-8 pt-6 border-t border-slate-200 flex justify-end">
                    <button
                        onClick={onClose}
                        className="px-6 py-2.5 bg-sky-600 text-white font-medium text-sm rounded-lg hover:bg-sky-700 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-opacity-50 transition-colors"
                    >
                        닫기
                    </button>
                </div>
            </div>
        </div>
    );
}