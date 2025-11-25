import { VerseReference } from './quran';
import { HadithReference } from './hadith';

export type EdgeTier = 1 | 2 | 3;

export type LinkageType = 
  | 'Explicit_Citation'
  | 'Implicit_Chapter'
  | 'Exegetical_Consensus'
  | 'Legal_Specification'
  | 'Historical_Context'
  | 'Liturgical_Wird';

export type LegalFunction = 
  | 'Takhsis'
  | 'Taqyeed'
  | 'Bayan'
  | 'Naskh'
  | 'None';

export type VerificationStatus = 'manually_verified' | 'pending_review' | 'ai_suggested';

export interface VerificationSource {
  type: 'hadith_collection' | 'tafsir' | 'scholarly_work';
  reference: string;
}

export interface Edge {
  id: string;
  pillar: string;
  verse_ref: VerseReference;
  hadith_ref: HadithReference;
  linkage: {
    tier: EdgeTier;
    linkage_type: LinkageType;
    legal_function: LegalFunction[];
    weight: number;
  };
  verification: {
    sources: VerificationSource[];
    status: VerificationStatus;
  };
  quran_verse: {
    text_arabic: string;
    text_english: string;
  };
  hadith: {
    primary_narrator?: string;
    text_arabic_snippet: string;
    text_english_summary: string;
    authentication: string;
  };
  notes?: string;
}
