// app/page.tsx
"use client";

import { useState, useEffect, useCallback } from 'react'; // useCallback 추가
import Bookshelf from '../components/Bookshelf';
import AddBookForm from '../components/AddBookForm';
import BookDetailModal from '../components/BookDetailModal';
import { getAllBooks, deleteBook, UIBook } from '../utils/bookService'; // 경로 및 UIBook 임포트 확인
// import { Book as OriginalBookType, NewBookData } from '../types'; // OriginalBookType은 이제 UIBook 사용

export default function HomePage() {
  const [books, setBooks] = useState<UIBook[]>([]); // UIBook 타입 사용
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [showAddFormModal, setShowAddFormModal] = useState<boolean>(false);
  const [selectedBook, setSelectedBook] = useState<UIBook | null>(null); // UIBook 타입 사용

  // useCallback으로 fetchBooks 함수 메모이제이션
  const fetchBooks = useCallback(async () => {
    setIsLoading(true);
    const loadedBooks = await getAllBooks();
    setBooks(loadedBooks);
    setIsLoading(false);
  }, []); // 의존성 배열이 비어있으므로, 컴포넌트 마운트 시 한 번만 생성됨

  useEffect(() => {
    fetchBooks();
  }, [fetchBooks]); // fetchBooks가 변경될 때만 (사실상 마운트 시 한 번)

  // handleAddBook은 이제 AddBookForm 내부에서 처리 후 onBookAdded 콜백으로 대체
  // const handleAddBook = async (newBookData: NewBookData & { coverImageFile?: File | null }) => {
  //   // ... 이 로직은 AddBookForm으로 이동하거나, 여기서 직접 호출해도 됨
  //   // 여기서는 onBookAdded 콜백을 통해 fetchBooks를 다시 호출
  // };

  const handleBookAdded = () => {
    fetchBooks(); // 새 책 추가 후 목록 새로고침
  };

  const handleSelectBook = (book: UIBook) => {
    setSelectedBook(book);
  };

  const handleCloseDetailModal = () => {
    setSelectedBook(null);
  };

  const handleDeleteBook = async (bookId?: number) => { // id가 undefined일 수 있음 (UIBook 타입)
    if (bookId === undefined) {
      console.error("Book ID is undefined, cannot delete.");
      return;
    }
    if (window.confirm("정말로 이 책을 삭제하시겠습니까?")) {
      await deleteBook(bookId);
      if (selectedBook && selectedBook.id === bookId) {
        setSelectedBook(null);
      }
      fetchBooks(); // 책 삭제 후 목록 새로고침
    }
  };

  // ... (로딩 UI, 버튼, 모달 등 JSX는 이전과 거의 동일, props 전달 시 타입 주의)
  // Bookshelf, BookCover, BookDetailModal 등은 UIBook 타입을 props로 받도록 수정 필요할 수 있음
  // (또는 mapRecordToUIBook 함수를 해당 컴포넌트에서 사용)

  if (isLoading) {
    return (
        <div className="flex justify-center items-center h-[calc(100vh-250px)]">
          <div role="status" className="flex flex-col items-center">
            {/* ... 로딩 스피너 SVG ... */}
            <p className="text-xl text-slate-600 mt-4">책장 정보를 불러오는 중입니다...</p>
          </div>
        </div>
    );
  }

  return (
      <>
        {/* Head 태그는 app/layout.tsx의 metadata로 대체되거나, page.tsx에서 export const metadata로 개별 설정 */}
        <div className="flex justify-end mb-8">
          <button
              onClick={() => setShowAddFormModal(true)}
              className="bg-emerald-500 hover:bg-emerald-600 text-white font-semibold py-3 px-6 rounded-lg shadow-md hover:shadow-lg transition-all duration-150 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:ring-opacity-75 flex items-center space-x-2"
          >
            {/* ... 새 책 추가 버튼 SVG ... */}
            <span>새 책 추가하기</span>
          </button>
        </div>

        {books.length === 0 && !showAddFormModal && (
            <div className="text-center py-16 px-6 bg-white rounded-xl shadow-lg">
              {/* ... 책장 비었을 때 SVG 및 메시지 ... */}
              <div className="mt-8">
                <button
                    type="button"
                    onClick={() => setShowAddFormModal(true)}
                    className="inline-flex items-center px-5 py-2.5 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-sky-600 hover:bg-sky-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-sky-500"
                >
                  <svg className="-ml-1 mr-2 h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                    <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
                  </svg>
                  지금 책 추가하기
                </button>
              </div>
            </div>
        )}

        {books.length > 0 && (
            <Bookshelf
                books={books} // UIBook[] 전달
                onBookSelect={handleSelectBook}
                onDeleteBook={(bookId) => handleDeleteBook(bookId)} // 함수 시그니처 맞춤
            />
        )}

        {showAddFormModal && (
            <AddBookForm
                onBookAdded={handleBookAdded} // 변경된 콜백 전달
                onClose={() => setShowAddFormModal(false)}
            />
        )}

        {selectedBook && (
            <BookDetailModal
                book={selectedBook} // UIBook 전달
                onClose={handleCloseDetailModal}
            />
        )}
      </>
  );
}