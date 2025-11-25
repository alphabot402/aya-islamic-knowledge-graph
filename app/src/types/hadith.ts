export type HadithGrade = 'Sahih' | 'Hasan' | 'Daif';

export interface Hadith {
  id: string;
  collection: string;
  hadith_number: number;
  book_number: number;
  book_title_ar: string;
  book_title_en: string;
  chapter_title_ar?: string;
  chapter_title_en?: string;
  isnad_raw_ar?: string;
  matn_ar: string;
  matn_en: string;
  grade: HadithGrade;
  grade_source?: string;
  pillar_tags?: string[];
  topic_tags?: string[];
}

export interface HadithReference {
  collection: string;
  hadith_number: number;
  book_english: string;
  book_arabic: string;
}
