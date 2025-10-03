'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Home, Star, Edit, Trash2 } from 'lucide-react';
import Link from 'next/link';
import { useAuth } from '@/contexts/auth-context';
import { collection, query, where, orderBy, getDocs, deleteDoc, doc } from 'firebase/firestore';
import { db } from '@/lib/firebase';

interface Review {
  id: string;
  name: string;
  title: string;
  content: string;
  course: string;
  rating: number;
  files: string[];
  createdAt: any;
  status: string;
}

export default function MyReviewsPage() {
  const router = useRouter();
  const { user } = useAuth();
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      loadMyReviews();
    }
  }, [user]);

  const loadMyReviews = async () => {
    if (!user) return;

    try {
      setLoading(true);
      const reviewsQuery = query(
        collection(db, 'reviews'),
        where('userId', '==', user.uid),
        orderBy('createdAt', 'desc')
      );

      const querySnapshot = await getDocs(reviewsQuery);
      const reviewsData: Review[] = [];

      querySnapshot.forEach((doc) => {
        reviewsData.push({
          id: doc.id,
          ...doc.data(),
        } as Review);
      });

      setReviews(reviewsData);
    } catch (error) {
      console.error('Failed to load reviews:', error);
      alert('후기 목록을 불러오는데 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (reviewId: string) => {
    if (!confirm('정말 이 후기를 삭제하시겠습니까?')) return;

    try {
      await deleteDoc(doc(db, 'reviews', reviewId));
      alert('후기가 삭제되었습니다.');
      loadMyReviews();
    } catch (error) {
      console.error('Failed to delete review:', error);
      alert('후기 삭제에 실패했습니다.');
    }
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      approved: { label: '승인됨', color: 'bg-green-100 text-green-600' },
      pending: { label: '검토중', color: 'bg-yellow-100 text-yellow-600' },
      rejected: { label: '반려됨', color: 'bg-red-100 text-red-600' },
    };
    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.pending;
    return config;
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">후기 목록 로딩 중...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Navigation Buttons */}
      <div className="flex gap-2">
        <button
          onClick={() => window.history.back()}
          className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
        >
          <ArrowLeft size={20} />
          <span>뒤로가기</span>
        </button>
        <Link
          href="/"
          className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
        >
          <Home size={20} />
          <span>홈으로</span>
        </Link>
      </div>

      {/* Header */}
      <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">내가 작성한 후기</h1>
            <p className="text-gray-600 mt-1">총 {reviews.length}개의 후기</p>
          </div>
          <Link
            href="/reviews/write"
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
          >
            새 후기 작성
          </Link>
        </div>
      </div>

      {/* Reviews List */}
      {reviews.length === 0 ? (
        <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-12 text-center">
          <p className="text-gray-600 mb-4">아직 작성한 후기가 없습니다.</p>
          <Link
            href="/reviews/write"
            className="inline-block px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
          >
            첫 후기 작성하기
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {reviews.map((review) => {
            const statusBadge = getStatusBadge(review.status);
            const reviewDate = review.createdAt?.toDate
              ? review.createdAt.toDate().toLocaleDateString('ko-KR')
              : '-';

            return (
              <div key={review.id} className="bg-white border border-gray-200 rounded-lg shadow-sm p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-lg font-bold text-gray-800">{review.title}</h3>
                      <span className={`px-2 py-1 text-xs font-medium rounded ${statusBadge.color}`}>
                        {statusBadge.label}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 mb-2">
                      <div className="flex items-center gap-1">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Star
                            key={star}
                            size={16}
                            className={
                              star <= review.rating
                                ? 'fill-yellow-400 text-yellow-400'
                                : 'text-gray-300'
                            }
                          />
                        ))}
                      </div>
                      {review.course && (
                        <span className="text-sm bg-blue-100 text-blue-700 px-2 py-1 rounded-full">
                          {review.course}
                        </span>
                      )}
                    </div>
                    <p className="text-gray-700 mb-3">{review.content}</p>
                    <p className="text-sm text-gray-500">{reviewDate}</p>
                  </div>
                  <div className="flex flex-col gap-2 ml-4">
                    <Link
                      href={`/reviews/edit/${review.id}`}
                      className="flex items-center gap-2 px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-sm font-medium"
                    >
                      <Edit size={16} />
                      수정
                    </Link>
                    <button
                      onClick={() => handleDelete(review.id)}
                      className="flex items-center gap-2 px-3 py-2 border border-red-300 text-red-600 rounded-lg hover:bg-red-50 transition-colors text-sm font-medium"
                    >
                      <Trash2 size={16} />
                      삭제
                    </button>
                  </div>
                </div>
                {review.files && review.files.length > 0 && (
                  <div className="flex gap-2 mt-3">
                    {review.files.map((file, idx) => (
                      <img
                        key={idx}
                        src={file}
                        alt={`Review ${idx + 1}`}
                        className="w-24 h-24 object-cover rounded-lg border border-gray-200"
                      />
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
