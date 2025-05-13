'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import toast, { Toaster } from 'react-hot-toast';
import FileUpload from '@/components/FileUpload';
import TemplateSelector from '@/components/TemplateSelector';
import MinutesEditor from '@/components/MinutesEditor';
import { MinutesData, MinutesResult } from '@/lib/types';

export default function Home() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1);
  const [draftContent, setDraftContent] = useState('');
  const [customTemplate, setCustomTemplate] = useState<string | null>(null);
  const [selectedTemplateId, setSelectedTemplateId] = useState('template1');
  const [minutesResult, setMinutesResult] = useState<MinutesResult | null>(null);
  const [showEditor, setShowEditor] = useState(false);
  
  const { register, handleSubmit, watch, formState: { errors } } = useForm();

  // 파일 업로드 핸들러
  const handleDraftFileContent = (content: string) => {
    setDraftContent(content);
  };

  // 템플릿 파일 업로드 핸들러
  const handleTemplateFileContent = (content: string) => {
    setCustomTemplate(content);
    setSelectedTemplateId('custom');
  };

  // 회의록 생성 요청
  const generateMinutes = async (data: any) => {
    const content = draftContent || data.draftContent;
    
    if (!content) {
      toast.error('회의록 초안 내용을 입력하거나 파일을 업로드해주세요.');
      return;
    }
    
    try {
      setLoading(true);
      
      const response = await fetch('/api/generate-minutes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          content,
          templateId: selectedTemplateId === 'custom' ? null : selectedTemplateId,
          customTemplate,
          additionalGuide: data.additionalGuide,
        }),
      });
      
      if (!response.ok) {
        throw new Error('회의록 생성 중 오류가 발생했습니다.');
      }
      
      const result = await response.json();
      setMinutesResult(result);
      setStep(3);
      
    } catch (error) {
      console.error('회의록 생성 중 오류:', error);
      toast.error('회의록 생성 중 오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  };

  // 회의록 편집 저장
  const handleSaveEdit = (updatedData: MinutesData) => {
    if (!minutesResult) return;
    
    // 업데이트된 데이터로 HTML 및 텍스트 재생성
    // 실제로는 API를 호출하거나 템플릿 유틸리티를 사용하여 재생성해야 함
    setMinutesResult({
      ...minutesResult,
      data: updatedData
    });
    
    setShowEditor(false);
    toast.success('회의록이 업데이트되었습니다.');
  };

  // HTML 저장 함수
  const saveHtml = () => {
    if (!minutesResult?.html) return;
    
    const blob = new Blob([minutesResult.html], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `회의록_${new Date().toISOString().slice(0, 10)}.html`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  // 텍스트 저장 함수
  const saveText = () => {
    if (!minutesResult?.text) return;
    
    const blob = new Blob([minutesResult.text], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `회의록_${new Date().toISOString().slice(0, 10)}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };
  
  // DOCX 저장 함수
  const saveDocx = async () => {
    if (!minutesResult?.html) return;
    
    try {
      // 로딩 메시지 표시
      toast.loading('워드 파일 생성 중...');
      
      // API 호출로 HTML을 DOCX로 변환
      const response = await fetch('/api/convert-to-docx', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          html: minutesResult.html,
          title: minutesResult.data.title,
        }),
      });
      
      if (!response.ok) {
        throw new Error('DOCX 변환 중 오류가 발생했습니다.');
      }
      
      // 바이너리 데이터로 응답 처리
      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `회의록_${new Date().toISOString().slice(0, 10)}.docx`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      
      // 로딩 메시지 닫기
      toast.dismiss();
      toast.success('워드 파일이 생성되었습니다.');
    } catch (error) {
      console.error('DOCX 변환 중 오류:', error);
      toast.dismiss();
      toast.error('워드 파일 생성 중 오류가 발생했습니다.');
    }
  };

  return (
    <main className="container mx-auto px-4 py-8">
      <Toaster position="top-right" />
      
      <h1 className="text-3xl font-bold mb-8 text-center">회의록 자동 작성 서비스</h1>
      
      {/* 단계 표시 */}
      <div className="mb-8">
        <div className="flex items-center justify-center">
          <div className={`step-item ${step >= 1 ? 'active' : ''}`}>
            <div className="step-circle">1</div>
            <div className="step-text">회의록 초안 입력</div>
          </div>
          <div className="step-line"></div>
          <div className={`step-item ${step >= 2 ? 'active' : ''}`}>
            <div className="step-circle">2</div>
            <div className="step-text">양식 선택</div>
          </div>
          <div className="step-line"></div>
          <div className={`step-item ${step >= 3 ? 'active' : ''}`}>
            <div className="step-circle">3</div>
            <div className="step-text">결과 확인</div>
          </div>
        </div>
      </div>
      
      {/* 단계 1: 회의록 초안 입력 */}
      {step === 1 && (
        <div className="max-w-3xl mx-auto">
          <form onSubmit={handleSubmit(() => setStep(2))} className="space-y-6">
            <div>
              <h2 className="text-xl font-semibold mb-4">회의록 초안 입력</h2>
              <div className="space-y-4">
                <div>
                  <label htmlFor="draftContent" className="block text-sm font-medium text-gray-700 mb-1">
                    회의록 초안 직접 입력
                  </label>
                  <textarea
                    id="draftContent"
                    {...register('draftContent')}
                    rows={10}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="회의록 초안을 입력하세요..."
                  />
                </div>
                
                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-300" />
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="px-2 bg-white text-gray-500">또는</span>
                  </div>
                </div>
                
                <FileUpload
                  onFileContent={handleDraftFileContent}
                  fileType="draft"
                  accept={{
                    'text/plain': ['.txt'],
                    'application/pdf': ['.pdf'],
                    'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
                  }}
                />
              </div>
            </div>
            
            <div className="flex justify-end">
              <button
                type="submit"
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                다음
              </button>
            </div>
          </form>
        </div>
      )}
      
      {/* 단계 2: 양식 선택 및 추가 가이드 입력 */}
      {step === 2 && (
        <div className="max-w-3xl mx-auto">
          <form onSubmit={handleSubmit(generateMinutes)} className="space-y-6">
            <TemplateSelector
              selectedTemplateId={selectedTemplateId}
              onSelectTemplate={setSelectedTemplateId}
              onCustomTemplateUpload={() => document.getElementById('customTemplateUpload')?.click()}
            />
            
            {selectedTemplateId === 'custom' && (
              <div className="mt-4">
                <FileUpload
                  onFileContent={handleTemplateFileContent}
                  fileType="template"
                  accept={{
                    'text/plain': ['.txt'],
                    'application/pdf': ['.pdf'],
                    'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
                  }}
                />
              </div>
            )}
            
            <div>
              <label htmlFor="additionalGuide" className="block text-sm font-medium text-gray-700 mb-1">
                추가 가이드 (선택사항)
              </label>
              <textarea
                id="additionalGuide"
                {...register('additionalGuide')}
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="용어 정의, 추가 포함 요소 등 회의록 작성에 필요한 추가 가이드를 입력하세요..."
              />
            </div>
            
            <div className="flex justify-between">
              <button
                type="button"
                onClick={() => setStep(1)}
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500"
              >
                이전
              </button>
              <button
                type="submit"
                disabled={loading}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
              >
                {loading ? '생성 중...' : '회의록 생성'}
              </button>
            </div>
          </form>
        </div>
      )}
      
      {/* 단계 3: 결과 확인 */}
      {step === 3 && minutesResult && (
        <div className="max-w-4xl mx-auto">
          {showEditor ? (
            <MinutesEditor
              minutesData={minutesResult.data}
              onSave={handleSaveEdit}
              onCancel={() => setShowEditor(false)}
            />
          ) : (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-semibold">회의록 결과</h2>
                <div className="space-x-2">
                  <button
                    onClick={() => setShowEditor(true)}
                    className="px-3 py-1.5 border border-gray-300 rounded-md text-sm text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500"
                  >
                    수정하기
                  </button>
                  <button
                    onClick={saveHtml}
                    className="px-3 py-1.5 bg-blue-600 text-white rounded-md text-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    HTML 저장
                  </button>
                  <button
                    onClick={saveText}
                    className="px-3 py-1.5 bg-gray-600 text-white rounded-md text-sm hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500"
                  >
                    텍스트 저장
                  </button>
                  <button
                    onClick={saveDocx}
                    className="px-3 py-1.5 bg-green-600 text-white rounded-md text-sm hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500"
                  >
                    워드 저장
                  </button>
                </div>
              </div>
              
              <div className="border rounded-lg overflow-hidden">
                <div className="bg-gray-50 p-4 border-b">
                  <h3 className="font-medium">{minutesResult.data.title}</h3>
                </div>
                <div className="p-4">
                  <iframe
                    srcDoc={minutesResult.html}
                    className="w-full h-[600px] border-0"
                    title="회의록 미리보기"
                  />
                </div>
              </div>
              
              <div className="flex justify-between">
                <button
                  onClick={() => setStep(1)}
                  className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500"
                >
                  처음으로
                </button>
              </div>
            </div>
          )}
        </div>
      )}
      
      <style jsx>{`
        .step-item {
          display: flex;
          flex-direction: column;
          align-items: center;
          flex: 1;
        }
        
        .step-circle {
          width: 30px;
          height: 30px;
          border-radius: 50%;
          background-color: #e5e7eb;
          color: #9ca3af;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: bold;
          margin-bottom: 8px;
          transition: all 0.3s ease;
        }
        
        .step-text {
          color: #9ca3af;
          font-size: 14px;
          transition: all 0.3s ease;
        }
        
        .step-line {
          flex: 1;
          height: 2px;
          background-color: #e5e7eb;
          margin: 0 8px;
          margin-bottom: 30px;
          max-width: 100px;
        }
        
        .step-item.active .step-circle {
          background-color: #3b82f6;
          color: white;
        }
        
        .step-item.active .step-text {
          color: #1f2937;
          font-weight: 500;
        }
      `}</style>
    </main>
  );
}
