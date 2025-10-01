// Firebase Admin SDK를 사용하여 모든 pending 리뷰를 approved로 변경
const admin = require('firebase-admin');

// Firebase 초기화 (환경변수 사용)
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.applicationDefault(),
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  });
}

const db = admin.firestore();

async function approveAllReviews() {
  try {
    const reviewsRef = db.collection('reviews');
    const snapshot = await reviewsRef.where('status', '==', 'pending').get();

    if (snapshot.empty) {
      console.log('승인 대기 중인 리뷰가 없습니다.');
      return;
    }

    const batch = db.batch();
    let count = 0;

    snapshot.forEach((doc) => {
      batch.update(doc.ref, { status: 'approved' });
      count++;
      console.log(`리뷰 승인: ${doc.id}`);
    });

    await batch.commit();
    console.log(`\n총 ${count}개의 리뷰가 승인되었습니다.`);
  } catch (error) {
    console.error('리뷰 승인 실패:', error);
  }
}

approveAllReviews();
