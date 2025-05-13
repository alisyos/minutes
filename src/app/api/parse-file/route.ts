import { NextRequest, NextResponse } from 'next/server';
import * as pdfParse from 'pdf-parse';
import mammoth from 'mammoth';

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get('file') as File;
    
    if (!file) {
      return NextResponse.json(
        { error: '파일이 필요합니다.' },
        { status: 400 }
      );
    }
    
    const fileType = file.name.split('.').pop()?.toLowerCase();
    let textContent = '';
    
    // 파일 타입에 따라 적절한 파싱 수행
    if (fileType === 'txt') {
      textContent = await file.text();
    } else if (fileType === 'pdf') {
      const arrayBuffer = await file.arrayBuffer();
      const pdfData = new Uint8Array(arrayBuffer);
      const result = await pdfParse(pdfData);
      textContent = result.text;
    } else if (fileType === 'docx') {
      const arrayBuffer = await file.arrayBuffer();
      const result = await mammoth.extractRawText({ arrayBuffer });
      textContent = result.value;
    } else {
      return NextResponse.json(
        { error: '지원하지 않는 파일 형식입니다.' },
        { status: 400 }
      );
    }
    
    return NextResponse.json({ content: textContent });
  } catch (error) {
    console.error('파일 파싱 중 오류:', error);
    return NextResponse.json(
      { error: '파일 파싱 중 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
} 