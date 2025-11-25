import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export interface VerseHadithEdge {
  id: string;
  verse: {
    surah: number;
    verse: number;
    reference: string;
    text: string;
  };
  hadith: {
    collection: string;
    bookId: number;
    chapterId: number;
    hadithId: number;
    idInBook: number;
    reference: string;
  };
  connectionType: 'direct' | 'contextual' | 'thematic' | 'excellence' | 'clarification';
  relationship: string;
  scholarlyVerification: {
    verified: boolean;
    verifiedBy: string;
    verificationDate: string;
    sources: string[];
    notes: string;
  };
  strength: 'weak' | 'moderate' | 'strong';
  tags: string[];
}

export async function GET() {
  try {
    const filePath = path.join(process.cwd(), '..', 'data', 'connections', 'verse-hadith-edges.json');
    console.log('Loading edges from:', filePath);
    const fileContents = fs.readFileSync(filePath, 'utf8');
    const data = JSON.parse(fileContents);
    
    return NextResponse.json({
      success: true,
      data: data.edges || [],
      metadata: data.metadata,
      total: data.edges?.length || 0
    });
  } catch (error) {
    console.error('Error loading edge data:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to load edge data' },
      { status: 500 }
    );
  }
}
