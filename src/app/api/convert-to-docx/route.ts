import { NextRequest, NextResponse } from 'next/server';
import { Document, Packer, Paragraph, HeadingLevel, AlignmentType } from 'docx';
import { JSDOM } from 'jsdom';

export async function POST(req: NextRequest) {
  try {
    const { html, title } = await req.json();
    
    if (!html) {
      return NextResponse.json(
        { error: 'HTML 내용이 필요합니다.' },
        { status: 400 }
      );
    }
    
    // JSDOM으로 HTML 파싱
    const dom = new JSDOM(html);
    const documentElement = dom.window.document;
    
    // 문서 제목 정리
    const docTitle = title?.trim() || '회의록';
    
    // 문단 배열 생성
    const paragraphs: Paragraph[] = [];
    
    // 타이틀 추가
    paragraphs.push(
      new Paragraph({
        text: docTitle,
        heading: HeadingLevel.TITLE,
        alignment: AlignmentType.CENTER,
      })
    );
    
    // 메타 정보 추가 (날짜, 참석자)
    const metaInfo = documentElement.querySelector('.meta, .meta-info, .document-meta');
    if (metaInfo) {
      const metaText = metaInfo.textContent?.trim() || '';
      const metaParagraph = new Paragraph({
        text: metaText,
        alignment: AlignmentType.LEFT,
      });
      paragraphs.push(metaParagraph);
      paragraphs.push(new Paragraph({ text: '' })); // 빈 줄 추가
    }
    
    // 섹션 추출 및 추가
    const sections = documentElement.querySelectorAll('.section, .section-content');
    sections.forEach((section: Element) => {
      // 섹션 제목 찾기
      const sectionTitle = section.querySelector('.section-title');
      if (sectionTitle && sectionTitle.textContent?.trim()) {
        paragraphs.push(
          new Paragraph({
            text: sectionTitle.textContent?.trim() || '',
            heading: HeadingLevel.HEADING_1,
          })
        );
      }
      
      // 섹션 내용 찾기
      const sectionContent = section.querySelector('.section-content') || section;
      if (sectionContent && sectionContent.textContent?.trim()) {
        // 마크다운 텍스트를 줄 단위로 처리
        const contentText = sectionContent.textContent?.trim() || '';
        const contentLines = contentText.split('\n');
        contentLines.forEach((line: string) => {
          if (line.trim()) {
            paragraphs.push(
              new Paragraph({
                text: line.trim(),
              })
            );
          }
        });
        paragraphs.push(new Paragraph({ text: '' })); // 빈 줄 추가
      }
    });
    
    // Document 객체 생성
    const doc = new Document({
      sections: [{
        properties: {},
        children: paragraphs,
      }],
    });
    
    // DOCX 생성
    const buffer = await Packer.toBuffer(doc);
    
    // 파일명 생성
    const date = new Date().toISOString().slice(0, 10);
    // 한글 처리 문제를 피하기 위해 영문 파일명만 사용
    const filename = `minutes_${date}.docx`;
    const encodedFilename = encodeURIComponent(filename);
    
    // 응답 반환 - 직접 파일 다운로드
    return new Response(buffer, {
      headers: {
        'Content-Type': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        'Content-Disposition': `attachment; filename="${encodedFilename}"; filename*=UTF-8''${encodedFilename}`,
      },
    });
  } catch (error) {
    console.error('DOCX 변환 중 오류:', error);
    return NextResponse.json(
      { error: 'DOCX 변환 중 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
} 