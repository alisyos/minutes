import { NextRequest, NextResponse } from 'next/server';
import openai from '@/lib/openai';
import { MinutesData } from '@/lib/types';
import { applyTemplateData } from '@/lib/templateUtils';

// 템플릿 파일 로드 함수
async function loadTemplateFile(templateId: string): Promise<string> {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/api/templates?id=${templateId}`);
    
    if (!response.ok) {
      throw new Error(`템플릿을 로드할 수 없습니다. 상태 코드: ${response.status}`);
    }
    
    const data = await response.json();
    return data.content;
  } catch (error) {
    console.error(`템플릿 파일 로드 중 오류 발생: ${error}`);
    throw new Error('템플릿 파일을 로드할 수 없습니다.');
  }
}

export async function POST(req: NextRequest) {
  try {
    const { content, templateId, customTemplate, additionalGuide } = await req.json();

    if (!content) {
      return NextResponse.json(
        { error: '회의록 초안 내용이 필요합니다.' },
        { status: 400 }
      );
    }

    // GPT-4o를 사용하여 회의록 생성
    const prompt = `
당신은 전문적인 회의록 작성 전문가입니다. 제공된 회의 내용을 바탕으로 구조화된 회의록을 작성해주세요.
형식은 다음과 같이 JSON 형태로 작성해주세요:

{
  "title": "회의 제목",
  "date": "회의 날짜",
  "participants": "참석자 목록",
  "agenda": "회의 안건",
  "content": "회의 내용 요약",
  "decisions": "결정 사항",
  "actionItems": "액션 아이템 및 담당자",
  "additionalNotes": "추가 사항"
}

회의 내용:
${content}

${additionalGuide ? `추가 가이드라인:\n${additionalGuide}` : ''}

반드시 위의 JSON 형식으로 응답해주세요. 각 항목은 마크다운 형식으로 작성하고, 내용이 없는 경우에는 빈 문자열로 남겨두세요.
`;

    try {
      const completion = await openai.chat.completions.create({
        model: 'gpt-4o',
        messages: [
          {
            role: 'system',
            content: '당신은 전문적인 회의록 작성 전문가입니다. 항상 요청된 형식에 맞게 응답합니다.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.7,
      });

      const responseText = completion.choices[0].message.content || '';
      
      // JSON 형식 추출
      const jsonMatch = responseText.match(/\{[\s\S]*\}/);
      if (!jsonMatch) {
        return NextResponse.json(
          { error: 'AI 응답을 파싱할 수 없습니다.' },
          { status: 500 }
        );
      }

      const minutesData: MinutesData = JSON.parse(jsonMatch[0]);

      // 템플릿 적용
      let htmlResult = '';
      let template = '';

      if (customTemplate) {
        // 사용자 정의 템플릿 사용
        template = customTemplate;
      } else if (templateId) {
        // 기본 템플릿 사용
        template = await loadTemplateFile(templateId);
      } else {
        // 기본값으로 template1 사용
        template = await loadTemplateFile('template1');
      }

      htmlResult = applyTemplateData(template, minutesData);

      // 텍스트 형식 결과 생성
      const textResult = `
# ${minutesData.title}

일시: ${minutesData.date}
참석자: ${minutesData.participants}

## 회의 안건
${minutesData.agenda}

## 회의 내용
${minutesData.content}

## 결정 사항
${minutesData.decisions}

## 액션 아이템
${minutesData.actionItems}

## 추가 사항
${minutesData.additionalNotes}
      `.trim();

      return NextResponse.json({
        success: true,
        html: htmlResult,
        text: textResult,
        data: minutesData
      });
    } catch (error) {
      console.error('OpenAI API 호출 중 오류:', error);
      return NextResponse.json(
        { error: 'AI 모델 호출 중 오류가 발생했습니다.' },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('회의록 생성 중 오류 발생:', error);
    return NextResponse.json(
      { error: '회의록 생성 중 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
} 