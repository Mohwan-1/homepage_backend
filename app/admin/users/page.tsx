'use client';

import { useState, useEffect } from 'react';
import DataTable, { ColumnDef, TableAction } from '@/components/admin/data-table';
import { Search, Filter, UserPlus } from 'lucide-react';
import { collection, getDocs, query, orderBy, deleteDoc, doc, updateDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';

interface UserTableData {
  id: string;
  name: string;
  email: string;
  role: 'user' | 'admin';
  status: 'active' | 'inactive' | 'suspended';
  createdAt: string;
  lastLoginAt?: string;
}

export default function UsersPage() {
  const [users, setUsers] = useState<UserTableData[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState<'all' | 'user' | 'admin'>('all');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'inactive' | 'suspended'>('all');

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      setLoading(true);
      const usersQuery = query(
        collection(db, 'users'),
        orderBy('createdAt', 'desc')
      );
      const querySnapshot = await getDocs(usersQuery);
      const usersData: UserTableData[] = querySnapshot.docs.map(doc => {
        const data = doc.data();
        return {
          id: doc.id,
          name: data.name || 'Unknown',
          email: data.email || '',
          role: data.role || 'user',
          status: data.status || 'active',
          createdAt: new Date(data.createdAt).toLocaleDateString('ko-KR'),
          lastLoginAt: data.lastLoginAt ? new Date(data.lastLoginAt).toLocaleDateString('ko-KR') : undefined
        };
      });
      setUsers(usersData);
    } catch (error) {
      console.error('Failed to load users:', error);
      alert('사용자 목록을 불러오는데 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  const filteredUsers = users.filter(user => {
    const matchesSearch =
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesRole = roleFilter === 'all' || user.role === roleFilter;
    const matchesStatus = statusFilter === 'all' || user.status === statusFilter;

    return matchesSearch && matchesRole && matchesStatus;
  });

  const columns: ColumnDef<UserTableData>[] = [
    {
      key: 'name',
      header: '이름',
      sortable: true,
    },
    {
      key: 'email',
      header: '이메일',
      sortable: true,
    },
    {
      key: 'role',
      header: '역할',
      sortable: true,
      render: (value) => (
        <span className={`px-2 py-1 text-xs font-medium rounded ${
          value === 'admin' ? 'bg-purple-100 text-purple-600' : 'bg-gray-100 text-gray-600'
        }`}>
          {value === 'admin' ? '관리자' : '사용자'}
        </span>
      ),
    },
    {
      key: 'status',
      header: '상태',
      sortable: true,
      render: (value) => {
        const statusConfig = {
          active: { label: '활성', color: 'bg-green-100 text-green-600' },
          inactive: { label: '비활성', color: 'bg-gray-100 text-gray-600' },
          suspended: { label: '정지', color: 'bg-red-100 text-red-600' },
        };
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
      header: '가입일',
      sortable: true,
    },
    {
      key: 'lastLoginAt',
      header: '최근 로그인',
      sortable: true,
      render: (value) => value || '-',
    },
  ];

  const deleteUser = async (userId: string) => {
    try {
      await deleteDoc(doc(db, 'users', userId));
      await loadUsers();
      alert('사용자가 삭제되었습니다.');
    } catch (error) {
      console.error('Failed to delete user:', error);
      alert('사용자 삭제에 실패했습니다.');
    }
  };

  const actions: TableAction<UserTableData>[] = [
    {
      label: '상세보기',
      onClick: (user) => alert(`${user.name}님의 상세 정보 (Firebase UID: ${user.id})`),
    },
    {
      label: '역할변경',
      onClick: async (user) => {
        const newRole = user.role === 'admin' ? 'user' : 'admin';
        if (confirm(`${user.name}님의 역할을 ${newRole === 'admin' ? '관리자' : '사용자'}로 변경하시겠습니까?`)) {
          try {
            await updateDoc(doc(db, 'users', user.id), { role: newRole });
            await loadUsers();
            alert('역할이 변경되었습니다.');
          } catch (error) {
            console.error('Failed to update role:', error);
            alert('역할 변경에 실패했습니다.');
          }
        }
      },
    },
    {
      label: '삭제',
      onClick: (user) => {
        if (confirm(`${user.name}님을 삭제하시겠습니까?\n이 작업은 되돌릴 수 없습니다.`)) {
          deleteUser(user.id);
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
          <p className="text-gray-600">사용자 목록 로딩 중...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">사용자 관리</h1>
          <p className="text-gray-600 mt-1">총 {filteredUsers.length}명의 사용자</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
          <UserPlus size={20} />
          사용자 추가
        </button>
      </div>

      {/* Search and Filters */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* Search */}
          <div className="md:col-span-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="이름 또는 이메일 검색..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
              />
            </div>
          </div>

          {/* Role Filter */}
          <div>
            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value as any)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
            >
              <option value="all">모든 역할</option>
              <option value="user">사용자</option>
              <option value="admin">관리자</option>
            </select>
          </div>

          {/* Status Filter */}
          <div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as any)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
            >
              <option value="all">모든 상태</option>
              <option value="active">활성</option>
              <option value="inactive">비활성</option>
              <option value="suspended">정지</option>
            </select>
          </div>
        </div>
      </div>

      {/* Data Table */}
      <DataTable
        data={filteredUsers}
        columns={columns}
        actions={actions}
        onRowClick={(user) => console.log('Row clicked:', user)}
      />
    </div>
  );
}