// components/Bookshelf.tsx
"use client";

import BookCover from './BookCover';
import { UIBook } from '../utils/bookService'; // UIBook 임포트

type BookshelfProps = {
    books: UIBook[]; // UIBook[] 타입 사용
    onBookSelect: (book: UIBook) => void;
    onDeleteBook: (bookId?: number) => void; // UIBook의 id는 number | undefined 일 수 있으므로 ? 추가
};

export default function Bookshelf({ books, onBookSelect, onDeleteBook }: BookshelfProps) {
    return (
        <div className="p-4 sm:p-6 bg-amber-50 rounded-xl shadow-inner"
             style={{
                 backgroundImage: "url('/images/wood-texture.jpg')",
                 backgroundSize: 'cover',
                 backgroundPosition: 'center',
                 boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.1), inset 0 -2px 4px rgba(0,0,0,0.1)'
             }}
        >
            <div className="grid grid-cols-2 xs:grid-cols-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-x-4 sm:gap-x-6 gap-y-8 sm:gap-y-10">
                {books.map((book) => ( // book은 UIBook 타입
                    <BookCover
                        key={book.id} // UIBook에는 id가 있어야 함 (mapRecordToUIBook에서 전달)
                        book={book}   // UIBook 전달
                        onSelect={() => onBookSelect(book)}
                        onDelete={() => {
                            if (book.id !== undefined) { // id 존재 여부 확인
                                onDeleteBook(book.id);
                            } else {
                                console.error("Cannot delete book: ID is undefined.", book);
                            }
                        }}
                    />
                ))}
            </div>
        </div>
    );
}