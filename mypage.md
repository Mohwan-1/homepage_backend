# 사용자 마이페이지 메뉴 및 페이지 생성 프롬프트

```
네비게이션에 사용자 마이페이지 메뉴를 추가하고 관련 페이지들을 생성해주세요.

## 1. 헤더 네비게이션 수정

로그인 상태별 메뉴 구조:

비로그인 상태:
- 홈 (/)
- 회사소개 (/about)
- 상품 (/products)
- 로그인/회원가입 버튼

로그인 상태:
- 홈 (/)
- 회사소개 (/about)
- 상품 (/products)
- 마이페이지 (/mypage)
- 사용자 드롭다운 (프로필 이미지 + 이름)

드롭다운 메뉴:
- 내 정보 (/mypage/profile)
- 주문내역 (/mypage/orders)
- 설정 (/mypage/settings)
- 로그아웃

## 2. 마이페이지 메인 (/mypage)

파일: app/mypage/page.tsx

페이지 구조:
1. 사용자 정보 요약 카드
   - 프로필 이미지
   - 이름, 이메일
   - 가입일, 등급

2. 대시보드 위젯들
   - 최근 주문 (3개)
   - 포인트/적립금 현황
   - 알림/공지사항
   - 빠른 액션 버튼들

3. 메뉴 네비게이션 카드
   - 내 정보 관리
   - 주문/배송 조회
   - 포인트 내역
   - 고객센터

레이아웃:
- 좌측: 사이드바 네비게이션 (데스크톱)
- 우측: 메인 콘텐츠 영역
- 모바일: 상단 탭 네비게이션

## 3. 내 정보 페이지 (/mypage/profile)

파일: app/mypage/profile/page.tsx

섹션들:
1. 기본 정보 수정
   - 프로필 이미지 업로드
   - 이름, 전화번호
   - 생년월일

2. 계정 정보
   - 이메일 (수정 불가)
   - 비밀번호 변경 버튼

3. 주소 관리
   - 기본 배송지
   - 추가 배송지 목록
   - 새 주소 추가 버튼

폼 구성:
```typescript
interface UserProfile {
  name: string;
  phone: string;
  birthDate?: string;
  profileImage?: string;
  addresses: Address[];
}

interface Address {
  id: string;
  name: string;
  address: string;
  detailAddress: string;
  zipCode: string;
  isDefault: boolean;
}

```

## 4. 주문내역 페이지 (/mypage/orders)

파일: app/mypage/orders/page.tsx

기능:

1. 주문 필터링
    - 기간별 (1개월, 3개월, 6개월, 1년)
    - 상태별 (전체, 결제완료, 배송중, 배송완료, 취소)
2. 주문 목록
    - 주문번호, 주문일
    - 상품 이미지 + 이름
    - 수량, 가격
    - 주문 상태
    - 액션 버튼 (상세보기, 취소, 리뷰)
3. 페이지네이션
    - 페이지 번호
    - 이전/다음 버튼

주문 데이터 구조:

```tsx
interface Order {
  id: string;
  orderNumber: string;
  orderDate: string;
  status: 'pending' | 'paid' | 'shipping' | 'delivered' | 'cancelled';
  items: OrderItem[];
  totalAmount: number;
  shippingAddress: Address;
}

interface OrderItem {
  productId: string;
  productName: string;
  productImage: string;
  quantity: number;
  price: number;
}

```

## 5. 설정 페이지 (/mypage/settings)

파일: app/mypage/settings/page.tsx

설정 카테고리:

1. 알림 설정
    - 이메일 알림 (주문, 배송, 마케팅)
    - SMS 알림
    - 푸시 알림
2. 개인정보 설정
    - 개인정보 처리방침 동의
    - 마케팅 정보 수신 동의
    - 제3자 정보제공 동의
3. 계정 관리
    - 비밀번호 변경
    - 이메일 변경
    - 회원탈퇴

## 6. 사이드바 네비게이션 컴포넌트

파일: components/mypage/sidebar-nav.tsx

메뉴 구조:

```tsx
const sidebarItems = [
  {
    title: '마이페이지',
    href: '/mypage',
    icon: 'Home'
  },
  {
    title: '내 정보',
    href: '/mypage/profile',
    icon: 'User'
  },
  {
    title: '주문내역',
    href: '/mypage/orders',
    icon: 'ShoppingBag'
  },
  {
    title: '설정',
    href: '/mypage/settings',
    icon: 'Settings'
  }
]

```

스타일링:

- 활성 메뉴: bg-blue-50 text-blue-600 border-r-2 border-blue-600
- 기본 메뉴: text-gray-700 hover:text-gray-900 hover:bg-gray-50

## 7. 인증 가드 (AuthGuard)

파일: components/auth/auth-guard.tsx

기능:

- 로그인 여부 확인
- 비로그인 시 로그인 페이지로 리다이렉트
- 로딩 상태 표시

```tsx
interface AuthGuardProps {
  children: React.ReactNode;
  redirectTo?: string;
}

```

## 8. 마이페이지 레이아웃

파일: app/mypage/layout.tsx

구조:

- AuthGuard로 감싸기
- 데스크톱: 사이드바 + 메인 콘텐츠
- 모바일: 상단 탭 네비게이션

```tsx
export default function MypageLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <AuthGuard>
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="lg:grid lg:grid-cols-4 lg:gap-8">
            <div className="lg:col-span-1">
              <SidebarNav />
            </div>
            <div className="lg:col-span-3">
              {children}
            </div>
          </div>
        </div>
      </div>
    </AuthGuard>
  )
}

```

## 9. 스타일링 가이드

카드 스타일:

- 배경: bg-white
- 테두리: border border-gray-200
- 그림자: shadow-sm
- 모서리: rounded-lg
- 패딩: p-6

폼 스타일:

- 입력필드: border border-gray-300 rounded-md px-3 py-2
- 레이블: text-sm font-medium text-gray-700
- 버튼: bg-blue-600 text-white px-4 py-2 rounded-md

테이블 스타일:

- 헤더: bg-gray-50 text-gray-700 font-medium
- 셀: py-4 px-6 border-b border-gray-200
- 호버: hover:bg-gray-50

## 10. 반응형 디자인

브레이크포인트:

- 모바일: 기본 (사이드바 숨김, 탭 네비게이션)
- 태블릿: md: (사이드바 표시)
- 데스크톱: lg: (전체 레이아웃)

금지사항:

- 이모지 사용 금지
- 화려한 색상 조합 금지
- 과도한 애니메이션 금지
- AI스러운 디자인 요소 금지
- 전문적이고 실용적인 느낌 유지
- 실제 서비스처럼 구체적인 기능 구현