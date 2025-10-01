# API 및 데이터 구조 참조

## Firebase SDK 사용

### Authentication

#### 로그인
```typescript
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '@/lib/firebase';

const signIn = async (email: string, password: string) => {
  await signInWithEmailAndPassword(auth, email, password);
};
```

#### 회원가입
```typescript
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { auth, db } from '@/lib/firebase';

const signUp = async (email: string, password: string, name: string) => {
  const userCredential = await createUserWithEmailAndPassword(auth, email, password);
  const user = userCredential.user;

  await updateProfile(user, { displayName: name });

  await setDoc(doc(db, 'users', user.uid), {
    uid: user.uid,
    email: user.email!,
    name,
    role: 'user',
    createdAt: new Date().toISOString(),
  });
};
```

#### Google 로그인
```typescript
import { GoogleAuthProvider, signInWithRedirect, getRedirectResult } from 'firebase/auth';
import { auth } from '@/lib/firebase';

const signInWithGoogle = async () => {
  const provider = new GoogleAuthProvider();
  provider.setCustomParameters({ prompt: 'select_account' });
  await signInWithRedirect(auth, provider);
};

// 리다이렉트 결과 처리
useEffect(() => {
  const handleRedirectResult = async () => {
    const result = await getRedirectResult(auth);
    if (result?.user) {
      // 사용자 데이터 Firestore에 저장
    }
  };
  handleRedirectResult();
}, []);
```

### Firestore 데이터 작업

#### 문서 생성
```typescript
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase';

const createReview = async (reviewData: any) => {
  await addDoc(collection(db, 'reviews'), {
    ...reviewData,
    createdAt: serverTimestamp(),
    status: 'approved'
  });
};
```

#### 문서 조회
```typescript
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '@/lib/firebase';

const getOrders = async (userId: string) => {
  const q = query(
    collection(db, 'orders'),
    where('userId', '==', userId)
  );

  const querySnapshot = await getDocs(q);
  const orders: Order[] = [];

  querySnapshot.forEach((doc) => {
    orders.push({ id: doc.id, ...doc.data() } as Order);
  });

  return orders;
};
```

#### 문서 업데이트
```typescript
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';

const updateUserProfile = async (userId: string, data: any) => {
  await updateDoc(doc(db, 'users', userId), data);
};
```

#### 문서 삭제
```typescript
import { doc, deleteDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';

const deleteAddress = async (addressId: string) => {
  await deleteDoc(doc(db, 'addresses', addressId));
};
```

### Storage 파일 업로드

```typescript
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { storage } from '@/lib/firebase';

const uploadReviewImage = async (file: File) => {
  const timestamp = Date.now();
  const filename = `reviews/${timestamp}_${file.name}`;
  const storageRef = ref(storage, filename);

  await uploadBytes(storageRef, file);
  const url = await getDownloadURL(storageRef);

  return url;
};
```

## TossPayments 결제

### 결제 요청
```typescript
import { requestPayment } from '@/lib/toss-payments';

const handlePayment = async () => {
  await requestPayment({
    amount: 100000,
    orderId: 'ORDER_123',
    orderName: '유튜브 채널 시작 기초 외 1건',
    customerName: '홍길동',
    customerEmail: 'user@example.com',
    customerMobilePhone: '01012345678',
  });
};
```

### 결제 승인
```typescript
// app/payment/success/page.tsx
const confirmPayment = async (paymentKey: string, orderId: string, amount: number) => {
  const response = await fetch('/api/payments/confirm', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ paymentKey, orderId, amount }),
  });

  return response.json();
};
```

## Context API

### AuthContext 사용
```typescript
import { useAuth } from '@/contexts/auth-context';

const MyComponent = () => {
  const { user, userData, loading, signIn, signUp, signOut } = useAuth();

  if (loading) return <div>Loading...</div>;
  if (!user) return <div>Please login</div>;

  return (
    <div>
      <p>Welcome, {userData?.name}</p>
      <button onClick={signOut}>Logout</button>
    </div>
  );
};
```

