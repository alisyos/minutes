#!/bin/bash
# 의존성 패키지 설치
npm install

# 디렉토리 구조 확인
echo "디렉토리 구조 확인:"
find ./src -type d | sort

# TailwindCSS 설정 확인
echo "TailwindCSS 설정 확인:"
cat postcss.config.mjs

# Next.js 애플리케이션 빌드
echo "Next.js 빌드 시작..."
npm run build 