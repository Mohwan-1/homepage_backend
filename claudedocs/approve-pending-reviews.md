# 기존 리뷰 승인 처리 가이드

## 문제 상황
- 기존에 작성된 리뷰들이 `status: 'pending'` 상태로 저장되어 있음
- 이제 리뷰가 즉시 게시되도록 변경됨 (`status: 'approved'`)
- 기존 pending 리뷰들을 approved로 변경 필요

## Firebase Console을 통한 수동 업데이트

### 방법 1: Firebase Console에서 직접 수정
1. Firebase Console 접속: https://console.firebase.google.com
2. 프로젝트 선택: `youtube-content-school`
3. Firestore Database 메뉴 선택
4. `reviews` 컬렉션 선택
5. 각 문서의 `status` 필드를 `pending` → `approved`로 변경
6. 저장

### 방법 2: 개발자 도구에서 일괄 업데이트 (추천)

브라우저 개발자 콘솔에서 다음 코드 실행:

```javascript
// Firebase 초기화 확인 (이미 로드된 상태)
import { collection, getDocs, updateDoc, doc, query, where } from 'firebase/firestore';
import { db } from '@/lib/firebase';

// 모든 pending 리뷰 찾아서 approved로 변경
async function approveAllPendingReviews() {
  try {
    const reviewsRef = collection(db, 'reviews');
    const q = query(reviewsRef, where('status', '==', 'pending'));
    const snapshot = await getDocs(q);

    let count = 0;
    const updatePromises = [];

    snapshot.forEach((document) => {
      const reviewRef = doc(db, 'reviews', document.id);
      updatePromises.push(updateDoc(reviewRef, { status: 'approved' }));
      count++;
    });

    await Promise.all(updatePromises);
    console.log(`${count}개의 리뷰가 승인되었습니다.`);

    return count;
  } catch (error) {
    console.error('리뷰 승인 실패:', error);
    throw error;
  }
}

// 실행
approveAllPendingReviews();
```

## 변경 사항

### 1. 리뷰 작성 페이지 (`app/reviews/write/page.tsx`)
- **변경 전**: `status: 'pending'` (관리자 승인 대기)
- **변경 후**: `status: 'approved'` (즉시 게시)

### 2. 사용자 메시지
- **변경 전**: "리뷰가 성공적으로 등록되었습니다. 관리자 승인 후 게시됩니다."
- **변경 후**: "리뷰가 성공적으로 등록되었습니다."

### 3. 리뷰 표시 로직 (`components/sections/reviews.tsx`, `app/reviews/page.tsx`)
- 기존: `where('status', '==', 'approved')` 조건으로 승인된 리뷰만 표시
- 현재도 동일하게 작동하므로 변경 불필요

## 참고사항
- 새로 작성되는 모든 리뷰는 자동으로 `status: 'approved'`로 저장됨
- 기존 pending 리뷰는 위 방법으로 수동 업데이트 필요
- 향후 관리자 승인 기능이 필요하면 `status: 'pending'`으로 다시 변경 가능
