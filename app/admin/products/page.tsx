'use client';

import { useState } from 'react';
import DataTable, { ColumnDef, TableAction } from '@/components/admin/data-table';
import { Search, Plus, Package } from 'lucide-react';

interface ProductAdmin {
  id: string;
  name: string;
  price: number;
  stock: number;
  category: string;
  status: 'active' | 'inactive' | 'discontinued';
  isVisible: boolean;
  createdAt: string;
  updatedAt: string;
}

const mockProducts: ProductAdmin[] = [
  {
    id: '1',
    name: '스마트폰 케이스',
    price: 29000,
    stock: 150,
    category: '액세서리',
    status: 'active',
    isVisible: true,
    createdAt: '2024-01-10',
    updatedAt: '2024-01-15'
  },
  {
    id: '2',
    name: '무선 이어폰',
    price: 89000,
    stock: 45,
    category: '전자기기',
    status: 'active',
    isVisible: true,
    createdAt: '2024-01-08',
    updatedAt: '2024-01-12'
  },
  {
    id: '3',
    name: '노트북 가방',
    price: 49000,
    stock: 0,
    category: '가방',
    status: 'inactive',
    isVisible: false,
    createdAt: '2024-01-05',
    updatedAt: '2024-01-10'
  },
  {
    id: '4',
    name: '마우스',
    price: 35000,
    stock: 80,
    category: '전자기기',
    status: 'active',
    isVisible: true,
    createdAt: '2024-01-03',
    updatedAt: '2024-01-08'
  },
  {
    id: '5',
    name: '키보드',
    price: 125000,
    stock: 30,
    category: '전자기기',
    status: 'discontinued',
    isVisible: false,
    createdAt: '2023-12-20',
    updatedAt: '2024-01-05'
  },
];

export default function ProductsPage() {
  const [products, setProducts] = useState<ProductAdmin[]>(mockProducts);
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'inactive' | 'discontinued'>('all');

  const categories = ['all', ...Array.from(new Set(products.map(p => p.category)))];

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = categoryFilter === 'all' || product.category === categoryFilter;
    const matchesStatus = statusFilter === 'all' || product.status === statusFilter;

    return matchesSearch && matchesCategory && matchesStatus;
  });

  const columns: ColumnDef<ProductAdmin>[] = [
    {
      key: 'name',
      header: '상품명',
      sortable: true,
    },
    {
      key: 'price',
      header: '가격',
      sortable: true,
      render: (value) => `₩${value.toLocaleString()}`,
    },
    {
      key: 'stock',
      header: '재고',
      sortable: true,
      render: (value) => (
        <span className={value === 0 ? 'text-red-600 font-medium' : ''}>
          {value}
        </span>
      ),
    },
    {
      key: 'category',
      header: '카테고리',
      sortable: true,
    },
    {
      key: 'status',
      header: '상태',
      sortable: true,
      render: (value) => {
        const statusConfig = {
          active: { label: '판매중', color: 'bg-green-100 text-green-600' },
          inactive: { label: '품절', color: 'bg-yellow-100 text-yellow-600' },
          discontinued: { label: '단종', color: 'bg-red-100 text-red-600' },
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
      key: 'isVisible',
      header: '노출',
      sortable: true,
      render: (value) => (
        <span className={`px-2 py-1 text-xs font-medium rounded ${
          value ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-600'
        }`}>
          {value ? '노출' : '숨김'}
        </span>
      ),
    },
    {
      key: 'updatedAt',
      header: '최종 수정',
      sortable: true,
    },
  ];

  const actions: TableAction<ProductAdmin>[] = [
    {
      label: '수정',
      onClick: (product) => alert(`${product.name} 수정`),
    },
    {
      label: '재고관리',
      onClick: (product) => alert(`${product.name} 재고 관리`),
    },
    {
      label: '삭제',
      onClick: (product) => {
        if (confirm(`${product.name}을(를) 삭제하시겠습니까?`)) {
          setProducts(products.filter(p => p.id !== product.id));
        }
      },
      variant: 'destructive',
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">상품 관리</h1>
          <p className="text-gray-600 mt-1">총 {filteredProducts.length}개 상품</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
          <Plus size={20} />
          상품 추가
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
                placeholder="상품명 검색..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
              />
            </div>
          </div>

          {/* Category Filter */}
          <div>
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
            >
              <option value="all">모든 카테고리</option>
              {categories.filter(c => c !== 'all').map(category => (
                <option key={category} value={category}>{category}</option>
              ))}
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
              <option value="active">판매중</option>
              <option value="inactive">품절</option>
              <option value="discontinued">단종</option>
            </select>
          </div>
        </div>
      </div>

      {/* Stock Warning */}
      {products.filter(p => p.stock < 10 && p.status === 'active').length > 0 && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <div className="flex items-center gap-2 text-yellow-800">
            <Package size={20} />
            <span className="font-medium">
              재고 부족 상품 {products.filter(p => p.stock < 10 && p.status === 'active').length}개
            </span>
          </div>
        </div>
      )}

      {/* Data Table */}
      <DataTable
        data={filteredProducts}
        columns={columns}
        actions={actions}
        onRowClick={(product) => console.log('Product clicked:', product)}
      />
    </div>
  );
}