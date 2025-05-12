// utils/cookie.ts
import { Book } from '../types'; // Book 인터페이스 경로에 맞게 수정

const COOKIE_NAME = 'myDigitalBookshelf';

export const getBooksFromCookie = (): Book[] => {
  if (typeof window === 'undefined') { // 서버 사이드 렌더링 시 window 객체 없음
    return [];
  }
  const cookieValue = document.cookie
    .split('; ')
    .find(row => row.startsWith(`${COOKIE_NAME}=`))
    ?.split('=')[1];

  if (cookieValue) {
    try {
      const parsedData = JSON.parse(decodeURIComponent(cookieValue));
      if (Array.isArray(parsedData) && parsedData.every(item => typeof item.title === 'string' && typeof item.author === 'string')) {
        return parsedData as Book[];
      }
      console.warn("쿠키에서 파싱된 데이터가 Book[] 형식이 아닙니다.", parsedData);
      return [];
    } catch (e) {
      console.error("쿠키에서 책 정보를 파싱하는데 실패했습니다:", e);
      return [];
    }
  }
  return [];
};

export const saveBooksToCookie = (books: Book[]): void => {
  if (typeof window === 'undefined') {
    console.log("Window is undefined, skipping cookie save (SSR context).");
    return;
  }
  try {
    const stringifiedBooks = JSON.stringify(books);
    const encodedBooks = encodeURIComponent(stringifiedBooks);
    const cookieName = 'myDigitalBookshelf'; // COOKIE_NAME 변수 사용 권장

    if (encodedBooks.length > 4000) { // 대략적인 크기 제한 경고 (4KB)
      console.warn("Cookie size might be too large:", encodedBooks.length, "bytes. This could lead to issues.");
    }

    const expires = new Date();
    expires.setFullYear(expires.getFullYear() + 1); // 1년 후 만료
    const cookieString = `${cookieName}=${encodedBooks}; expires=${expires.toUTCString()}; path=/; SameSite=Lax`;

    console.log("Attempting to set cookie:", cookieString); // 설정하려는 쿠키 문자열 로그
    document.cookie = cookieString;

    // 확인용 로그 (실제로는 바로 반영되지 않을 수 있음, 개발자 도구에서 확인)
    // console.log("Current document.cookie after attempting to set:", document.cookie);

  } catch (error) {
    console.error("Error stringifying or encoding books for cookie:", error);
  }
};