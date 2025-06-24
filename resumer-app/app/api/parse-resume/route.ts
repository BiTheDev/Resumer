import { NextRequest, NextResponse } from 'next/server';
import { parseResume } from '@/lib/resume-parser';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json(
        { error: 'No file provided' },
        { status: 400 }
      );
    }

    // Validate file type
    if (!file.type.includes('pdf') && !file.type.includes('image')) {
      return NextResponse.json(
        { error: 'Only PDF and image files are supported' },
        { status: 400 }
      );
    }

    // Convert file to buffer
    const buffer = Buffer.from(await file.arrayBuffer());

    // Parse resume
    const result = await parseResume(buffer, file.name);

    return NextResponse.json(result);

  } catch (error) {
    console.error('Resume parsing error:', error);
    return NextResponse.json(
      { error: 'Failed to parse resume' },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json({ message: 'Resume Parser API is running' });
} 