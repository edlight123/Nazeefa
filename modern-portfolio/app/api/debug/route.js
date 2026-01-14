import { NextResponse } from 'next/server';
import { DataStore } from '../../../lib/dataStoreFirebase';

export async function GET() {
  try {
    const articles = await DataStore.getArticles();
    const photos = await DataStore.getPhotos();
    
    return NextResponse.json({ 
      success: true,
      timestamp: new Date().toISOString(),
      articlesCount: articles.length,
      photosCount: photos.length,
      firstArticleDate: articles[0]?.date,
      serverless: process.env.VERCEL ? true : false,
      articles: articles.slice(0, 2) // First 2 articles for debugging
    });
  } catch (error) {
    return NextResponse.json({ 
      error: error.message,
      timestamp: new Date().toISOString()
    }, { status: 500 });
  }
}