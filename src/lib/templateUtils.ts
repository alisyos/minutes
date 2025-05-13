import { MinutesTemplate, MinutesData } from './types';

// 기본 템플릿 목록
export const defaultTemplates: MinutesTemplate[] = [
  {
    id: 'template1',
    name: '기본 템플릿',
    content: '',
  },
  {
    id: 'template2',
    name: '모던 템플릿',
    content: '',
  },
  {
    id: 'template3',
    name: '비즈니스 템플릿',
    content: '',
  },
];

// 템플릿에 데이터 적용
export const applyTemplateData = (template: string, data: MinutesData): string => {
  const currentDate = new Date().toLocaleDateString('ko-KR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return template
    .replace(/{{title}}/g, data.title)
    .replace(/{{date}}/g, data.date)
    .replace(/{{participants}}/g, data.participants)
    .replace(/{{agenda}}/g, data.agenda)
    .replace(/{{content}}/g, data.content)
    .replace(/{{decisions}}/g, data.decisions)
    .replace(/{{actionItems}}/g, data.actionItems)
    .replace(/{{additionalNotes}}/g, data.additionalNotes)
    .replace(/{{generatedDate}}/g, currentDate);
};

// 사용자 정의 템플릿에서 데이터 추출
export const extractTemplateStructure = (content: string): string[] => {
  // 템플릿에서 필요한 섹션을 추출하는 로직
  // 실제로는 더 복잡할 수 있지만, 간단한 구현으로 대체
  const sections = [];
  
  if (content.includes('회의 안건') || content.includes('안건')) sections.push('agenda');
  if (content.includes('회의 내용') || content.includes('내용')) sections.push('content');
  if (content.includes('결정 사항') || content.includes('결정')) sections.push('decisions');
  if (content.includes('액션 아이템') || content.includes('조치 사항')) sections.push('actionItems');
  if (content.includes('추가 사항') || content.includes('기타')) sections.push('additionalNotes');
  
  return sections;
}; 