### CartContext 사용
```typescript
import { useCart } from '@/contexts/cart-context';

const ProductCard = ({ product }) => {
  const { addItem, removeItem, items } = useCart();

  const handleAddToCart = () => {
    addItem({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
      quantity: 1
    });
  };

  return (
    <button onClick={handleAddToCart}>
      Add to Cart
    </button>
  );
};
```

## 데이터 타입 정의

### User
```typescript
interface UserData {
  uid: string;
  email: string;
  name: string;
  phone?: string;
  birthDate?: string;
  role: 'user' | 'admin';
  createdAt: string;
}
```

### Order
```typescript
interface Order {
  id: string;
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
  paymentKey?: string;
  paidAt?: string;
}

interface OrderItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
}
```

### Review
```typescript
interface Review {
  id: string;
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

### Address
```typescript
interface Address {
  id: string;
  userId: string;
  name: string;
  address: string;
  detailAddress: string;
  zipCode: string;
  isDefault: boolean;
}
```

### Product
```typescript
interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  originalPrice?: number;
  category: string;
  image: string;
  features: string[];
  curriculum?: string[];
  duration?: string;
  level?: string;
}
```

## 유틸리티 함수

### 날짜 포맷팅
```typescript
const formatDate = (timestamp: any) => {
  if (!timestamp) return '';
  const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
  return date.toLocaleDateString('ko-KR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
};
```

### 가격 포맷팅
```typescript
const formatPrice = (price: number) => {
  return `₩${price.toLocaleString()}`;
};
```

### 주문 상태 표시
```typescript
const getStatusBadge = (status: string) => {
  const statusConfig = {
    pending: { label: '결제대기', color: 'bg-gray-100 text-gray-600' },
    paid: { label: '결제완료', color: 'bg-green-100 text-green-600' },
    shipping: { label: '배송중', color: 'bg-blue-100 text-blue-600' },
    delivered: { label: '배송완료', color: 'bg-purple-100 text-purple-600' },
    cancelled: { label: '취소', color: 'bg-red-100 text-red-600' }
  };
  return statusConfig[status as keyof typeof statusConfig];
};
```

## 에러 처리

### Firebase 에러 메시지
```typescript
function getErrorMessage(errorCode: string): string {
  switch (errorCode) {
    case 'auth/email-already-in-use':
      return '이미 사용 중인 이메일입니다.';
    case 'auth/invalid-email':
      return '유효하지 않은 이메일 주소입니다.';
    case 'auth/weak-password':
      return '비밀번호는 6자 이상이어야 합니다.';
    case 'auth/user-not-found':
      return '존재하지 않는 계정입니다.';
    case 'auth/wrong-password':
      return '잘못된 비밀번호입니다.';
    default:
      return '인증 오류가 발생했습니다.';
  }
}
```

### Try-Catch 패턴
```typescript
const safeOperation = async () => {
  try {
    // Firestore 작업
    await someFirestoreOperation();
  } catch (error) {
    console.error('Operation failed:', error);
    alert('작업에 실패했습니다. 다시 시도해주세요.');
  } finally {
    setLoading(false);
  }
};
```

## 보안 고려사항

### 환경 변수 사용
```typescript
// 절대 클라이언트에 노출하지 말 것
const secretKey = process.env.TOSS_SECRET_KEY; // Server-side only

// 클라이언트에서 사용 가능
const publicKey = process.env.NEXT_PUBLIC_TOSS_CLIENT_KEY;
```

### 인증 확인
```typescript
// 서버 사이드 또는 미들웨어에서
import { auth } from '@/lib/firebase-admin';

const verifyToken = async (token: string) => {
  const decodedToken = await auth.verifyIdToken(token);
  return decodedToken;
};
```

### Firestore 보안 규칙 검증
```javascript
// 사용자 본인의 데이터만 수정 가능
allow write: if request.auth.uid == resource.data.userId;

// 관리자 권한 확인
allow write: if get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin';
```
