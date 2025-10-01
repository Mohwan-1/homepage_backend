'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Star, Upload, X, Image as ImageIcon, ArrowLeft, Home } from 'lucide-react';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { storage, db } from '@/lib/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

export default function WriteReviewPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [rating, setRating] = useState(5);
  const [hoveredRating, setHoveredRating] = useState(0);

  const [reviewData, setReviewData] = useState({
    name: '',
    title: '',
    content: '',
    course: '',
  });

  const [files, setFiles] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setReviewData({
      ...reviewData,
      [e.target.name]: e.target.value,
    });
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(e.target.files || []);

    if (files.length + selectedFiles.length > 5) {
      alert('최대 5개의 파일만 업로드할 수 있습니다.');
      return;
    }

    // 파일 크기 체크 (각 파일 5MB 제한)
    const invalidFiles = selectedFiles.filter(file => file.size > 5 * 1024 * 1024);
    if (invalidFiles.length > 0) {
      alert('파일 크기는 5MB를 초과할 수 없습니다.');
      return;
    }

    setFiles([...files, ...selectedFiles]);

    // 이미지 미리보기 생성
    selectedFiles.forEach(file => {
      if (file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onloadend = () => {
          setPreviews(prev => [...prev, reader.result as string]);
        };
        reader.readAsDataURL(file);
      } else {
        setPreviews(prev => [...prev, '']);
      }
    });
  };

  const removeFile = (index: number) => {
    setFiles(files.filter((_, i) => i !== index));
    setPreviews(previews.filter((_, i) => i !== index));
  };

  const uploadFiles = async () => {
    const uploadedUrls: string[] = [];

    for (const file of files) {
      const timestamp = Date.now();
      const filename = `reviews/${timestamp}_${file.name}`;
      const storageRef = ref(storage, filename);

      await uploadBytes(storageRef, file);
      const url = await getDownloadURL(storageRef);
      uploadedUrls.push(url);
    }

    return uploadedUrls;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!reviewData.name || !reviewData.title || !reviewData.content) {
      alert('필수 항목을 모두 입력해주세요.');
      return;
    }

    setIsLoading(true);

    try {
      // 파일 업로드
      const fileUrls = await uploadFiles();

      // Firestore에 리뷰 저장
      await addDoc(collection(db, 'reviews'), {
        ...reviewData,
        rating,
        files: fileUrls,
        createdAt: serverTimestamp(),
        status: 'approved', // 즉시 게시
      });

      alert('리뷰가 성공적으로 등록되었습니다.');
      router.push('/');
    } catch (error) {
      console.error('Review submission failed:', error);
      alert('리뷰 등록에 실패했습니다. 다시 시도해주세요.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 pt-20">
      <div className="max-w-4xl mx-auto px-4 py-8">
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

        <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">강의 후기 작성</h1>
          <p className="text-gray-600 mb-8">솔직한 후기를 남겨주세요. 다른 분들께 큰 도움이 됩니다.</p>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* 이름 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                이름 <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="name"
                value={reviewData.name}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                required
              />
            </div>

            {/* 수강 강의 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                수강 강의
              </label>
              <select
                name="course"
                value={reviewData.course}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
              >
                <option value="">선택해주세요</option>
                <option value="유튜브 채널 시작 기초">유튜브 채널 시작 기초</option>
                <option value="콘텐츠 제작 실전">콘텐츠 제작 실전</option>
                <option value="채널 성장 전략">채널 성장 전략</option>
                <option value="수익화 마스터">수익화 마스터</option>
              </select>
            </div>

            {/* 별점 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                별점 <span className="text-red-500">*</span>
              </label>
              <div className="flex items-center gap-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setRating(star)}
                    onMouseEnter={() => setHoveredRating(star)}
                    onMouseLeave={() => setHoveredRating(0)}
                    className="transition-transform hover:scale-110"
                  >
                    <Star
                      size={32}
                      className={
                        star <= (hoveredRating || rating)
                          ? 'fill-yellow-400 text-yellow-400'
                          : 'text-gray-300'
                      }
                    />
                  </button>
                ))}
                <span className="ml-2 text-gray-600 font-medium">{rating}.0</span>
              </div>
            </div>

            {/* 제목 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                제목 <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="title"
                value={reviewData.title}
                onChange={handleInputChange}
                placeholder="후기 제목을 입력해주세요"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                required
              />
            </div>

            {/* 내용 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                내용 <span className="text-red-500">*</span>
              </label>
              <textarea
                name="content"
                value={reviewData.content}
                onChange={handleInputChange}
                placeholder="강의에 대한 솔직한 후기를 작성해주세요"
                rows={8}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none resize-none"
                required
              />
            </div>

            {/* 파일 업로드 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                사진 첨부 (최대 5개, 각 5MB 이하)
              </label>

              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-500 transition-colors">
                <input
                  type="file"
                  id="file-upload"
                  multiple
                  accept="image/*"
                  onChange={handleFileSelect}
                  className="hidden"
                />
                <label
                  htmlFor="file-upload"
                  className="cursor-pointer flex flex-col items-center"
                >
                  <Upload size={40} className="text-gray-400 mb-2" />
                  <span className="text-gray-600 font-medium">파일 선택 또는 드래그</span>
                  <span className="text-sm text-gray-500 mt-1">
                    PNG, JPG, GIF (최대 5MB)
                  </span>
                </label>
              </div>

              {/* 파일 미리보기 */}
              {files.length > 0 && (
                <div className="mt-4 grid grid-cols-2 md:grid-cols-3 gap-4">
                  {files.map((file, index) => (
                    <div key={index} className="relative group">
                      {previews[index] ? (
                        <img
                          src={previews[index]}
                          alt={`Preview ${index + 1}`}
                          className="w-full h-32 object-cover rounded-lg border border-gray-200"
                        />
                      ) : (
                        <div className="w-full h-32 bg-gray-100 rounded-lg border border-gray-200 flex items-center justify-center">
                          <ImageIcon size={32} className="text-gray-400" />
                        </div>
                      )}
                      <button
                        type="button"
                        onClick={() => removeFile(index)}
                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <X size={16} />
                      </button>
                      <p className="text-xs text-gray-600 mt-1 truncate">{file.name}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* 제출 버튼 */}
            <div className="flex gap-4 pt-4">
              <button
                type="submit"
                disabled={isLoading}
                className="flex-1 bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? '등록 중...' : '후기 등록'}
              </button>
              <button
                type="button"
                onClick={() => router.back()}
                className="px-8 bg-gray-100 text-gray-700 py-3 rounded-lg hover:bg-gray-200 transition-colors font-medium"
              >
                취소
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
