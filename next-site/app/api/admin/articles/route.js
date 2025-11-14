import { NextResponse } from 'next/server';
import { DataStore } from '../../../../lib/dataStore';
import { getTokenFromRequest, verifyToken } from '../../../../lib/auth';

async function verifyAuth(request) {
  const token = getTokenFromRequest(request);
  if (!token) {
    return false;
  }
  
  const payload = await verifyToken(token);
  return payload && payload.role === 'admin';
}

export async function GET() {
  try {
    const articles = DataStore.getArticles();
    return NextResponse.json({ articles });
  } catch (error) {
    console.error('Error fetching articles:', error);
    return NextResponse.json(
      { error: 'Failed to fetch articles' },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    const isAuthed = await verifyAuth(request);
    if (!isAuthed) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const articleData = await request.json();
    const newArticle = DataStore.addArticle(articleData);
    
    return NextResponse.json({ 
      success: true, 
      article: newArticle 
    });
  } catch (error) {
    console.error('Error creating article:', error);
    return NextResponse.json(
      { error: 'Failed to create article' },
      { status: 500 }
    );
  }
}

export async function PUT(request) {
  try {
    const isAuthed = await verifyAuth(request);
    if (!isAuthed) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { id, ...updateData } = await request.json();
    const updatedArticle = DataStore.updateArticle(id, updateData);
    
    if (!updatedArticle) {
      return NextResponse.json(
        { error: 'Article not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({ 
      success: true, 
      article: updatedArticle 
    });
  } catch (error) {
    console.error('Error updating article:', error);
    return NextResponse.json(
      { error: 'Failed to update article' },
      { status: 500 }
    );
  }
}

export async function DELETE(request) {
  try {
    const isAuthed = await verifyAuth(request);
    if (!isAuthed) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    
    if (!id) {
      return NextResponse.json(
        { error: 'Article ID is required' },
        { status: 400 }
      );
    }
    
    DataStore.deleteArticle(id);
    
    return NextResponse.json({ 
      success: true, 
      message: 'Article deleted successfully' 
    });
  } catch (error) {
    console.error('Error deleting article:', error);
    return NextResponse.json(
      { error: 'Failed to delete article' },
      { status: 500 }
    );
  }
}