// components/AddBookForm.tsx
"use client";

import React, { useState, ChangeEvent, FormEvent, useEffect } from 'react';
// import { NewBookData } from '../types'; // 기존 타입 대신 bookService의 AddBookPayload 사용
import { AddBookPayload, addBook } from '../utils/bookService'; // 경로 확인

type AddBookFormProps = {
    onBookAdded: () => void; // 책 추가 완료 시 호출될 콜백
    onClose: () => void;
};

export default function AddBookForm({ onBookAdded, onClose }: AddBookFormProps) {
    const [title, setTitle] = useState<string>('');
    const [author, setAuthor] = useState<string>('');
    const [description, setDescription] = useState<string>('');
    const [recommender, setRecommender] = useState<string>('');
    const [coverImageFile, setCoverImageFile] = useState<File | null>(null); // File 객체로 변경
    const [coverPreview, setCoverPreview] = useState<string>(''); // 미리보기용 Data URL
    const [error, setError] = useState<string>('');
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);


    // 미리보기 URL 생성/해제
    useEffect(() => {
        if (!coverImageFile) {
            setCoverPreview('');
            return;
        }
        const objectUrl = URL.createObjectURL(coverImageFile);
        setCoverPreview(objectUrl);

        // 컴포넌트 언마운트 또는 파일 변경 시 object URL 해제
        return () => URL.revokeObjectURL(objectUrl);
    }, [coverImageFile]);


    const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            // 이미지 크기/타입 검증 (선택 사항)
            if (file.size > 10 * 1024 * 1024) { // 예: 10MB 제한
                setError('이미지 파일은 10MB 이하로 업로드해주세요.');
                setCoverImageFile(null);
                e.target.value = ''; // 파일 선택 초기화
                return;
            }
            const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
            if (!allowedTypes.includes(file.type)) {
                setError('지원되지 않는 이미지 형식입니다. (JPEG, PNG, WebP, GIF만 가능)');
                setCoverImageFile(null);
                e.target.value = '';
                return;
            }
            setError('');
            setCoverImageFile(file);
        } else {
            setCoverImageFile(null);
        }
    };

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!title.trim() || !author.trim()) {
            setError('책 제목과 저자는 필수 항목입니다.');
            return;
        }
        setError('');
        setIsSubmitting(true);

        const payload: AddBookPayload = {
            title: title.trim(),
            author: author.trim(),
            description: description.trim() || undefined,
            recommender: recommender.trim() || undefined,
            coverImageFile: coverImageFile, // File 객체 전달
        };

        try {
            await addBook(payload);
            onBookAdded(); // 부모 컴포넌트에 알림
            onClose();     // 폼 닫기
        } catch (err) {
            console.error("책 추가 실패 from form:", err);
            setError('책을 추가하는 중 오류가 발생했습니다.');
        } finally {
            setIsSubmitting(false);
        }
    };

    // ... (JSX 폼 구조는 이전과 유사하게 유지, label, input, button 등)
    // 미리보기 이미지 src는 `coverPreview` 사용
    return (
        <div className="fixed inset-0 bg-slate-700 bg-opacity-80 flex items-center justify-center p-4 z-[100] animate-fadeIn">
            <div className="bg-white p-6 sm:p-8 rounded-xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto transform animate-scaleUp">
                <div className="flex justify-between items-center mb-6 pb-4 border-b border-slate-200">
                    <h2 className="text-2xl sm:text-3xl font-bold text-slate-800">새 책 추가</h2>
                    <button onClick={onClose} className="text-slate-400 hover:text-slate-600 transition-colors p-1 -mr-2" disabled={isSubmitting}>
                        <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                    </button>
                </div>
                {error && <p className="mb-4 text-sm text-red-700 bg-red-100 p-3 rounded-lg">{error}</p>}
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label htmlFor="coverImage" className="block text-sm font-medium text-slate-700 mb-1">책 표지 이미지</label>
                        <input
                            type="file"
                            id="coverImage"
                            name="coverImage"
                            accept="image/png, image/jpeg, image/webp, image/gif"
                            onChange={handleImageChange}
                            className="block w-full text-sm text-slate-500 file:mr-4 file:py-2.5 file:px-5 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-sky-50 file:text-sky-700 hover:file:bg-sky-100 cursor-pointer border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500"
                            disabled={isSubmitting}
                        />
                        {coverPreview && ( // coverPreview (Data URL) 사용
                            <div className="mt-4 p-2 border border-slate-200 rounded-lg inline-block shadow-sm">
                                <img src={coverPreview} alt="표지 미리보기" className="h-48 w-auto object-contain rounded-md" />
                            </div>
                        )}
                    </div>
                    {/* title, author, description, recommender input 필드들은 이전과 동일 */}
                    <div>
                        <label htmlFor="title" className="block text-sm font-medium text-slate-700 mb-1">제목 <span className="text-red-500">*</span></label>
                        <input type="text" id="title" name="title" value={title} onChange={(e) => setTitle(e.target.value)} required className="mt-1 block w-full px-4 py-3 border border-slate-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500 sm:text-sm" placeholder="예: 모던 JavaScript 튜토리얼" disabled={isSubmitting} />
                    </div>
                    <div>
                        <label htmlFor="author" className="block text-sm font-medium text-slate-700 mb-1">저자 <span className="text-red-500">*</span></label>
                        <input type="text" id="author" name="author" value={author} onChange={(e) => setAuthor(e.target.value)} required className="mt-1 block w-full px-4 py-3 border border-slate-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500 sm:text-sm" placeholder="예: 이엘리" disabled={isSubmitting} />
                    </div>
                    <div>
                        <label htmlFor="description" className="block text-sm font-medium text-slate-700 mb-1">간략한 설명</label>
                        <textarea id="description" name="description" value={description} onChange={(e) => setDescription(e.target.value)} rows={4} className="mt-1 block w-full px-4 py-3 border border-slate-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500 sm:text-sm" placeholder="이 책에 대한 간략한 소개를 적어주세요..." disabled={isSubmitting}></textarea>
                    </div>
                    <div>
                        <label htmlFor="recommender" className="block text-sm font-medium text-slate-700 mb-1">추천자 (학번 이름)</label>
                        <input type="text" id="recommender" name="recommender" value={recommender} onChange={(e) => setRecommender(e.target.value)} className="mt-1 block w-full px-4 py-3 border border-slate-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500 sm:text-sm" placeholder="예: 20230001 홍길동" disabled={isSubmitting} />
                    </div>

                    <div className="flex justify-end space-x-4 pt-4 border-t border-slate-200">
                        <button type="button" onClick={onClose} className="px-6 py-2.5 text-sm font-medium text-slate-700 bg-slate-100 rounded-lg hover:bg-slate-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-400 transition-colors" disabled={isSubmitting}>
                            취소
                        </button>
                        <button type="submit" className="px-6 py-2.5 text-sm font-medium text-white bg-sky-600 rounded-lg hover:bg-sky-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-sky-500 transition-colors flex items-center" disabled={isSubmitting}>
                            {isSubmitting ? (
                                <>
                                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    저장 중...
                                </>
                            ) : (
                                '저장하기'
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}