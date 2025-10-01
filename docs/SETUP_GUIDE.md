# 프로젝트 설치 및 설정 가이드

## 1. 시스템 요구사항
- Node.js 18.x 이상
- npm 또는 yarn
- Git
- Firebase 프로젝트 (무료 플랜 가능)
- TossPayments 계정

## 2. 프로젝트 클론 및 설치

```bash
# 프로젝트 클론
git clone <repository-url>
cd Homepage-backend

# 의존성 설치
npm install
```

## 3. Firebase 설정

### 3.1 Firebase 프로젝트 생성
1. [Firebase Console](https://console.firebase.google.com) 접속
2. 새 프로젝트 생성: `youtube-content-school`
3. Google Analytics 활성화 (선택사항)

### 3.2 Firebase Authentication 설정
1. Authentication 메뉴 선택
2. "Sign-in method" 탭
3. 다음 제공자 활성화:
   - 이메일/비밀번호
   - Google

**Google OAuth 설정 시 주의사항:**
- 승인된 도메인에 `localhost` 추가
- 승인된 리디렉션 URI 설정

### 3.3 Firestore Database 설정
1. Firestore Database 메뉴 선택
2. 데이터베이스 생성 (테스트 모드로 시작)
3. 보안 규칙 설정:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users collection
    match /users/{userId} {
      allow read: if request.auth != null;
      allow write: if request.auth != null && request.auth.uid == userId;
    }

    // Orders collection
    match /orders/{orderId} {
      allow read: if request.auth != null &&
        (request.auth.uid == resource.data.userId ||
         get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin');
      allow write: if request.auth != null;
    }

    // Reviews collection
    match /reviews/{reviewId} {
      allow read: if true;
      allow write: if request.auth != null;
    }

    // Addresses collection
    match /addresses/{addressId} {
      allow read, write: if request.auth != null &&
        request.auth.uid == resource.data.userId;
    }
  }
}
```

### 3.4 Firebase Storage 설정
1. Storage 메뉴 선택
2. 시작하기 클릭
3. 보안 규칙 설정:

```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /reviews/{allPaths=**} {
      allow read: if true;
      allow write: if request.auth != null &&
        request.resource.size < 5 * 1024 * 1024; // 5MB limit
    }
  }
}
```

### 3.5 Firebase 웹 앱 추가
1. 프로젝트 설정 → 일반 탭
2. "앱 추가" → 웹 앱 선택
3. 앱 닉네임 입력: `YouTube Content School Web`
4. Firebase SDK 구성 정보 복사

## 4. TossPayments 설정

### 4.1 TossPayments 계정 생성
1. [TossPayments 개발자센터](https://developers.tosspayments.com) 접속
2. 회원가입 및 로그인
3. 테스트 환경 API 키 발급

### 4.2 API 키 확인
- 클라이언트 키 (NEXT_PUBLIC_TOSS_CLIENT_KEY)
- 시크릿 키 (TOSS_SECRET_KEY)
- 보안 키 (TOSS_SECURITY_KEY)

## 5. 환경 변수 설정

프로젝트 루트에 `.env.local` 파일 생성:

```env
# Firebase Configuration
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=your_measurement_id

# TossPayments Configuration
NEXT_PUBLIC_TOSS_CLIENT_KEY=test_ck_xxxxx
TOSS_SECRET_KEY=test_sk_xxxxx
TOSS_SECURITY_KEY=test_gck_xxxxx
```

## 6. 개발 서버 실행

```bash
# 개발 서버 시작
npm run dev

# 브라우저에서 확인
# http://localhost:3000
```

## 7. 관리자 계정 생성

### 방법 1: 수동 설정
1. 일반 회원가입으로 계정 생성
2. Firebase Console → Firestore Database
3. `users` 컬렉션에서 해당 사용자 찾기
4. `role` 필드를 `admin`으로 변경

### 방법 2: 스크립트 실행
```bash
# 관리자 계정 생성 스크립트 (준비 예정)
npm run create-admin
```

## 8. 프로덕션 배포

### Vercel 배포 (권장)
```bash
# Vercel CLI 설치
npm i -g vercel

# 배포
vercel

# 프로덕션 배포
vercel --prod
```

### 환경 변수 설정
Vercel 대시보드에서 모든 `.env.local` 변수를 추가

### Firebase 보안 규칙 업데이트
프로덕션 환경에 맞게 Firestore 및 Storage 규칙 강화

## 9. 테스트 계정

### TossPayments 테스트 카드
- 카드번호: 4330-1234-5678-9012
- 유효기간: 아무 미래 날짜
- CVC: 아무 3자리 숫자

## 10. 문제 해결

### Google 로그인 실패
- Firebase Console에서 OAuth 도메인 확인
- 리다이렉트 URI 설정 확인
- 브라우저 쿠키 설정 확인

### Firestore 권한 오류
- 보안 규칙 확인
- 사용자 인증 상태 확인
- Firebase 인덱스 생성 필요 시 콘솔에서 링크 클릭

### 이미지 업로드 실패
- Storage 규칙 확인
- 파일 크기 제한 (5MB) 확인
- 네트워크 연결 확인

## 11. 주요 명령어

```bash
# 개발 서버
npm run dev

# 프로덕션 빌드
npm run build

# 프로덕션 서버 실행
npm start

# 타입 체크
npm run type-check

# 린트
npm run lint
```

## 12. 참고 문서
- [Next.js 공식 문서](https://nextjs.org/docs)
- [Firebase 공식 문서](https://firebase.google.com/docs)
- [TossPayments 개발자 가이드](https://docs.tosspayments.com)
- [TailwindCSS 공식 문서](https://tailwindcss.com/docs)
