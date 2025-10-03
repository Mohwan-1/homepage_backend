'use client';

import { useState, useEffect } from 'react';
import DataTable, { ColumnDef, TableAction } from '@/components/admin/data-table';
import { Search, Plus, Package } from 'lucide-react';
import { collection, getDocs, query, orderBy, deleteDoc, doc, updateDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';

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

export default function ProductsPage() {
  const [products, setProducts] = useState<ProductAdmin[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'inactive' | 'discontinued'>('all');

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    try {
      setLoading(true);
      const productsQuery = query(
        collection(db, 'products'),
        orderBy('createdAt', 'desc')
      );
      const querySnapshot = await getDocs(productsQuery);
      const productsData: ProductAdmin[] = querySnapshot.docs.map(doc => {
        const data = doc.data();
        return {
          id: doc.id,
          name: data.name || 'Unknown',
          price: data.price || 0,
          stock: data.stock || 0,
          category: data.category || '미분류',
          status: data.status || 'active',
          isVisible: data.isVisible !== undefined ? data.isVisible : true,
          createdAt: data.createdAt ? new Date(data.createdAt).toLocaleDateString('ko-KR') : '-',
          updatedAt: data.updatedAt ? new Date(data.updatedAt).toLocaleDateString('ko-KR') : '-'
        };
      });
      setProducts(productsData);
    } catch (error) {
      console.error('Failed to load products:', error);
      alert('상품 목록을 불러오는데 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

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

  const deleteProduct = async (productId: string) => {
    try {
      await deleteDoc(doc(db, 'products', productId));
      await loadProducts();
      alert('상품이 삭제되었습니다.');
    } catch (error) {
      console.error('Failed to delete product:', error);
      alert('상품 삭제에 실패했습니다.');
    }
  };

  const toggleVisibility = async (product: ProductAdmin) => {
    try {
      await updateDoc(doc(db, 'products', product.id), {
        isVisible: !product.isVisible,
        updatedAt: new Date().toISOString()
      });
      await loadProducts();
      alert(`${product.name}의 노출 상태가 변경되었습니다.`);
    } catch (error) {
      console.error('Failed to toggle visibility:', error);
      alert('노출 상태 변경에 실패했습니다.');
    }
  };

  const actions: TableAction<ProductAdmin>[] = [
    {
      label: '노출 토글',
      onClick: (product) => {
        if (confirm(`${product.name}을(를) ${product.isVisible ? '숨기기' : '노출'}하시겠습니까?`)) {
          toggleVisibility(product);
        }
      },
    },
    {
      label: '재고관리',
      onClick: (product) => {
        const newStock = prompt(`${product.name}의 새로운 재고 수량을 입력하세요 (현재: ${product.stock}):`, product.stock.toString());
        if (newStock !== null) {
          const stockNumber = parseInt(newStock);
          if (!isNaN(stockNumber) && stockNumber >= 0) {
            updateDoc(doc(db, 'products', product.id), {
              stock: stockNumber,
              updatedAt: new Date().toISOString()
            }).then(() => {
              loadProducts();
              alert('재고가 업데이트되었습니다.');
            }).catch((error) => {
              console.error('Failed to update stock:', error);
              alert('재고 업데이트에 실패했습니다.');
            });
          } else {
            alert('올바른 숫자를 입력하세요.');
          }
        }
      },
    },
    {
      label: '삭제',
      onClick: (product) => {
        if (confirm(`${product.name}을(를) 삭제하시겠습니까?\n이 작업은 되돌릴 수 없습니다.`)) {
          deleteProduct(product.id);
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
          <p className="text-gray-600">상품 목록 로딩 중...</p>
        </div>
      </div>
    );
  }

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