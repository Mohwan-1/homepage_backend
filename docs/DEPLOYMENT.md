# 배포 가이드

## 보안 체크리스트

### ✅ 완료된 보안 설정
- [x] `.env.local` 파일이 `.gitignore`에 포함됨
- [x] `.env` 파일도 `.gitignore`에 포함됨
- [x] `.env.example` 파일 생성 (실제 값 없음)
- [x] 코드 내 하드코딩된 API 키 없음
- [x] Firebase 및 TossPayments 키는 모두 환경 변수 사용

### 🔒 민감한 정보 관리

**절대 커밋하지 말 것:**
- `.env.local` - 로컬 환경 변수
- `.env` - 환경 변수
- Firebase 서비스 계정 JSON 파일
- API 키, 시크릿 키

**Git에 포함해도 되는 것:**
- `.env.example` - 예시 파일 (실제 값 없음)
- 공개 설정 파일

## Vercel 배포

### 1. 프로젝트 준비
```bash
# 프로덕션 빌드 테스트
npm run build

# 빌드 성공 확인
npm start
```

### 2. Vercel 배포
```bash
# Vercel CLI 설치 (처음 한 번만)
npm i -g vercel

# Vercel 로그인
vercel login

# 프로젝트 배포
vercel

# 프로덕션 배포
vercel --prod
```

### 3. 환경 변수 설정
Vercel 대시보드에서 다음 환경 변수 추가:

**Settings → Environment Variables**

모든 `.env.local`의 변수를 복사해서 추가:
- `NEXT_PUBLIC_FIREBASE_API_KEY`
- `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN`
- `NEXT_PUBLIC_FIREBASE_PROJECT_ID`
- `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET`
- `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID`
- `NEXT_PUBLIC_FIREBASE_APP_ID`
- `NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID`
- `NEXT_PUBLIC_TOSS_CLIENT_KEY`
- `TOSS_SECRET_KEY`
- `TOSS_SECURITY_KEY`

**주의:** Production, Preview, Development 환경에 맞게 설정

### 4. Firebase 도메인 설정
Firebase Console에서 배포 도메인 추가:
1. Authentication → Settings → Authorized domains
2. Vercel 도메인 추가 (예: `your-app.vercel.app`)
3. 커스텀 도메인도 추가 (있는 경우)

## Firebase 프로덕션 설정

### 1. Firestore 보안 규칙 업데이트
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Helper functions
    function isSignedIn() {
      return request.auth != null;
    }

    function isOwner(userId) {
      return request.auth.uid == userId;
    }

    function isAdmin() {
      return isSignedIn() &&
        get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin';
    }

    // Users collection
    match /users/{userId} {
      allow read: if isSignedIn();
      allow write: if isOwner(userId) || isAdmin();
    }

    // Orders collection
    match /orders/{orderId} {
      allow read: if isSignedIn() &&
        (isOwner(resource.data.userId) || isAdmin());
      allow create: if isSignedIn();
      allow update: if isAdmin();
      allow delete: if isAdmin();
    }

    // Reviews collection
    match /reviews/{reviewId} {
      allow read: if resource.data.status == 'approved';
      allow create: if isSignedIn();
      allow update, delete: if isAdmin();
    }

    // Addresses collection
    match /addresses/{addressId} {
      allow read, write: if isSignedIn() && isOwner(resource.data.userId);
    }
  }
}
```

### 2. Storage 보안 규칙
```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /reviews/{allPaths=**} {
      allow read: if true;
      allow write: if request.auth != null &&
        request.resource.size < 5 * 1024 * 1024 &&
        request.resource.contentType.matches('image/.*');
    }
  }
}
```

### 3. Firestore 인덱스 생성
필요한 인덱스 (Firebase Console에서 자동 생성 링크 제공):
- `orders`: userId (asc), createdAt (desc)
- `reviews`: status (asc), createdAt (desc)

## TossPayments 프로덕션 설정

### 1. 프로덕션 키 발급
1. TossPayments 개발자센터 로그인
2. 실제 사업자 정보 등록
3. 프로덕션 API 키 발급
4. Vercel 환경 변수에 프로덕션 키 설정

### 2. Webhook 설정 (선택사항)
- Webhook URL: `https://your-domain.com/api/payments/webhook`
- 결제 상태 변경 시 알림 수신

## 성능 최적화

### 1. Next.js 최적화
```javascript
// next.config.js
module.exports = {
  images: {
    domains: ['firebasestorage.googleapis.com'],
    formats: ['image/avif', 'image/webp'],
  },
  compress: true,
  poweredByHeader: false,
}
```

### 2. 이미지 최적화
- Firebase Storage에 업로드 전 이미지 압축
- WebP 형식 사용 권장
- 적절한 이미지 크기 리사이징

### 3. 코드 스플리팅
```typescript
// 동적 import 사용
const AdminDashboard = dynamic(() => import('@/components/admin/dashboard'), {
  loading: () => <LoadingSpinner />,
  ssr: false,
});
```

## 모니터링 및 로깅

### 1. Firebase Analytics
- 자동으로 설정됨 (MEASUREMENT_ID 제공 시)
- 사용자 행동 추적

### 2. Vercel Analytics
```bash
npm install @vercel/analytics
```

```typescript
// app/layout.tsx
import { Analytics } from '@vercel/analytics/react';

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        {children}
        <Analytics />
      </body>
    </html>
  );
}
```

### 3. 에러 모니터링
```bash
npm install @sentry/nextjs
```

## 백업 및 복구

### 1. Firestore 백업
Firebase Console에서:
- Firestore → 백업 및 복원
- 자동 백업 스케줄 설정

### 2. Storage 백업
- Cloud Storage 버킷의 객체 버전 관리 활성화

## 배포 체크리스트

### 배포 전
- [ ] 로컬에서 프로덕션 빌드 테스트 (`npm run build`)
- [ ] 모든 환경 변수 Vercel에 설정
- [ ] Firebase 보안 규칙 업데이트
- [ ] Firebase 도메인 승인 추가
- [ ] TossPayments 프로덕션 키 설정

### 배포 후
- [ ] HTTPS 적용 확인
- [ ] 로그인/회원가입 테스트
- [ ] 결제 프로세스 테스트
- [ ] 관리자 페이지 접근 확인
- [ ] 이미지 업로드 테스트
- [ ] 모바일 반응형 확인

## 트러블슈팅

### 환경 변수가 적용되지 않음
```bash
# Vercel에서 재배포
vercel --prod --force
```

### Firebase 연결 오류
- Firebase 프로젝트 설정 확인
- API 키 정확성 확인
- 도메인 승인 여부 확인

### 결제 테스트 실패
- TossPayments 테스트/프로덕션 키 구분 확인
- Webhook URL 설정 확인

## 롤백 절차

### Vercel 롤백
```bash
# 이전 배포로 롤백
vercel rollback [deployment-url]
```

### Firebase 규칙 롤백
Firebase Console → Firestore → 규칙 → 이전 버전 복원

## 유지보수

### 정기 점검 (월 1회)
- [ ] Firebase 사용량 확인
- [ ] Vercel 사용량 확인
- [ ] 보안 업데이트 적용
- [ ] 의존성 업데이트 (`npm update`)
- [ ] 백업 상태 확인

### 보안 업데이트
```bash
# 취약점 검사
npm audit

# 자동 수정
npm audit fix

# 주요 버전 업데이트 (주의 필요)
npm audit fix --force
```
