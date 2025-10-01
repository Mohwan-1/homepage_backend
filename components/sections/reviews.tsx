'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Star, ChevronLeft, ChevronRight } from 'lucide-react';
import { collection, query, where, orderBy, limit, getDocs } from 'firebase/firestore';
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

export default function Reviews() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadReviews();
  }, []);

  const loadReviews = async () => {
    try {
      const q = query(
        collection(db, 'reviews'),
        where('status', '==', 'approved'),
        limit(6)
      );

      const querySnapshot = await getDocs(q);
      const reviewsData: Review[] = [];

      querySnapshot.forEach((doc) => {
        reviewsData.push({
          id: doc.id,
          ...doc.data(),
        } as Review);
      });

      // 클라이언트에서 정렬
      reviewsData.sort((a, b) => {
        const timeA = a.createdAt?.toMillis?.() || 0;
        const timeB = b.createdAt?.toMillis?.() || 0;
        return timeB - timeA;
      });

      setReviews(reviewsData);
      console.log('Loaded reviews:', reviewsData); // 디버깅용
    } catch (error) {
      console.error('Failed to load reviews:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % Math.max(1, reviews.length - 2));
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + Math.max(1, reviews.length - 2)) % Math.max(1, reviews.length - 2));
  };

  if (isLoading) {
    return (
      <section className="bg-gray-50 py-16 lg:py-24">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">수강생 후기</h2>
            <p className="text-lg text-gray-600">실제 수강생들의 생생한 후기를 확인해보세요</p>
          </div>
          <div className="flex justify-center">
            <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
          </div>
        </div>
      </section>
    );
  }

  if (reviews.length === 0) {
    return (
      <section className="bg-gray-50 py-16 lg:py-24">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">수강생 후기</h2>
            <p className="text-lg text-gray-600">실제 수강생들의 생생한 후기를 확인해보세요</p>
          </div>
          <div className="bg-white border border-gray-200 rounded-lg p-12 text-center">
            <p className="text-gray-600 mb-4">아직 등록된 후기가 없습니다.</p>
            <Link
              href="/reviews/write"
              className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium"
            >
              첫 번째 후기 작성하기
            </Link>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="bg-gray-50 py-16 lg:py-24">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-12">
          <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">수강생 후기</h2>
          <p className="text-lg text-gray-600">실제 수강생들의 생생한 후기를 확인해보세요</p>
        </div>

        <div className="relative">
          {/* Reviews Carousel */}
          <div className="overflow-hidden">
            <div
              className="flex transition-transform duration-500 ease-in-out"
              style={{ transform: `translateX(-${currentIndex * (100 / 3)}%)` }}
            >
              {reviews.map((review) => (
                <div key={review.id} className="w-full md:w-1/3 flex-shrink-0 px-3">
                  <div className="bg-white border border-gray-200 rounded-lg p-6 h-full">
                    {/* Rating */}
                    <div className="flex items-center gap-1 mb-3">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star
                          key={star}
                          size={18}
                          className={
                            star <= review.rating
                              ? 'fill-yellow-400 text-yellow-400'
                              : 'text-gray-300'
                          }
                        />
                      ))}
                    </div>

                    {/* Title */}
                    <h3 className="text-lg font-bold text-gray-800 mb-2 line-clamp-1">
                      {review.title}
                    </h3>

                    {/* Course */}
                    {review.course && (
                      <span className="inline-block bg-blue-100 text-blue-700 text-xs px-2 py-1 rounded-full mb-3">
                        {review.course}
                      </span>
                    )}

                    {/* Content */}
                    <p className="text-gray-700 text-sm mb-4 line-clamp-3">
                      {review.content}
                    </p>

                    {/* Image */}
                    {review.files && review.files.length > 0 && (
                      <img
                        src={review.files[0]}
                        alt="Review"
                        className="w-full h-40 object-cover rounded-lg mb-4 border border-gray-200"
                      />
                    )}

                    {/* Author */}
                    <div className="pt-4 border-t border-gray-200">
                      <p className="text-sm text-gray-600 font-medium">{review.name}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Navigation Buttons */}
          {reviews.length > 3 && (
            <>
              <button
                onClick={prevSlide}
                className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 bg-white border border-gray-200 rounded-full p-2 shadow-lg hover:bg-gray-50 transition-colors"
              >
                <ChevronLeft size={24} className="text-gray-600" />
              </button>
              <button
                onClick={nextSlide}
                className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 bg-white border border-gray-200 rounded-full p-2 shadow-lg hover:bg-gray-50 transition-colors"
              >
                <ChevronRight size={24} className="text-gray-600" />
              </button>
            </>
          )}
        </div>

        {/* View All Button */}
        <div className="text-center mt-12">
          <Link
            href="/reviews"
            className="inline-block bg-blue-600 text-white px-8 py-4 rounded-lg hover:bg-blue-700 transition-colors font-medium"
          >
            모든 후기 보기
          </Link>
        </div>
      </div>
    </section>
  );
}
