'use client';

import { useState } from 'react';
import { Save, Globe, CreditCard, Bell, Database } from 'lucide-react';

export default function SettingsPage() {
  const [siteName, setSiteName] = useState('Vibe 쇼핑몰');
  const [siteEmail, setSiteEmail] = useState('contact@vibe.com');
  const [sitePhone, setSitePhone] = useState('02-1234-5678');

  const [enableCreditCard, setEnableCreditCard] = useState(true);
  const [enableBankTransfer, setEnableBankTransfer] = useState(true);
  const [enableKakaoPay, setEnableKakaoPay] = useState(false);

  const [notifyNewOrder, setNotifyNewOrder] = useState(true);
  const [notifyLowStock, setNotifyLowStock] = useState(true);
  const [notifyNewUser, setNotifyNewUser] = useState(false);

  const handleSave = () => {
    alert('설정이 저장되었습니다.');
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">시스템 설정</h1>
          <p className="text-gray-600 mt-1">사이트 및 시스템 환경 설정</p>
        </div>
        <button
          onClick={handleSave}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Save size={20} />
          설정 저장
        </button>
      </div>

      {/* Site Settings */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center gap-2">
            <Globe className="text-blue-600" size={24} />
            <h2 className="text-lg font-bold text-gray-800">사이트 설정</h2>
          </div>
        </div>
        <div className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              사이트명
            </label>
            <input
              type="text"
              value={siteName}
              onChange={(e) => setSiteName(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              연락처 이메일
            </label>
            <input
              type="email"
              value={siteEmail}
              onChange={(e) => setSiteEmail(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              연락처 전화번호
            </label>
            <input
              type="tel"
              value={sitePhone}
              onChange={(e) => setSitePhone(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              사이트 로고
            </label>
            <div className="flex items-center gap-4">
              <div className="w-32 h-32 bg-gray-100 rounded-lg flex items-center justify-center border-2 border-dashed border-gray-300">
                <span className="text-gray-400 text-sm">로고 이미지</span>
              </div>
              <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                파일 선택
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Payment Settings */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center gap-2">
            <CreditCard className="text-green-600" size={24} />
            <h2 className="text-lg font-bold text-gray-800">결제 설정</h2>
          </div>
        </div>
        <div className="p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-medium text-gray-800">신용카드 결제</h3>
              <p className="text-sm text-gray-600">신용카드 결제를 활성화합니다</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={enableCreditCard}
                onChange={(e) => setEnableCreditCard(e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-medium text-gray-800">계좌이체</h3>
              <p className="text-sm text-gray-600">무통장 입금을 활성화합니다</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={enableBankTransfer}
                onChange={(e) => setEnableBankTransfer(e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-medium text-gray-800">카카오페이</h3>
              <p className="text-sm text-gray-600">카카오페이 간편결제를 활성화합니다</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={enableKakaoPay}
                onChange={(e) => setEnableKakaoPay(e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>

          <div className="pt-4 border-t border-gray-200">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              수수료 (%)
            </label>
            <input
              type="number"
              defaultValue="3.0"
              step="0.1"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
            />
          </div>
        </div>
      </div>

      {/* Notification Settings */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center gap-2">
            <Bell className="text-yellow-600" size={24} />
            <h2 className="text-lg font-bold text-gray-800">알림 설정</h2>
          </div>
        </div>
        <div className="p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-medium text-gray-800">신규 주문 알림</h3>
              <p className="text-sm text-gray-600">새로운 주문이 들어오면 알림을 받습니다</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={notifyNewOrder}
                onChange={(e) => setNotifyNewOrder(e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-medium text-gray-800">재고 부족 알림</h3>
              <p className="text-sm text-gray-600">상품 재고가 부족하면 알림을 받습니다</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={notifyLowStock}
                onChange={(e) => setNotifyLowStock(e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-medium text-gray-800">신규 사용자 알림</h3>
              <p className="text-sm text-gray-600">새로운 사용자가 가입하면 알림을 받습니다</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={notifyNewUser}
                onChange={(e) => setNotifyNewUser(e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>
        </div>
      </div>

      {/* System Info */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center gap-2">
            <Database className="text-purple-600" size={24} />
            <h2 className="text-lg font-bold text-gray-800">시스템 정보</h2>
          </div>
        </div>
        <div className="p-6 space-y-4">
          <div className="flex justify-between py-3 border-b border-gray-200">
            <span className="text-gray-600">서버 상태</span>
            <span className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span className="text-green-600 font-medium">정상</span>
            </span>
          </div>

          <div className="flex justify-between py-3 border-b border-gray-200">
            <span className="text-gray-600">데이터베이스 상태</span>
            <span className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span className="text-green-600 font-medium">정상</span>
            </span>
          </div>

          <div className="flex justify-between py-3 border-b border-gray-200">
            <span className="text-gray-600">최근 백업</span>
            <span className="text-gray-800 font-medium">2024-01-20 03:00</span>
          </div>

          <div className="flex justify-between py-3">
            <span className="text-gray-600">디스크 사용량</span>
            <span className="text-gray-800 font-medium">12.5 GB / 100 GB</span>
          </div>

          <div className="pt-4">
            <button className="w-full px-4 py-2 border border-blue-600 text-blue-600 rounded-lg hover:bg-blue-50 transition-colors">
              수동 백업 실행
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}