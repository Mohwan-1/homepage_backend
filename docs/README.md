# YouTube Content School - 프로젝트 문서

중장년을 위한 유튜브 채널 성장 교육 플랫폼

## 📚 문서 목차

### 1. [프로젝트 전체 개요](./PROJECT_OVERVIEW.md)
- 프로젝트 정보 및 기술 스택
- 핵심 기능 설명
- 주요 페이지 구조
- Firebase 데이터 구조
- 최근 주요 변경사항

### 2. [설치 및 설정 가이드](./SETUP_GUIDE.md)
- 시스템 요구사항
- Firebase 프로젝트 설정
- TossPayments 연동
- 환경 변수 설정
- 개발 서버 실행
- 관리자 계정 생성

### 3. [API 및 데이터 참조](./API_REFERENCE.md)
- Firebase SDK 사용법
- TossPayments 결제 API
- Context API 사용
- 데이터 타입 정의
- 유틸리티 함수
- 에러 처리

### 4. [배포 가이드](./DEPLOYMENT.md)
- 보안 체크리스트
- Vercel 배포 방법
- Firebase 프로덕션 설정
- TossPayments 프로덕션 설정
- 성능 최적화
- 모니터링 및 로깅

## 🚀 빠른 시작

```bash
# 1. 의존성 설치
npm install

# 2. 환경 변수 설정
cp .env.example .env.local
# .env.local 파일을 열고 실제 값으로 수정

# 3. 개발 서버 실행
npm run dev
```

## 🔑 주요 환경 변수

`.env.local` 파일에 다음 변수를 설정하세요:

```env
# Firebase
NEXT_PUBLIC_FIREBASE_API_KEY=
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=
NEXT_PUBLIC_FIREBASE_PROJECT_ID=
# ... (자세한 내용은 .env.example 참조)

# TossPayments
NEXT_PUBLIC_TOSS_CLIENT_KEY=
TOSS_SECRET_KEY=
TOSS_SECURITY_KEY=
```

## 📂 프로젝트 구조

```
Homepage-backend/
├── app/                    # Next.js App Router 페이지
│   ├── admin/             # 관리자 페이지
│   ├── mypage/            # 마이페이지
│   ├── payment/           # 결제 관련 페이지
│   ├── products/          # 상품 페이지
│   └── reviews/           # 리뷰 페이지
├── components/            # React 컴포넌트
│   ├── admin/             # 관리자 컴포넌트
│   ├── auth/              # 인증 컴포넌트
│   ├── layout/            # 레이아웃 컴포넌트
│   ├── sections/          # 섹션 컴포넌트
│   └── ui/                # UI 컴포넌트
├── contexts/              # React Context
│   ├── auth-context.tsx   # 인증 상태 관리
│   └── cart-context.tsx   # 장바구니 상태 관리
├── lib/                   # 라이브러리 설정
│   ├── firebase.ts        # Firebase 초기화
│   └── toss-payments.ts   # TossPayments SDK
├── docs/                  # 프로젝트 문서
├── scripts/               # 유틸리티 스크립트
└── public/                # 정적 파일
```

## 🔐 보안 주의사항

### ⚠️ 절대 Git에 커밋하지 말 것
- `.env.local` - 로컬 환경 변수
- `.env` - 환경 변수 파일
- Firebase 서비스 계정 JSON
- API 키, 시크릿 키

### ✅ Git에 포함해도 되는 것
- `.env.example` - 예시 파일
- 공개 설정 파일
- 문서 파일

## 🛠️ 주요 명령어

```bash
# 개발 서버 실행
npm run dev

# 프로덕션 빌드
npm run build

# 프로덕션 서버 실행
npm start

# 타입 체크
npm run type-check

# 린트
npm run lint

# 리뷰 승인 (스크립트)
node scripts/update-reviews.mjs
```

## 📱 주요 기능

### 사용자 기능
- ✅ 이메일/비밀번호 회원가입 및 로그인
- ✅ Google OAuth 로그인
- ✅ 강의 상품 조회 및 구매
- ✅ 장바구니 기능
- ✅ TossPayments 결제
- ✅ 주문 내역 조회
- ✅ 강의 후기 작성 (이미지 업로드)
- ✅ 프로필 및 배송지 관리

### 관리자 기능
- ✅ 대시보드 (통계 및 지표)
- ✅ 사용자 관리
- ✅ 상품 관리
- ✅ 주문 관리
- ✅ 시스템 설정

## 🔄 최근 업데이트

### 2024년 10월
- Google OAuth 로그인 방식 변경 (팝업 → 리다이렉트)
- 리뷰 시스템 개선 (즉시 게시)
- Firebase 백엔드 완전 연동
- 모든 세부 페이지에 네비게이션 버튼 추가
- 작업 완료 후 홈 자동 리다이렉트

## 📞 문의 및 지원

### 문서 관련
- 설치 문제: [SETUP_GUIDE.md](./SETUP_GUIDE.md)
- API 사용법: [API_REFERENCE.md](./API_REFERENCE.md)
- 배포 관련: [DEPLOYMENT.md](./DEPLOYMENT.md)

### 기술 스택 문서
- [Next.js 공식 문서](https://nextjs.org/docs)
- [Firebase 공식 문서](https://firebase.google.com/docs)
- [TossPayments 개발자 가이드](https://docs.tosspayments.com)
- [TailwindCSS 공식 문서](https://tailwindcss.com/docs)

## 📝 라이선스

이 프로젝트는 교육 목적으로 제작되었습니다.

---

**마지막 업데이트**: 2024년 10월
