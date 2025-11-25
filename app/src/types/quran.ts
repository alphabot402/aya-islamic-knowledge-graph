export interface QuranWord {
  surface_form: string;
  lemma?: string;
  root?: string;
  pos_tag?: string;
}

export interface QuranVerse {
  index: number;
  text_uthmani: string;
  text_simple: string;
  words?: QuranWord[];
  structural_tags?: {
    pillar_tags?: string[];
    topic_tags?: string[];
  };
  cross_refs?: string[];
}

export interface QuranSurah {
  surah_number: number;
  revelation_order: number;
  juz_list: number[];
  verses: QuranVerse[];
}

export interface VerseReference {
  surah: number;
  ayah: number;
  reference: string;
}
