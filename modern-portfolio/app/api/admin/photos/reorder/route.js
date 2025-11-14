import { NextResponse } from 'next/server';
import { DataStore } from '../../../../../lib/dataStoreVercel';
import { getTokenFromRequest, verifyToken } from '../../../../../lib/auth';

async function verifyAuth(request) {
  const token = getTokenFromRequest(request);
  if (!token) {
    return false;
  }
  
  const payload = await verifyToken(token);
  return payload && payload.role === 'admin';
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

    const { orderedIds } = await request.json();
    
    if (!Array.isArray(orderedIds)) {
      return NextResponse.json(
        { error: 'orderedIds must be an array' },
        { status: 400 }
      );
    }
    
    DataStore.reorderPhotos(orderedIds);
    
    return NextResponse.json({ 
      success: true, 
      message: 'Photos reordered successfully' 
    });
  } catch (error) {
    console.error('Error reordering photos:', error);
    return NextResponse.json(
      { error: 'Failed to reorder photos' },
      { status: 500 }
    );
  }
}