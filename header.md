# 1단계 .헤더 메뉴 확장 및 페이지 생성 프롬프트

```
헤더 네비게이션에 "회사소개", "상품" 메뉴를 추가하고 해당 페이지들을 생성해주세요.

## 1. 헤더 네비게이션 수정

메뉴 구조:
- 홈 (/)
- 회사소개 (/about)
- 상품 (/products)

네비게이션 배열:
```typescript
const navigationItems = [
  { name: '홈', href: '/' },
  { name: '회사소개', href: '/about' },
  { name: '상품', href: '/products' }
]

```

활성 페이지 표시:

- 현재 페이지 하이라이트: text-blue-600
- 기본 메뉴: text-gray-700 hover:text-blue-600
- 활성 표시: 하단 언더라인 또는 배경색 변경

## 2단계. 회사소개 페이지 (/about)

파일: app/about/page.tsx

페이지 구조:

1. 페이지 헤더
    - 제목: "회사소개"
    - 부제목: 간단한 소개 문구
2. 회사 개요 섹션
    - 설립연도, 직원수, 주요 실적
    - 2컬럼 레이아웃 (텍스트 + 이미지)
3. 미션 & 비전 섹션
    - 미션: 회사의 사명
    - 비전: 회사의 비전
    - 카드 형태로 표시
4. 핵심 가치 섹션
    - 3-4개 핵심 가치
    - 아이콘 + 제목 + 설명
5. 연혁 섹션
    - 주요 연혁 타임라인
    - 년도별 주요 사건

콘텐츠 가이드:

- 구체적인 수치 사용 ("2019년 설립", "50+ 직원")
- 전문적인 표현 ("신뢰할 수 있는", "검증된")
- 업계 관련 키워드 사용

## 3단계. 상품 페이지 (/products)

파일: app/products/page.tsx

페이지 구조:

1. 페이지 헤더
    - 제목: "상품 소개"
    - 부제목: 상품 관련 설명
2. 상품 카테고리 섹션
    - 카테고리별 탭 또는 필터
    - 예: "기본형", "프리미엄", "엔터프라이즈"
3. 상품 그리드
    - 각 상품별 카드
    - 이미지 + 제목 + 설명 + 가격 + 버튼
4. 상품 비교표
    - 기능별 비교표
    - 체크박스 형태로 기능 표시
5. FAQ 섹션
    - 상품 관련 자주 묻는 질문
    - 아코디언 형태

상품 카드 구성:

```tsx
interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  features: string[];
  image?: string;
  popular?: boolean;
}

```

## 4단계. 공통 레이아웃 컴포넌트

파일: components/layout/page-header.tsx

```tsx
interface PageHeaderProps {
  title: string;
  subtitle?: string;
  breadcrumb?: { name: string; href: string }[];
}

```

## 5단계. 스타일링 가이드

페이지 공통 스타일:

- 컨테이너: max-w-7xl mx-auto px-6
- 섹션 간격: py-16 lg:py-24
- 제목: text-3xl lg:text-4xl font-bold
- 부제목: text-xl text-gray-600

카드 스타일:

- 배경: bg-white
- 테두리: border border-gray-200
- 그림자: shadow-sm hover:shadow-md
- 모서리: rounded-lg
- 패딩: p-6

버튼 스타일:

- 기본: bg-blue-600 text-white px-6 py-3 rounded-lg
- 호버: hover:bg-blue-700
- 보조: bg-gray-100 text-gray-900 hover:bg-gray-200

## 6단계. SEO 최적화

각 페이지별 메타데이터:

```tsx
// app/about/page.tsx
export const metadata = {
  title: '회사소개 | 회사명',
  description: '회사 소개 설명...',
}

// app/products/page.tsx
export const metadata = {
  title: '상품소개 | 회사명',
  description: '상품 소개 설명...',
}

```

## 7단계. 반응형 디자인

브레이크포인트:

- 모바일: 기본 (1열 그리드)
- 태블릿: md: (2열 그리드)
- 데스크톱: lg: (3열 그리드)

## 8단계. 내비게이션 하이라이트

usePathname을 사용한 활성 메뉴 표시:

```tsx
import { usePathname } from 'next/navigation'

const pathname = usePathname()
const isActive = pathname === item.href

```

금지사항:

- 이모지, 그라데이션 사용 금지
- AI스러운 키워드 금지 ("혁신적인", "차세대" 등)
- 화려한 애니메이션 금지
- 전문적이고 신뢰할 수 있는 느낌만 유지
- 구체적이고 실용적인 내용만 사용

```
위 모든 내용을 바탕으로 1단계부터 ~ 8단계까지 순서대로 작업 진행해
```