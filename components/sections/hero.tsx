'use client';

import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';

export default function Hero() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const sectionRef = useRef<HTMLDivElement>(null);
  const [scrollStartTime, setScrollStartTime] = useState<number | null>(null);
  const [isAutoPlaying, setIsAutoPlaying] = useState(false);
  const lastScrollY = useRef(0);

  useEffect(() => {
    const video = videoRef.current;
    const section = sectionRef.current;

    if (!video || !section) return;

    let scrollTimeout: NodeJS.Timeout;
    let isScrolling = false;

    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      const scrollDelta = Math.abs(currentScrollY - lastScrollY.current);

      // 스크롤이 시작되었을 때
      if (!isScrolling && scrollDelta > 0) {
        isScrolling = true;

        // 자동 재생 모드가 아니면 스크롤 시작 시간 기록
        if (!isAutoPlaying) {
          setScrollStartTime(Date.now());
        }
      }

      lastScrollY.current = currentScrollY;

      // 스크롤 중일 때 영상 재생
      if (!isAutoPlaying && isScrolling) {
        video.play().catch(err => console.log('Video play error:', err));
      }

      // 스크롤 멈춤 감지를 위한 타이머
      clearTimeout(scrollTimeout);
      scrollTimeout = setTimeout(() => {
        isScrolling = false;

        // 2초 이상 스크롤했는지 확인
        if (scrollStartTime && !isAutoPlaying) {
          const scrollDuration = Date.now() - scrollStartTime;

          if (scrollDuration >= 2000) {
            // 2초 이상 스크롤 → 자동 재생 모드 활성화
            setIsAutoPlaying(true);
            video.loop = true;
            video.play().catch(err => console.log('Video play error:', err));
          } else {
            // 2초 미만 스크롤 → 영상 일시정지
            video.pause();
          }

          setScrollStartTime(null);
        } else if (!isAutoPlaying) {
          // 자동 재생 모드가 아니면 영상 일시정지
          video.pause();
        }
      }, 150); // 150ms 동안 스크롤이 없으면 멈춤으로 간주
    };

    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      window.removeEventListener('scroll', handleScroll);
      clearTimeout(scrollTimeout);
    };
  }, [scrollStartTime, isAutoPlaying]);

  return (
    <section ref={sectionRef} className="relative bg-white min-h-[100vh] overflow-hidden flex items-center">
      {/* Video Background */}
      <div className="absolute inset-0 w-full h-full">
        <video
          ref={videoRef}
          className="w-full h-full object-cover"
          muted
          playsInline
          preload="auto"
        >
          <source src="/hamepage_hero.mp4" type="video/mp4" />
        </video>
        {/* Overlay for better text readability */}
        <div className="absolute inset-0 bg-black/30"></div>
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 text-center">
        <h1 className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-bold text-white mb-4 sm:mb-6 leading-tight drop-shadow-lg">
          당신의 이야기가<br className="sm:hidden" /> 콘텐츠가 됩니다
        </h1>
        <p className="text-lg sm:text-xl lg:text-2xl text-white mb-6 sm:mb-8 max-w-3xl mx-auto leading-relaxed drop-shadow-md px-4">
          중장년을 위한 맞춤형<br className="sm:hidden" /> 유튜브 채널 성장 로드맵
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 px-4">
          <Link
            href="/products"
            className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white font-medium px-6 sm:px-8 py-3 sm:py-4 rounded-lg transition-colors shadow-lg text-center"
          >
            상품 살펴보기
          </Link>
          <Link
            href="/contact"
            className="w-full sm:w-auto bg-white hover:bg-gray-50 text-gray-900 font-medium px-6 sm:px-8 py-3 sm:py-4 rounded-lg border border-gray-300 transition-colors shadow-lg text-center"
          >
            무료 상담 받기
          </Link>
        </div>
      </div>
    </section>
  );
}
