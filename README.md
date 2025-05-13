# 회의록 자동 작성 서비스

GPT API를 연동한 회의록 자동 작성 웹 애플리케이션입니다.

## 주요 기능

1. 회의록 초안 입력
   - 직접 텍스트 입력
   - 파일 업로드 (txt, docx, pdf)

2. 회의록 양식 선택
   - 기본 제공 템플릿 3종
   - 사용자 정의 양식 업로드 (txt, docx, pdf)

3. 추가 가이드 입력
   - 용어 정의, 추가 포함 요소 등 회의록 작성에 필요한 가이드 입력

4. 결과 확인 및 편집
   - HTML 또는 텍스트 형식으로 저장
   - 회의록 내용 수정 기능

## 기술 스택

- Next.js
- TypeScript
- Tailwind CSS
- OpenAI API (GPT-4o)
- React Hook Form
- React Dropzone

## 설치 및 실행

1. 저장소 클론
```bash
git clone [repository-url]
cd minutes2
```

2. 의존성 설치
```bash
npm install
```

3. 환경 변수 설정
`.env.local` 파일을 생성하고 다음과 같이 설정:
```
OPENAI_API_KEY=your_openai_api_key_here
```

4. 개발 서버 실행
```bash
npm run dev
```

5. 브라우저에서 확인
```
http://localhost:3000
```

## 사용 방법

1. 회의록 초안을 직접 입력하거나 파일로 업로드합니다.
2. 원하는 회의록 양식을 선택하거나 사용자 정의 양식을 업로드합니다.
3. 필요한 경우 추가 가이드를 입력합니다.
4. '회의록 생성' 버튼을 클릭하여 AI가 회의록을 작성하도록 합니다.
5. 생성된 회의록을 확인하고 필요한 경우 수정합니다.
6. HTML 또는 텍스트 형식으로 저장합니다.

This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
