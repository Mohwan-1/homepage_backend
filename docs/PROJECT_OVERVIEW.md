# 프로젝트 전체 개요

## 프로젝트 정보
- **프로젝트명**: YouTube Content School (중장년을 위한 유튜브 채널 성장 로드맵)
- **기술 스택**: Next.js 14, TypeScript, Firebase, TailwindCSS, TossPayments
- **목적**: 중장년층을 대상으로 한 유튜브 채널 성장 교육 플랫폼

## 핵심 기능

### 1. 사용자 인증 (Firebase Authentication)
- 이메일/비밀번호 로그인
- Google OAuth 로그인 (리다이렉트 방식)
- 회원가입 및 프로필 관리
- 역할 기반 권한 관리 (user/admin)

### 2. 강의 상품 시스템
- 4가지 강의 상품 제공
- 장바구니 기능 (Context API 기반)
- 상품 상세 페이지

### 3. 결제 시스템 (TossPayments)
- 카드 결제
- 무통장 입금
- 결제 성공/실패 처리
- 주문 내역 관리

### 4. 리뷰 시스템
- 강의 후기 작성 (이미지 업로드 가능)
- Firebase Storage 연동
- 실시간 리뷰 표시 (관리자 승인 없이 즉시 게시)
- 홈페이지 리뷰 캐러셀

### 5. 마이페이지
- 사용자 프로필 관리
- 주문 내역 조회
- 배송지 관리
- 포인트 내역 (준비중)

### 6. 관리자 페이지
- 대시보드 (통계 및 지표)
- 사용자 관리
- 상품 관리
- 주문 관리
- 시스템 설정

## 주요 페이지 구조

### 공개 페이지
- `/` - 홈페이지 (히어로, 강의 소개, 후기 등)
- `/products` - 강의 상품 목록
- `/products/[id]` - 상품 상세
- `/reviews` - 전체 후기 목록
- `/reviews/write` - 후기 작성
- `/support` - 고객센터

### 인증 필요 페이지
- `/checkout` - 결제 페이지
- `/mypage` - 마이페이지 대시보드
- `/mypage/profile` - 프로필 관리
- `/mypage/orders` - 주문 내역
- `/mypage/points` - 포인트 내역

### 관리자 전용
- `/admin` - 관리자 대시보드
- `/admin/users` - 사용자 관리
- `/admin/products` - 상품 관리
- `/admin/orders` - 주문 관리
- `/admin/settings` - 시스템 설정

## Firebase 구조

### Authentication
- 이메일/비밀번호 인증
- Google OAuth 제공자

### Firestore Collections

#### users
```typescript
{
  uid: string;
  email: string;
  name: string;
  phone?: string;
  birthDate?: string;
  role: 'user' | 'admin';
  createdAt: string;
}
```

#### orders
```typescript
{
  orderId: string;
  userId: string;
  items: OrderItem[];
  totalAmount: number;
  status: 'pending' | 'paid' | 'shipping' | 'delivered' | 'cancelled';
  orderInfo: {
    name: string;
    email: string;
    phone: string;
    address: string;
    detailAddress: string;
    zipCode: string;
  };
  createdAt: Timestamp;
}
```

#### reviews
```typescript
{
  name: string;
  title: string;
  content: string;
  course: string;
  rating: number;
  files: string[];
  status: 'approved';
  createdAt: Timestamp;
}
```

#### addresses
```typescript
{
  userId: string;
  name: string;
  address: string;
  detailAddress: string;
  zipCode: string;
  isDefault: boolean;
}
```

### Storage
- `/reviews/{timestamp}_{filename}` - 리뷰 이미지

## 환경 변수 (.env.local)

### Firebase
```
NEXT_PUBLIC_FIREBASE_API_KEY=
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=
NEXT_PUBLIC_FIREBASE_PROJECT_ID=
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=
NEXT_PUBLIC_FIREBASE_APP_ID=
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=
```

### TossPayments
```
NEXT_PUBLIC_TOSS_CLIENT_KEY=
TOSS_SECRET_KEY=
TOSS_SECURITY_KEY=
```

## 주요 기능 흐름

### 회원가입 및 로그인
1. 사용자 이메일/비밀번호 또는 Google 로그인
2. Firebase Authentication으로 인증
3. Firestore `users` 컬렉션에 사용자 정보 저장
4. AuthContext로 전역 상태 관리

### 상품 구매
1. 상품 페이지에서 장바구니 추가
2. 장바구니에서 수량 조절
3. 결제 페이지에서 배송 정보 입력
4. TossPayments로 결제 진행
5. 결제 성공 시 Firestore에 주문 저장
6. 홈으로 자동 리다이렉트

### 리뷰 작성
1. 리뷰 작성 페이지에서 내용 입력
2. 이미지 업로드 (최대 5개, 각 5MB)
3. Firebase Storage에 이미지 저장
4. Firestore에 리뷰 저장 (status: 'approved')
5. 홈페이지에 즉시 표시

## 네비게이션

### 모든 세부 페이지 공통
- 뒤로가기 버튼
- 홈으로 버튼

### 작업 완료 후 자동 리다이렉트
- 리뷰 작성 완료 → 홈
- 결제 완료 → 2초 후 홈

## 스타일링
- **프레임워크**: TailwindCSS
- **컬러 스킴**:
  - Primary: Blue-600
  - Success: Green-600
  - Warning: Yellow-600
  - Danger: Red-600
- **반응형**: Mobile-first 디자인

## 최근 주요 변경사항

### Google 로그인 수정
- 팝업 방식 → 리다이렉트 방식 변경
- CORS 정책 이슈 해결
- `signInWithRedirect` 및 `getRedirectResult` 사용

### 리뷰 시스템 개선
- 관리자 승인 제거 (즉시 게시)
- 홈페이지 리뷰 표시 최적화
- orderBy 쿼리 제거, 클라이언트 정렬

### Firebase 백엔드 연동
- 모든 페이지 Firebase 연동 완료
- localStorage → Firestore 마이그레이션
- 실시간 데이터 동기화

## 향후 개선사항
- [ ] 포인트 시스템 구현
- [ ] 주문 상태 업데이트 기능
- [ ] 관리자 리뷰 관리 기능
- [ ] 이메일 알림 기능
- [ ] 결제 취소/환불 기능
