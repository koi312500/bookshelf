// utils/bookService.ts
import { db, BookRecord } from './db'; // db.ts 경로 확인
import { NewBookData } from '../types'; // 기존 타입 활용

// UI에 표시될 Book 타입 (기존 types/index.ts와 유사하게, coverImage는 string)
export interface UIBook extends Omit<BookRecord, 'coverImageBlob'> {
    coverImage?: string | null; // Data URL
}

// Blob을 Data URL로 변환하는 헬퍼 함수
const blobToDataURL = (blob: Blob): Promise<string> => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => {
            if (typeof reader.result === 'string') {
                resolve(reader.result);
            } else {
                reject(new Error('Failed to read blob as Data URL.'));
            }
        };
        reader.onerror = reject;
        reader.readAsDataURL(blob);
    });
};

// BookRecord를 UIBook으로 변환
const mapRecordToUIBook = async (record: BookRecord): Promise<UIBook> => {
    const { coverImageBlob, ...restOfRecord } = record;
    let coverImage: string | null = null;
    if (coverImageBlob) {
        try {
            coverImage = await blobToDataURL(coverImageBlob);
        } catch (error) {
            console.error("Error converting blob to Data URL for book:", record.id, error);
        }
    }
    return { ...restOfRecord, coverImage };
};

// 새 책 추가
// AddBookForm에서 File 객체를 직접 받도록 수정 필요
export interface AddBookPayload extends NewBookData {
    coverImageFile?: File | null; // FileReader 대신 File 객체
}
export const addBook = async (payload: AddBookPayload): Promise<number | undefined> => {
    const { coverImageFile, coverImage, ...bookData } = payload; // coverImage(Base64)는 사용 안 함

    const newRecord: Omit<BookRecord, 'id'> = {
        ...bookData,
        createdAt: new Date(),
        updatedAt: new Date(),
    };

    if (coverImageFile) {
        // 이미지 압축 라이브러리 (browser-image-compression) 사용 예시
        // try {
        //   const options = { maxSizeMB: 1, maxWidthOrHeight: 1024, useWebWorker: true };
        //   const compressedFile = await imageCompression(coverImageFile, options);
        //   newRecord.coverImageBlob = compressedFile;
        // } catch (error) {
        //   console.error("이미지 압축 실패, 원본 파일 사용:", error);
        //   newRecord.coverImageBlob = coverImageFile; // 압축 실패 시 원본 사용
        // }
        newRecord.coverImageBlob = coverImageFile; // 여기서는 압축 없이 바로 저장
    }

    try {
        const id = await db.books.add(newRecord as BookRecord); // id 타입 때문에 as 사용
        console.log(`Book added with id ${id}`);
        return id;
    } catch (error) {
        console.error("Failed to add book:", error);
    }
};

// 모든 책 가져오기 (UI용으로 변환)
export const getAllBooks = async (): Promise<UIBook[]> => {
    try {
        const records = await db.books.orderBy('createdAt').reverse().toArray(); // 최신순 정렬
        return Promise.all(records.map(mapRecordToUIBook));
    } catch (error) {
        console.error("Failed to get all books:", error);
        return [];
    }
};

// ID로 책 한 권 가져오기 (UI용으로 변환)
export const getBookById = async (id: number): Promise<UIBook | undefined> => {
    try {
        const record = await db.books.get(id);
        if (record) {
            return mapRecordToUIBook(record);
        }
    } catch (error) {
        console.error(`Failed to get book with id ${id}:`, error);
    }
};

// 책 업데이트
// 업데이트 시에도 File 객체를 받을 수 있도록 payload 타입 정의 필요
export interface UpdateBookPayload extends Partial<Omit<BookRecord, 'id' | 'createdAt' | 'coverImageBlob'>> {
    id: number;
    coverImageFile?: File | null; // 새 이미지 파일
    removeCoverImage?: boolean;   // 기존 이미지 제거 여부
}
export const updateBook = async (payload: UpdateBookPayload): Promise<number | undefined> => {
    const { id, coverImageFile, removeCoverImage, ...bookData } = payload;
    try {
        const updateData: Partial<BookRecord> = { ...bookData, updatedAt: new Date() };

        if (removeCoverImage) {
            updateData.coverImageBlob = null;
        } else if (coverImageFile) {
            // 이미지 압축 로직 추가 가능
            updateData.coverImageBlob = coverImageFile;
        }
        // coverImageFile도 없고 removeCoverImage도 false면 기존 이미지 유지 (별도 처리 X)

        const updatedCount = await db.books.update(id, updateData);
        if (updatedCount > 0) {
            console.log(`Book with id ${id} updated`);
            return id;
        } else {
            console.log(`Book with id ${id} not found for update`);
        }
    } catch (error) {
        console.error(`Failed to update book with id ${id}:`, error);
    }
};


// 책 삭제
export const deleteBook = async (id: number): Promise<void> => {
    try {
        await db.books.delete(id);
        console.log(`Book with id ${id} deleted`);
    } catch (error) {
        console.error(`Failed to delete book with id ${id}:`, error);
    }
};