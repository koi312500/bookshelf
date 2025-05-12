// types/index.ts
export interface Book {
  id: number;
  title: string;
  author: string;
  description?: string;
  recommender?: string;
  coverImage?: string | null; // Base64 인코딩된 이미지 문자열 또는 null
}

export type NewBookData = Omit<Book, 'id'>;