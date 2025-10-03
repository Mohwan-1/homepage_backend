#!/bin/bash

# Vercel 환경 변수 업데이트 스크립트

echo "🔧 Vercel 환경 변수 업데이트 시작..."

# Firebase 환경 변수들
vercel env add NEXT_PUBLIC_FIREBASE_API_KEY production <<< "AIzaSyDa9274pjOegiOXtlgDYMcu7LBe72wEG1Y"
vercel env add NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN production <<< "sidondding-homepage.firebaseapp.com"
vercel env add NEXT_PUBLIC_FIREBASE_PROJECT_ID production <<< "sidondding-homepage"
vercel env add NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET production <<< "sidondding-homepage.firebasestorage.app"
vercel env add NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID production <<< "948064095251"
vercel env add NEXT_PUBLIC_FIREBASE_APP_ID production <<< "1:948064095251:web:963a9d16cad35feafb03e6"
vercel env add NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID production <<< "G-3XMNN350JE"

echo "✅ 환경 변수 업데이트 완료!"
echo "🚀 이제 'vercel --prod'를 실행하여 재배포하세요."
