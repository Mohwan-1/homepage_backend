'use client';

import { useState, useEffect } from 'react';
import DataTable, { ColumnDef, TableAction } from '@/components/admin/data-table';
import { Search, Star } from 'lucide-react';
import { collection, getDocs, query, orderBy, deleteDoc, doc, updateDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';

interface ReviewData {
  id: string;
  name: string;
  title: string;
  content: string;
  course: string;
  rating: number;
  status: 'pending' | 'approved' | 'rejected';
  createdAt: string;
}

const statusConfig = {
  pending: { label: '검토중', color: 'bg-yellow-100 text-yellow-600' },
  approved: { label: '승인됨', color: 'bg-green-100 text-green-600' },
  rejected: { label: '반려됨', color: 'bg-red-100 text-red-600' },
};

export default function ReviewsPage() {
  const [reviews, setReviews] = useState<ReviewData[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'pending' | 'approved' | 'rejected'>('all');

  useEffect(() => {
    loadReviews();
  }, []);

  const loadReviews = async () => {
    try {
      setLoading(true);
      const reviewsQuery = query(
        collection(db, 'reviews'),
        orderBy('createdAt', 'desc')
      );
      const querySnapshot = await getDocs(reviewsQuery);
      const reviewsData: ReviewData[] = querySnapshot.docs.map(doc => {
        const data = doc.data();
        return {
          id: doc.id,
          name: data.name || 'Unknown',
          title: data.title || '',
          content: data.content || '',
          course: data.course || '',
          rating: data.rating || 0,
          status: data.status || 'pending',
          createdAt: data.createdAt ? new Date(data.createdAt.toDate()).toLocaleDateString('ko-KR') : '-'
        };
      });
      setReviews(reviewsData);
    } catch (error) {
      console.error('Failed to load reviews:', error);
      alert('후기 목록을 불러오는데 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  const filteredReviews = reviews.filter(review => {
    const matchesSearch =
      review.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      review.title.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus = statusFilter === 'all' || review.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const columns: ColumnDef<ReviewData>[] = [
    {
      key: 'name',
      header: '작성자',
      sortable: true,
    },
    {
      key: 'title',
      header: '제목',
      sortable: true,
    },
    {
      key: 'course',
      header: '수강과정',
      sortable: true,
    },
    {
      key: 'rating',
      header: '평점',
      sortable: true,
      render: (value) => (
        <div className="flex items-center gap-1">
          {[1, 2, 3, 4, 5].map((star) => (
            <Star
              key={star}
              size={14}
              className={
                star <= (value as number)
                  ? 'fill-yellow-400 text-yellow-400'
                  : 'text-gray-300'
              }
            />
          ))}
        </div>
      ),
    },
    {
      key: 'status',
      header: '상태',
      sortable: true,
      render: (value) => {
        const config = statusConfig[value as keyof typeof statusConfig];
        return (
          <span className={`px-2 py-1 text-xs font-medium rounded ${config.color}`}>
            {config.label}
          </span>
        );
      },
    },
    {
      key: 'createdAt',
      header: '작성일',
      sortable: true,
    },
  ];

  const changeReviewStatus = async (review: ReviewData, newStatus: 'pending' | 'approved' | 'rejected') => {
    try {
      await updateDoc(doc(db, 'reviews', review.id), {
        status: newStatus,
        updatedAt: new Date().toISOString()
      });
      await loadReviews();
      alert(`후기 상태가 ${statusConfig[newStatus].label}(으)로 변경되었습니다.`);
    } catch (error) {
      console.error('Failed to update review status:', error);
      alert('후기 상태 변경에 실패했습니다.');
    }
  };

  const deleteReview = async (reviewId: string) => {
    try {
      await deleteDoc(doc(db, 'reviews', reviewId));
      await loadReviews();
      alert('후기가 삭제되었습니다.');
    } catch (error) {
      console.error('Failed to delete review:', error);
      alert('후기 삭제에 실패했습니다.');
    }
  };

  const actions: TableAction<ReviewData>[] = [
    {
      label: '상세보기',
      onClick: (review) => alert(`제목: ${review.title}\n내용: ${review.content}\n평점: ${review.rating}점`),
    },
    {
      label: '승인',
      onClick: (review) => {
        if (review.status === 'approved') {
          alert('이미 승인된 후기입니다.');
          return;
        }
        if (confirm(`${review.title}을(를) 승인하시겠습니까?`)) {
          changeReviewStatus(review, 'approved');
        }
      },
    },
    {
      label: '반려',
      onClick: (review) => {
        if (review.status === 'rejected') {
          alert('이미 반려된 후기입니다.');
          return;
        }
        if (confirm(`${review.title}을(를) 반려하시겠습니까?`)) {
          changeReviewStatus(review, 'rejected');
        }
      },
    },
    {
      label: '삭제',
      onClick: (review) => {
        if (confirm(`${review.title}을(를) 삭제하시겠습니까?\n이 작업은 되돌릴 수 없습니다.`)) {
          deleteReview(review.id);
        }
      },
      variant: 'destructive',
    },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">후기 목록 로딩 중...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">후기 관리</h1>
          <p className="text-gray-600 mt-1">총 {filteredReviews.length}개 후기</p>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Search */}
          <div>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="작성자/제목 검색..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
              />
            </div>
          </div>

          {/* Status Filter */}
          <div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as any)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
            >
              <option value="all">모든 상태</option>
              <option value="pending">검토중</option>
              <option value="approved">승인됨</option>
              <option value="rejected">반려됨</option>
            </select>
          </div>
        </div>
      </div>

      {/* Status Summary */}
      <div className="grid grid-cols-3 gap-4">
        {Object.entries(statusConfig).map(([status, config]) => {
          const count = reviews.filter(r => r.status === status).length;
          return (
            <div key={status} className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
              <div className={`text-xs font-medium mb-1 px-2 py-1 rounded inline-block ${config.color}`}>
                {config.label}
              </div>
              <p className="text-2xl font-bold text-gray-800 mt-2">{count}</p>
            </div>
          );
        })}
      </div>

      {/* Data Table */}
      <DataTable
        data={filteredReviews}
        columns={columns}
        actions={actions}
        onRowClick={(review) => console.log('Review clicked:', review)}
      />
    </div>
  );
}
