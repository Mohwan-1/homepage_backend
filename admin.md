# 관리자 대시보드 생성 프롬프트

```
관리자 전용 대시보드를 생성해주세요.

## 1. 관리자 인증 및 접근 제어

관리자 역할 확인:
- 사용자 role이 'admin'인 경우에만 접근 허용
- 비관리자 접근 시 403 에러 또는 메인 페이지로 리다이렉트
- URL: /admin

인증 가드:
```typescript
// components/auth/admin-guard.tsx
interface AdminGuardProps {
  children: React.ReactNode;
}

// 관리자 권한 확인 로직
const isAdmin = userProfile?.role === 'admin';

```

## 2. 관리자 대시보드 메인 (/admin)

파일: app/admin/page.tsx

대시보드 위젯:

1. 주요 지표 카드들 (4개 가로 배치)
    - 총 사용자 수
    - 오늘 신규 가입자
    - 총 주문 수
    - 총 매출액
2. 차트 섹션 (2열 배치)
    - 월별 매출 그래프 (선형 차트)
    - 상품별 판매량 (막대 차트)
3. 최근 활동 테이블
    - 최근 가입자 (5명)
    - 최근 주문 (10건)
4. 빠른 액션 버튼들
    - 사용자 관리
    - 상품 관리
    - 주문 관리
    - 시스템 설정

지표 카드 구조:

```tsx
interface DashboardMetric {
  title: string;
  value: number | string;
  change?: number; // 전일 대비 증감률
  icon: string;
  color: 'blue' | 'green' | 'purple' | 'orange';
}

```

## 3. 사용자 관리 페이지 (/admin/users)

파일: app/admin/users/page.tsx

기능:

1. 사용자 목록 테이블
    - ID, 이름, 이메일, 가입일, 역할, 상태
    - 정렬 기능 (이름, 가입일 등)
    - 검색 기능 (이름, 이메일)
2. 필터링 옵션
    - 역할별 (전체, 사용자, 관리자)
    - 상태별 (활성, 비활성, 정지)
    - 가입일 범위
3. 사용자 액션
    - 상세보기 모달
    - 역할 변경
    - 계정 상태 변경 (활성/비활성)
    - 계정 삭제
4. 페이지네이션
    - 페이지당 20명 표시
    - 페이지 번호 네비게이션

테이블 컬럼:

```tsx
interface UserTableData {
  id: string;
  name: string;
  email: string;
  role: 'user' | 'admin';
  status: 'active' | 'inactive' | 'suspended';
  createdAt: string;
  lastLoginAt?: string;
}

```

## 4. 상품 관리 페이지 (/admin/products)

파일: app/admin/products/page.tsx

기능:

1. 상품 목록
    - 상품 이미지, 이름, 가격, 재고, 상태
    - 카테고리별 필터
    - 가격 범위 필터
2. 상품 관리 액션
    - 새 상품 추가 버튼
    - 상품 수정 (인라인 편집)
    - 상품 삭제
    - 재고 관리
3. 상품 상태 관리
    - 판매중/품절/단종
    - 노출/숨김 설정

상품 데이터 구조:

```tsx
interface ProductAdmin {
  id: string;
  name: string;
  price: number;
  stock: number;
  category: string;
  status: 'active' | 'inactive' | 'discontinued';
  isVisible: boolean;
  createdAt: string;
  updatedAt: string;
}

```

## 5. 주문 관리 페이지 (/admin/orders)

파일: app/admin/orders/page.tsx

기능:

1. 주문 목록
    - 주문번호, 고객명, 주문일, 상태, 금액
    - 주문 상태별 필터
    - 날짜 범위 필터
2. 주문 상태 관리
    - 결제확인 → 배송준비 → 배송중 → 배송완료
    - 주문 취소/환불 처리
3. 주문 상세보기
    - 고객 정보
    - 주문 상품 목록
    - 배송 정보
    - 결제 정보

주문 상태:

```tsx
type OrderStatus =
  | 'pending'     // 결제 대기
  | 'paid'        // 결제 완료
  | 'preparing'   // 배송 준비
  | 'shipping'    // 배송중
  | 'delivered'   // 배송 완료
  | 'cancelled'   // 취소
  | 'refunded';   // 환불

