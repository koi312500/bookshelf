// db.ts
import Dexie, { Table } from 'dexie';

// 기존 Book 타입과 별개로 IndexedDB에 저장될 타입을 정의합니다.
// 이미지를 Blob 형태로 저장하기 위함입니다.
export interface BookRecord {
    id?: number; // Dexie가 자동으로 생성하고 관리 (auto-increment)
    title: string;
    author: string;
    description?: string;
    recommender?: string;
    coverImageBlob?: Blob | null; // 책 표지 이미지 Blob
    createdAt?: Date; // 생성일 (선택 사항)
    updatedAt?: Date; // 수정일 (선택 사항)
}

// UI에서 사용할 Book 타입 (coverImage는 Data URL)
// 기존 types/index.ts의 Book 타입을 활용하거나, 여기서 새로 정의할 수 있습니다.
// 여기서는 UI 표시용 Book 타입을 유지한다고 가정하고, 변환 과정을 거칩니다.
// import { Book as UIBook } from './types'; // 기존 Book 타입

export class MyBookshelfDB extends Dexie {
    // 'books' 테이블은 BookRecord 타입의 객체들을 저장합니다.
    books!: Table<BookRecord, number>; // 두 번째 제네릭은 primary key의 타입 (id)

    constructor() {
        super('MyDigitalBookshelfDB'); // 데이터베이스 이름
        this.version(1).stores({
            // '++id'는 auto-incrementing primary key를 의미합니다.
            // 'title', 'author'는 인덱싱할 속성들입니다. 검색 성능 향상에 도움됩니다.
            books: '++id, title, author, createdAt',
        });
    }
}

export const db = new MyBookshelfDB();