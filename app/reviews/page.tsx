'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Star, PenSquare, ChevronDown, ArrowLeft, Home } from 'lucide-react';
import { collection, query, where, orderBy, getDocs } from 'firebase/firestore';
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
}

export default function ReviewsPage() {
  const router = useRouter();
  const [reviews, setReviews] = useState<Review[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [expandedReviews, setExpandedReviews] = useState<Set<string>>(new Set());

  useEffect(() => {
    loadReviews();
  }, []);

  const loadReviews = async () => {
    try {
      const q = query(
        collection(db, 'reviews'),
        where('status', '==', 'approved'),
        orderBy('createdAt', 'desc')
      );

      const querySnapshot = await getDocs(q);
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
    } finally {
      setIsLoading(false);
    }
  };

  const toggleExpand = (reviewId: string) => {
    const newExpanded = new Set(expandedReviews);
    if (newExpanded.has(reviewId)) {
      newExpanded.delete(reviewId);
    } else {
      newExpanded.add(reviewId);
    }
    setExpandedReviews(newExpanded);
  };

  const formatDate = (timestamp: any) => {
    if (!timestamp) return '';
    const date = timestamp.toDate();
    return date.toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 pt-20 flex items-center justify-center">
        <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-20">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Navigation Buttons */}
        <div className="flex gap-2 mb-6">
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <ArrowLeft size={20} />
            <span>뒤로가기</span>
          </button>
          <button
            onClick={() => router.push('/')}
            className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <Home size={20} />
            <span>홈으로</span>
          </button>
        </div>

        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-800 mb-2">강의 후기</h1>
            <p className="text-gray-600">수강생들의 생생한 후기를 확인해보세요</p>
          </div>
          <button
            onClick={() => router.push('/reviews/write')}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium flex items-center gap-2"
          >
            <PenSquare size={20} />
            후기 작성
          </button>
        </div>

        {/* Reviews Grid */}
        {reviews.length === 0 ? (
          <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-12 text-center">
            <p className="text-gray-600 mb-4">아직 등록된 후기가 없습니다.</p>
            <button
              onClick={() => router.push('/reviews/write')}
              className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium"
            >
              첫 번째 후기 작성하기
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {reviews.map((review) => {
              const isExpanded = expandedReviews.has(review.id);
              const shouldTruncate = review.content.length > 200;

              return (
                <div
                  key={review.id}
                  className="bg-white border border-gray-200 rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow"
                >
                  {/* Rating */}
                  <div className="flex items-center gap-1 mb-3">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        size={20}
                        className={
                          star <= review.rating
                            ? 'fill-yellow-400 text-yellow-400'
                            : 'text-gray-300'
                        }
                      />
                    ))}
                    <span className="ml-2 text-gray-600 font-medium">{review.rating}.0</span>
                  </div>

                  {/* Title */}
                  <h3 className="text-xl font-bold text-gray-800 mb-2">{review.title}</h3>

                  {/* Course */}
                  {review.course && (
                    <span className="inline-block bg-blue-100 text-blue-700 text-sm px-3 py-1 rounded-full mb-3">
                      {review.course}
                    </span>
                  )}

                  {/* Content */}
                  <p className="text-gray-700 mb-4 whitespace-pre-wrap">
                    {isExpanded || !shouldTruncate
                      ? review.content
                      : `${review.content.substring(0, 200)}...`}
                  </p>

                  {shouldTruncate && (
                    <button
                      onClick={() => toggleExpand(review.id)}
                      className="text-blue-600 hover:text-blue-700 font-medium text-sm flex items-center gap-1 mb-4"
                    >
                      {isExpanded ? '접기' : '더보기'}
                      <ChevronDown
                        size={16}
                        className={`transform transition-transform ${
                          isExpanded ? 'rotate-180' : ''
                        }`}
                      />
                    </button>
                  )}

                  {/* Images */}
                  {review.files && review.files.length > 0 && (
                    <div className="grid grid-cols-3 gap-2 mb-4">
                      {review.files.slice(0, 3).map((fileUrl, index) => (
                        <img
                          key={index}
                          src={fileUrl}
                          alt={`Review image ${index + 1}`}
                          className="w-full h-24 object-cover rounded-lg border border-gray-200"
                        />
                      ))}
                      {review.files.length > 3 && (
                        <div className="w-full h-24 bg-gray-100 rounded-lg border border-gray-200 flex items-center justify-center">
                          <span className="text-gray-600 font-medium">
                            +{review.files.length - 3}
                          </span>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Footer */}
                  <div className="flex justify-between items-center text-sm text-gray-500 pt-4 border-t border-gray-200">
                    <span>{review.name}</span>
                    <span>{formatDate(review.createdAt)}</span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