```

## 6. 시스템 설정 페이지 (/admin/settings)

파일: app/admin/settings/page.tsx

설정 카테고리:

1. 사이트 설정
    - 사이트명, 로고
    - 연락처 정보
    - 소셜미디어 링크
2. 결제 설정
    - 결제 방법 활성화/비활성화
    - 수수료 설정
3. 알림 설정
    - 관리자 알림 (신규 주문, 문의)
    - 고객 알림 템플릿
4. 시스템 정보
    - 서버 상태
    - 데이터베이스 상태
    - 최근 백업 정보

## 7. 관리자 사이드바 네비게이션

파일: components/admin/admin-sidebar.tsx

메뉴 구조:

```tsx
const adminMenuItems = [
  {
    title: '대시보드',
    href: '/admin',
    icon: 'BarChart3'
  },
  {
    title: '사용자 관리',
    href: '/admin/users',
    icon: 'Users'
  },
  {
    title: '상품 관리',
    href: '/admin/products',
    icon: 'Package'
  },
  {
    title: '주문 관리',
    href: '/admin/orders',
    icon: 'ShoppingCart'
  },
  {
    title: '시스템 설정',
    href: '/admin/settings',
    icon: 'Settings'
  }
]

```

## 8. 관리자 레이아웃

파일: app/admin/layout.tsx

구조:

- AdminGuard로 전체 감싸기
- 관리자 전용 헤더 (일반 사이트와 구분)
- 사이드바 + 메인 콘텐츠 영역
- 브레드크럼 네비게이션

```tsx
export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <AdminGuard>
      <div className="min-h-screen bg-gray-100">
        <AdminHeader />
        <div className="flex">
          <AdminSidebar />
          <main className="flex-1 p-8">
            <AdminBreadcrumb />
            {children}
          </main>
        </div>
      </div>
    </AdminGuard>
  )
}

```

## 9. 관리자 헤더

파일: components/admin/admin-header.tsx

구성:

- 왼쪽: "관리자 페이지" 타이틀
- 중앙: 빠른 검색 (사용자, 주문번호)
- 오른쪽: 알림 + 관리자 프로필 드롭다운

드롭다운 메뉴:

- 사이트로 돌아가기
- 내 계정 설정
- 로그아웃

## 10. 데이터 테이블 컴포넌트

파일: components/admin/data-table.tsx

기능:

- 정렬 (클릭으로 오름차순/내림차순)
- 페이지네이션
- 행 선택 (체크박스)
- 일괄 액션 (선택된 항목 삭제 등)
- 로딩 상태 표시

```tsx
interface DataTableProps<T> {
  data: T[];
  columns: ColumnDef<T>[];
  loading?: boolean;
  onRowClick?: (item: T) => void;
  actions?: TableAction<T>[];
}

interface TableAction<T> {
  label: string;
  onClick: (item: T) => void;
  variant?: 'default' | 'destructive';
}

```

## 11. 차트 컴포넌트

사용 라이브러리: recharts

설치:

```bash
npm install recharts

```

차트 타입:

- 선형 차트: 매출 추이
- 막대 차트: 상품별 판매량
- 원형 차트: 결제 방법별 비율
- 영역 차트: 사용자 증가 추이

## 12. 스타일링 가이드

관리자 테마:

- 배경: bg-gray-100 (일반 사이트와 구분)
- 사이드바: bg-white border-r
- 카드: bg-white shadow-sm rounded-lg
- 헤더: bg-white border-b

색상 구분:

- 성공: green-600
- 경고: yellow-600
- 위험: red-600
- 정보: blue-600

금지사항:

- 이모지 사용 금지
- 화려한 디자인 요소 금지
- 과도한 애니메이션 금지
- 실제 관리자 시스템처럼 기능적이고 실용적으로 제작
- 데이터 시각화에 집중
- 명확한 액션 버튼과 상태 표시

```

```