import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export interface Hadith {
  id: number;
  idInBook: number;
  chapterId: number;
  bookId: number;
  arabic: string;
  english: {
    narrator: string;
    text: string;
  };
}

export async function GET() {
  try {
    // Data is now in app/data directory
    const filePath = path.join(process.cwd(), 'data', 'hadith', 'bukhari-raw.json');
    console.log('Loading hadith from:', filePath);
    const fileContents = fs.readFileSync(filePath, 'utf8');
    const data = JSON.parse(fileContents);
    const hadiths: Hadith[] = data.hadiths || [];

    // Return all hadiths (we can add pagination later if needed)
    return NextResponse.json({
      success: true,
      data: hadiths,
      total: hadiths.length,
      collection: 'Sahih al-Bukhari'
    });
  } catch (error) {
    console.error('Error loading hadith data:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to load hadith data' },
      { status: 500 }
    );
  }
}
