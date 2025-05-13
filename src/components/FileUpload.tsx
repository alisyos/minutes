import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import toast from 'react-hot-toast';

interface FileUploadProps {
  onFileContent: (content: string) => void;
  fileType: 'draft' | 'template';
  accept: Record<string, string[]>;
}

const FileUpload: React.FC<FileUploadProps> = ({ onFileContent, fileType, accept }) => {
  const [isLoading, setIsLoading] = useState(false);
  
  const onDrop = useCallback(
    async (acceptedFiles: File[]) => {
      try {
        if (acceptedFiles.length === 0) return;
        
        const file = acceptedFiles[0];
        const fileExtension = file.name.split('.').pop()?.toLowerCase();
        
        if (!fileExtension) {
          toast.error('파일 형식을 확인할 수 없습니다.');
          return;
        }
        
        if (fileExtension === 'txt') {
          // 텍스트 파일은 클라이언트에서 직접 읽기
          const text = await file.text();
          onFileContent(text);
          toast.success(`${file.name} 파일을 읽었습니다.`);
        } else if (fileExtension === 'pdf' || fileExtension === 'docx') {
          // PDF나 DOCX 파일은 서버 API를 통해 처리
          setIsLoading(true);
          
          const formData = new FormData();
          formData.append('file', file);
          
          const response = await fetch('/api/parse-file', {
            method: 'POST',
            body: formData,
          });
          
          if (!response.ok) {
            throw new Error('파일 파싱 중 오류가 발생했습니다.');
          }
          
          const result = await response.json();
          onFileContent(result.content);
          toast.success(`${file.name} 파일을 성공적으로 처리했습니다.`);
        } else {
          toast.error('지원하지 않는 파일 형식입니다.');
        }
      } catch (error) {
        console.error('파일 처리 중 오류 발생:', error);
        toast.error('파일을 처리하는 중 오류가 발생했습니다.');
      } finally {
        setIsLoading(false);
      }
    },
    [onFileContent]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept,
    maxFiles: 1,
    disabled: isLoading,
  });

  const getFileTypeText = () => {
    if (fileType === 'draft') {
      return {
        title: '회의록 초안 파일 업로드',
        description: 'txt, docx, pdf 파일을 업로드하세요',
      };
    } else {
      return {
        title: '회의록 양식 파일 업로드',
        description: 'txt, docx, pdf 파일을 업로드하세요',
      };
    }
  };

  const { title, description } = getFileTypeText();

  return (
    <div
      {...getRootProps()}
      className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors ${
        isLoading ? 'opacity-50 cursor-not-allowed' : ''
      } ${
        isDragActive
          ? 'border-blue-500 bg-blue-50'
          : 'border-gray-300 hover:border-gray-400'
      }`}
    >
      <input {...getInputProps()} />
      <div className="space-y-2">
        <svg
          className="mx-auto h-12 w-12 text-gray-400"
          stroke="currentColor"
          fill="none"
          viewBox="0 0 48 48"
          aria-hidden="true"
        >
          <path
            d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
            strokeWidth={2}
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
        <h3 className="text-lg font-medium text-gray-900">{title}</h3>
        <p className="text-sm text-gray-500">{description}</p>
        <p className="text-xs text-gray-500">
          {isLoading
            ? '파일 처리 중...'
            : isDragActive
            ? '파일을 여기에 놓으세요'
            : '클릭하거나 파일을 여기로 끌어다 놓으세요'}
        </p>
      </div>
    </div>
  );
};

export default FileUpload; 