// utils/localStorage.ts
import { Book } from '../types';

const LOCAL_STORAGE_KEY = 'myDigitalBookshelf';

export const getBooksFromLocalStorage = (): Book[] => {
    if (typeof window === 'undefined') {
        return [];
    }
    try {
        const serializedBooks = window.localStorage.getItem(LOCAL_STORAGE_KEY);
        if (serializedBooks === null) {
            return [];
        }
        const parsedBooks = JSON.parse(serializedBooks);
        // 간단한 타입 가드 (더 정교하게 가능)
        if (Array.isArray(parsedBooks) && parsedBooks.every(item => typeof item.title === 'string' && typeof item.author === 'string')) {
            return parsedBooks as Book[];
        }
        console.warn("localStorage에서 파싱된 데이터가 Book[] 형식이 아닙니다.", parsedBooks);
        return [];
    } catch (error) {
        console.error("localStorage에서 책 정보를 가져오는데 실패했습니다:", error);
        return [];
    }
};

export const saveBooksToLocalStorage = (books: Book[]): void => {
    if (typeof window === 'undefined') {
        return;
    }
    try {
        const serializedBooks = JSON.stringify(books);
        window.localStorage.setItem(LOCAL_STORAGE_KEY, serializedBooks);
        console.log("Books saved to localStorage:", books);
    } catch (error) {
        console.error("localStorage에 책 정보를 저장하는데 실패했습니다:", error);
    }
};