import { NextResponse } from 'next/server';

export async function GET() {
  const env = {
    apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
    authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
    measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
  };

  // 보안을 위해 API 키의 일부만 표시
  const maskedEnv = {
    apiKey: env.apiKey ? `${env.apiKey.substring(0, 10)}...${env.apiKey.substring(env.apiKey.length - 4)}` : '❌ 없음',
    apiKeyLength: env.apiKey?.length || 0,
    authDomain: env.authDomain || '❌ 없음',
    projectId: env.projectId || '❌ 없음',
    storageBucket: env.storageBucket || '❌ 없음',
    messagingSenderId: env.messagingSenderId || '❌ 없음',
    appId: env.appId ? `${env.appId.substring(0, 15)}...` : '❌ 없음',
    measurementId: env.measurementId || '❌ 없음',
  };

  return NextResponse.json({
    environment: process.env.NODE_ENV,
    vercel: !!process.env.VERCEL,
    config: maskedEnv,
    validation: {
      apiKeyValid: env.apiKey?.startsWith('AIza') && env.apiKey.length === 39,
      authDomainValid: env.authDomain?.includes('firebaseapp.com'),
      projectIdValid: !!env.projectId,
      appIdValid: env.appId?.includes(':web:'),
    }
  });
}
