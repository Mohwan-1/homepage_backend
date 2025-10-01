'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Camera, MapPin, Plus, Trash2, ArrowLeft, Home } from 'lucide-react';
import { useAuth } from '@/contexts/auth-context';
import { doc, getDoc, setDoc, updateDoc, collection, query, where, getDocs, addDoc, deleteDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';

interface Address {
  id: string;
  name: string;
  address: string;
  detailAddress: string;
  zipCode: string;
  isDefault: boolean;
}

export default function ProfilePage() {
  const router = useRouter();
  const { user, userData } = useAuth();
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [birthDate, setBirthDate] = useState('');
  const [email, setEmail] = useState('');
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (user && userData) {
      setName(userData.name || '');
      setEmail(user.email || '');
      loadUserProfile();
      loadAddresses();
    }
  }, [user, userData]);

  const loadUserProfile = async () => {
    if (!user) return;

    try {
      const userDoc = await getDoc(doc(db, 'users', user.uid));
      if (userDoc.exists()) {
        const data = userDoc.data();
        setPhone(data.phone || '');
        setBirthDate(data.birthDate || '');
      }
    } catch (error) {
      console.error('Failed to load profile:', error);
    }
  };

  const loadAddresses = async () => {
    if (!user) return;

    try {
      const addressesQuery = query(
        collection(db, 'addresses'),
        where('userId', '==', user.uid)
      );
      const querySnapshot = await getDocs(addressesQuery);
      const addressesData: Address[] = [];

      querySnapshot.forEach((doc) => {
        addressesData.push({
          id: doc.id,
          ...doc.data(),
        } as Address);
      });

      setAddresses(addressesData);
    } catch (error) {
      console.error('Failed to load addresses:', error);
    }
  };

  const handleSave = async () => {
    if (!user) return;

    setIsLoading(true);
    try {
      await updateDoc(doc(db, 'users', user.uid), {
        name,
        phone,
        birthDate,
      });

      alert('프로필이 저장되었습니다.');
    } catch (error) {
      console.error('Failed to save profile:', error);
      alert('프로필 저장에 실패했습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  const deleteAddress = async (id: string) => {
    if (!confirm('이 주소를 삭제하시겠습니까?')) return;

    try {
      await deleteDoc(doc(db, 'addresses', id));
      setAddresses(addresses.filter(addr => addr.id !== id));
    } catch (error) {
      console.error('Failed to delete address:', error);
      alert('주소 삭제에 실패했습니다.');
    }
  };

  const setDefaultAddress = async (id: string) => {
    if (!user) return;

    try {
      // Update all addresses for this user
      const batch = addresses.map(async (addr) => {
        const addressRef = doc(db, 'addresses', addr.id);
        await updateDoc(addressRef, {
          isDefault: addr.id === id
        });
      });

      await Promise.all(batch);

      setAddresses(addresses.map(addr => ({
        ...addr,
        isDefault: addr.id === id
      })));
    } catch (error) {
      console.error('Failed to set default address:', error);
      alert('기본 배송지 설정에 실패했습니다.');
    }
  };

  return (
    <div className="space-y-6">
      {/* Navigation Buttons */}
      <div className="flex gap-2">
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

      <div>
        <h1 className="text-2xl font-bold text-gray-800">내 정보</h1>
        <p className="text-gray-600 mt-1">개인정보를 관리하고 수정할 수 있습니다</p>
      </div>

      {/* Profile Image */}
      <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-6">
        <h2 className="text-lg font-bold text-gray-800 mb-4">프로필 이미지</h2>
        <div className="flex items-center gap-6">
          <div className="relative">
            <div className="w-24 h-24 bg-gray-200 rounded-full flex items-center justify-center">
              <span className="text-3xl text-gray-500">{name.charAt(0) || 'U'}</span>
            </div>
            <button className="absolute bottom-0 right-0 p-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-colors">
              <Camera size={16} />
            </button>
          </div>
          <div>
            <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
              이미지 업로드
            </button>
            <p className="text-sm text-gray-500 mt-2">JPG, PNG 파일, 최대 5MB</p>
          </div>
        </div>
      </div>

      {/* Basic Info */}
      <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-6">
        <h2 className="text-lg font-bold text-gray-800 mb-4">기본 정보</h2>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">이름</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">전화번호</label>
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">생년월일</label>
            <input
              type="date"
              value={birthDate}
              onChange={(e) => setBirthDate(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
            />
          </div>
        </div>
      </div>

      {/* Account Info */}
      <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-6">
        <h2 className="text-lg font-bold text-gray-800 mb-4">계정 정보</h2>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">이메일</label>
            <input
              type="email"
              value={email}
              disabled
              className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-500 cursor-not-allowed"
            />
            <p className="text-sm text-gray-500 mt-1">이메일은 변경할 수 없습니다</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">비밀번호</label>
            <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
              비밀번호 변경
            </button>
          </div>
        </div>
      </div>

      {/* Address Management */}
      <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-gray-800">배송지 관리</h2>
          <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
            <Plus size={20} />
            새 주소 추가
          </button>
        </div>

        <div className="space-y-4">
          {addresses.map((address) => (
            <div
              key={address.id}
              className={`p-4 rounded-lg border-2 ${
                address.isDefault ? 'border-blue-600 bg-blue-50' : 'border-gray-200'
              }`}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <MapPin size={18} className="text-gray-500" />
                    <span className="font-medium text-gray-800">{address.name}</span>
                    {address.isDefault && (
                      <span className="px-2 py-0.5 text-xs font-medium bg-blue-600 text-white rounded">
                        기본 배송지
                      </span>
                    )}
                  </div>
                  <p className="text-gray-600 ml-6">
                    ({address.zipCode}) {address.address} {address.detailAddress}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  {!address.isDefault && (
                    <button
                      onClick={() => setDefaultAddress(address.id)}
                      className="px-3 py-1 text-sm border border-gray-300 rounded hover:bg-gray-50 transition-colors"
                    >
                      기본 설정
                    </button>
                  )}
                  <button
                    onClick={() => deleteAddress(address.id)}
                    className="p-2 text-red-600 hover:bg-red-50 rounded transition-colors"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Save Button */}
      <div className="flex justify-end">
        <button
          onClick={handleSave}
          disabled={isLoading}
          className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? '저장 중...' : '변경사항 저장'}
        </button>
      </div>
    </div>
  );
}