# Firestore Database Schema

## Collections Structure

### 1. users
사용자 정보 저장
```typescript
{
  uid: string;                    // Firebase Auth UID (Document ID)
  email: string;                  // 이메일
  name: string;                   // 이름
  phone?: string;                 // 전화번호 (선택)
  role: 'user' | 'admin';         // 사용자 역할
  createdAt: Timestamp;           // 가입일
  updatedAt?: Timestamp;          // 수정일
}
```

### 2. products
상품 정보 저장
```typescript
{
  id: string;                     // 상품 ID (Document ID)
  name: string;                   // 상품명
  price: number;                  // 가격
  description: string;            // 설명
  category: string;               // 카테고리
  imageUrl?: string;              // 이미지 URL
  stock: number;                  // 재고
  status: 'active' | 'inactive';  // 상태
  createdAt: Timestamp;           // 등록일
  updatedAt?: Timestamp;          // 수정일
}
```

### 3. orders
주문 정보 저장
```typescript
{
  orderId: string;                // 주문 ID (Document ID)
  userId: string;                 // 사용자 UID
  items: [                        // 주문 상품
    {
      id: string;
      name: string;
      price: number;
      quantity: number;
    }
  ];
  totalAmount: number;            // 총 금액
  orderInfo: {                    // 주문자 정보
    name: string;
    email: string;
    phone: string;
    address: string;
    detailAddress?: string;
    zipCode?: string;
  };
  paymentMethod: 'card' | 'transfer' | 'toss';  // 결제 방법
  paymentKey?: string;            // 토스페이먼츠 결제 키
  status: 'pending' | 'paid' | 'pending_transfer' | 'cancelled';  // 주문 상태
  createdAt: Timestamp;           // 주문일
  paidAt?: Timestamp;             // 결제일
  updatedAt?: Timestamp;          // 수정일
}
```

### 4. reviews
강의 후기 저장
```typescript
{
  id: string;                     // 후기 ID (Document ID)
  userId?: string;                // 작성자 UID (선택)
  name: string;                   // 작성자 이름
  title: string;                  // 제목
  content: string;                // 내용
  course: string;                 // 수강 강의
  rating: number;                 // 별점 (1-5)
  files: string[];                // 첨부 파일 URL 배열
  status: 'pending' | 'approved' | 'rejected';  // 승인 상태
  createdAt: Timestamp;           // 작성일
  approvedAt?: Timestamp;         // 승인일
  approvedBy?: string;            // 승인자 UID
}
```

## Security Rules

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {

    // 사용자 컬렉션
    match /users/{userId} {
      allow read: if request.auth != null;
      allow create: if request.auth.uid == userId;
      allow update: if request.auth.uid == userId ||
                       get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin';
      allow delete: if get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin';
    }

    // 상품 컬렉션
    match /products/{productId} {
      allow read: if true;  // 모든 사용자 조회 가능
      allow create, update, delete: if request.auth != null &&
                                        get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin';
    }

    // 주문 컬렉션
    match /orders/{orderId} {
      allow read: if request.auth != null &&
                     (resource.data.userId == request.auth.uid ||
                      get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin');
      allow create: if request.auth != null && request.resource.data.userId == request.auth.uid;
      allow update: if request.auth != null &&
                       get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin';
      allow delete: if get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin';
    }

    // 리뷰 컬렉션
    match /reviews/{reviewId} {
      allow read: if resource.data.status == 'approved';  // 승인된 리뷰만 조회 가능
      allow create: if request.auth != null;
      allow update, delete: if request.auth != null &&
                              get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin';
    }
  }
}
```

## Storage Rules

```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {

    // 리뷰 이미지
    match /reviews/{allPaths=**} {
      allow read: if true;
      allow write: if request.auth != null &&
                      request.resource.size < 5 * 1024 * 1024 &&  // 5MB 제한
                      request.resource.contentType.matches('image/.*');
    }

    // 상품 이미지
    match /products/{allPaths=**} {
      allow read: if true;
      allow write: if request.auth != null &&
                      get(/firestore/databases/(default)/documents/users/$(request.auth.uid)).data.role == 'admin' &&
                      request.resource.size < 10 * 1024 * 1024 &&  // 10MB 제한
                      request.resource.contentType.matches('image/.*');
    }
  }
}
```

## Indexes

### Composite Indexes
Firebase Console에서 생성 필요:

1. **reviews** collection:
   - Fields: `status` (Ascending) + `createdAt` (Descending)
   - 용도: 승인된 리뷰를 최신순으로 조회

2. **orders** collection:
   - Fields: `userId` (Ascending) + `createdAt` (Descending)
   - 용도: 사용자별 주문 내역 조회

3. **products** collection:
   - Fields: `category` (Ascending) + `createdAt` (Descending)
   - 용도: 카테고리별 상품 조회

## Migration Plan

### Phase 1: Authentication (완료)
- ✅ Firebase Authentication 연동
- ✅ 로그인/회원가입 Firebase 연결
- ✅ AuthContext 구현

### Phase 2: Reviews (완료)
- ✅ 리뷰 작성 Firestore 저장
- ✅ 리뷰 목록 Firestore 조회
- ✅ Firebase Storage 이미지 업로드

### Phase 3: Products (예정)
- [ ] 상품 데이터 Firestore 마이그레이션
- [ ] 상품 목록 Firestore 조회
- [ ] 관리자 상품 관리 기능

### Phase 4: Orders (예정)
- [ ] 주문 데이터 Firestore 저장
- [ ] TossPayments 결제 후 Firestore 저장
- [ ] 주문 내역 조회

### Phase 5: Admin (예정)
- [ ] 관리자 대시보드 Firestore 연동
- [ ] 사용자 관리
- [ ] 주문 관리
- [ ] 리뷰 승인 시스템

## Data Flow

### 회원가입/로그인
```
User → Firebase Auth → Firestore users collection → AuthContext
```

### 리뷰 작성
```
User → ReviewForm → Firebase Storage (images) → Firestore reviews collection → Admin approval → Public display
```

### 주문 프로세스
```
User → Cart → Checkout → TossPayments → Firestore orders collection → Order confirmation
```

### 상품 조회
```
Client → Firestore products collection → Product list display
```
