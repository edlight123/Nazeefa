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
    const photos = DataStore.getPhotos();
    return NextResponse.json({ photos });
  } catch (error) {
    console.error('Error fetching photos:', error);
    return NextResponse.json(
      { error: 'Failed to fetch photos' },
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

    const photoData = await request.json();
    const newPhoto = DataStore.addPhoto(photoData);
    
    return NextResponse.json({ 
      success: true, 
      photo: newPhoto 
    });
  } catch (error) {
    console.error('Error creating photo:', error);
    return NextResponse.json(
      { error: 'Failed to add photo' },
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
        { error: 'Photo ID is required' },
        { status: 400 }
      );
    }
    
    DataStore.deletePhoto(id);
    
    return NextResponse.json({ 
      success: true, 
      message: 'Photo deleted successfully' 
    });
  } catch (error) {
    console.error('Error deleting photo:', error);
    return NextResponse.json(
      { error: 'Failed to delete photo' },
      { status: 500 }
    );
  }
}