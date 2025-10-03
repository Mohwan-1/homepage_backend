'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { User, Settings, LogOut, ChevronDown } from 'lucide-react';

interface UserDropdownProps {
  userName: string;
  onLogout: () => void;
}

export default function UserDropdown({ userName, onLogout }: UserDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-2 bg-white/20 hover:bg-white/30 backdrop-blur-sm border border-white/30 text-gray-900 font-medium px-4 py-2 rounded-lg transition-all shadow-sm"
      >
        <span>{userName}</span>
        <ChevronDown size={16} className={`transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 backdrop-blur-xl bg-white/95 border border-white/20 shadow-xl rounded-lg overflow-hidden animate-fade-in">
          <Link
            href="/mypage"
            className="flex items-center space-x-3 px-4 py-3 text-gray-900 hover:bg-white/40 transition-colors"
            onClick={() => setIsOpen(false)}
          >
            <User size={18} />
            <span>마이페이지</span>
          </Link>
          {/* 설정 메뉴 숨김 - 마이페이지와 동일 */}
          {/* <Link
            href="/mypage/profile"
            className="flex items-center space-x-3 px-4 py-3 text-gray-900 hover:bg-white/40 transition-colors"
            onClick={() => setIsOpen(false)}
          >
            <Settings size={18} />
            <span>설정</span>
          </Link> */}
          <div className="h-px bg-gray-200 my-1"></div>
          <button
            onClick={() => {
              onLogout();
              setIsOpen(false);
            }}
            className="w-full flex items-center space-x-3 px-4 py-3 text-red-600 hover:bg-red-50 transition-colors"
          >
            <LogOut size={18} />
            <span>로그아웃</span>
          </button>
        </div>
      )}
    </div>
  );
}