import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const templateId = searchParams.get('id');
    
    if (!templateId) {
      return NextResponse.json(
        { error: '템플릿 ID가 필요합니다.' },
        { status: 400 }
      );
    }
    
    const validIds = ['template1', 'template2', 'template3'];
    
    if (!validIds.includes(templateId)) {
      return NextResponse.json(
        { error: '유효하지 않은 템플릿 ID입니다.' },
        { status: 400 }
      );
    }
    
    const templatePath = path.join(process.cwd(), 'src', 'app', 'templates', `${templateId}.html`);
    
    try {
      const content = await fs.promises.readFile(templatePath, 'utf-8');
      return NextResponse.json({ content });
    } catch (error) {
      console.error(`템플릿 파일 읽기 오류: ${error}`);
      return NextResponse.json(
        { error: '템플릿 파일을 읽을 수 없습니다.' },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('템플릿 로드 중 오류:', error);
    return NextResponse.json(
      { error: '템플릿을 로드하는 중 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
} 