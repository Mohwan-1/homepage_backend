'use client';

import { useState } from 'react';
import DataTable, { ColumnDef, TableAction } from '@/components/admin/data-table';
import { Search, Filter, UserPlus } from 'lucide-react';

interface UserTableData {
  id: string;
  name: string;
  email: string;
  role: 'user' | 'admin';
  status: 'active' | 'inactive' | 'suspended';
  createdAt: string;
  lastLoginAt?: string;
}

const mockUsers: UserTableData[] = [
  {
    id: '1',
    name: '김철수',
    email: 'kim@example.com',
    role: 'user',
    status: 'active',
    createdAt: '2024-01-15',
    lastLoginAt: '2024-01-20'
  },
  {
    id: '2',
    name: '이영희',
    email: 'lee@example.com',
    role: 'admin',
    status: 'active',
    createdAt: '2024-01-10',
    lastLoginAt: '2024-01-20'
  },
  {
    id: '3',
    name: '박민수',
    email: 'park@example.com',
    role: 'user',
    status: 'inactive',
    createdAt: '2024-01-05',
    lastLoginAt: '2024-01-15'
  },
  {
    id: '4',
    name: '정수진',
    email: 'jung@example.com',
    role: 'user',
    status: 'suspended',
    createdAt: '2023-12-20',
    lastLoginAt: '2024-01-10'
  },
  {
    id: '5',
    name: '최지훈',
    email: 'choi@example.com',
    role: 'user',
    status: 'active',
    createdAt: '2023-12-15',
    lastLoginAt: '2024-01-19'
  },
];

export default function UsersPage() {
  const [users, setUsers] = useState<UserTableData[]>(mockUsers);
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState<'all' | 'user' | 'admin'>('all');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'inactive' | 'suspended'>('all');

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

  const actions: TableAction<UserTableData>[] = [
    {
      label: '상세보기',
      onClick: (user) => alert(`${user.name}님의 상세 정보`),
    },
    {
      label: '수정',
      onClick: (user) => alert(`${user.name}님 정보 수정`),
    },
    {
      label: '삭제',
      onClick: (user) => {
        if (confirm(`${user.name}님을 삭제하시겠습니까?`)) {
          setUsers(users.filter(u => u.id !== user.id));
        }
      },
      variant: 'destructive',
    },
  ];

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