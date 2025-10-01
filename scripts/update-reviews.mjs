import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs, updateDoc, doc, query, where } from 'firebase/firestore';
import dotenv from 'dotenv';

// .env.local 파일 로드
dotenv.config({ path: '.env.local' });

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

async function approveAllPendingReviews() {
  try {
    console.log('🔍 Pending 상태 리뷰 검색 중...');

    const reviewsRef = collection(db, 'reviews');
    const q = query(reviewsRef, where('status', '==', 'pending'));
    const snapshot = await getDocs(q);

    if (snapshot.empty) {
      console.log('✅ Pending 상태의 리뷰가 없습니다.');
      return;
    }

    console.log(`📝 ${snapshot.size}개의 pending 리뷰를 찾았습니다.`);

    let count = 0;
    const updatePromises = [];

    snapshot.forEach((document) => {
      console.log(`  - 리뷰 ID: ${document.id}`);
      const reviewRef = doc(db, 'reviews', document.id);
      updatePromises.push(
        updateDoc(reviewRef, { status: 'approved' })
      );
      count++;
    });

    console.log('\n⏳ 리뷰 상태 업데이트 중...');
    await Promise.all(updatePromises);

    console.log(`\n✅ 총 ${count}개의 리뷰가 승인되었습니다!`);
    process.exit(0);
  } catch (error) {
    console.error('❌ 리뷰 승인 실패:', error);
    process.exit(1);
  }
}

approveAllPendingReviews();
