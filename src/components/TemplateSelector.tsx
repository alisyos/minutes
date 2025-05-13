import React from 'react';
import { MinutesTemplate } from '@/lib/types';
import { defaultTemplates } from '@/lib/templateUtils';

interface TemplateSelectorProps {
  selectedTemplateId: string;
  onSelectTemplate: (templateId: string) => void;
  onCustomTemplateUpload: () => void;
}

const TemplateSelector: React.FC<TemplateSelectorProps> = ({
  selectedTemplateId,
  onSelectTemplate,
  onCustomTemplateUpload,
}) => {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium text-gray-900">회의록 양식 선택</h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {defaultTemplates.map((template) => (
          <div
            key={template.id}
            className={`border rounded-lg p-4 cursor-pointer transition-all ${
              selectedTemplateId === template.id
                ? 'border-blue-500 bg-blue-50 ring-2 ring-blue-200'
                : 'border-gray-300 hover:border-gray-400'
            }`}
            onClick={() => onSelectTemplate(template.id)}
          >
            <div className="flex items-center space-x-2 mb-2">
              <input
                type="radio"
                id={`template-${template.id}`}
                name="template"
                checked={selectedTemplateId === template.id}
                onChange={() => onSelectTemplate(template.id)}
                className="h-4 w-4 text-blue-600 border-gray-300 focus:ring-blue-500"
              />
              <label
                htmlFor={`template-${template.id}`}
                className="text-sm font-medium text-gray-900"
              >
                {template.name}
              </label>
            </div>
            <div className="w-full h-24 bg-gray-100 rounded flex items-center justify-center text-gray-400 text-xs">
              미리보기
            </div>
          </div>
        ))}
        <div
          className="border border-dashed rounded-lg p-4 cursor-pointer hover:border-gray-400 flex flex-col items-center justify-center"
          onClick={onCustomTemplateUpload}
        >
          <svg
            className="h-8 w-8 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 6v6m0 0v6m0-6h6m-6 0H6"
            />
          </svg>
          <span className="mt-2 text-sm text-gray-500">내 양식 업로드</span>
        </div>
      </div>
    </div>
  );
};

export default TemplateSelector; 