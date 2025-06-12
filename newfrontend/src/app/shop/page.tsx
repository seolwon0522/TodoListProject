'use client';

import { useState, useEffect } from 'react';
import { useShopItems, useShopStore, usePurchaseItem } from '@/lib/hooks/useShop';
import { useAuth } from '@/lib/hooks/useAuth';
import { pointApi, shopApi } from '@/lib/api';
import { ShopItemDto, ShopCategory, PointResponseDto } from '@/lib/types';
import ShopHeader from './components/ShopHeader';
import CategoryFilter from './components/CategoryFilter';
import ShopItemCard from './components/ShopItemCard';
import PurchaseModal from './components/PurchaseModal';

export default function ShopPage() {
    const [userPoints, setUserPoints] = useState<PointResponseDto | null>(null);
    const [selectedItem, setSelectedItem] = useState<ShopItemDto | null>(null);
    const [showPurchaseModal, setShowPurchaseModal] = useState(false);

    // 인증 상태 및 사용자 정보
    const { user, loading: authLoading, isAuthenticated } = useAuth();

    // 커스텀 훅들
    const { data: shopItems, loading, error, refetch } = useShopItems(user?.id || 0);
    const { purchaseItem, loading: purchasing, error: purchaseError } = usePurchaseItem();
    const {
        selectedCategory,
        setSelectedCategory,
        showPurchased,
        setShowPurchased,
        searchTerm,
        setSearchTerm,
        categories,
        filterItems
    } = useShopStore();

    // 사용자 포인트 조회
    useEffect(() => {
        if (user?.id) {
            const fetchUserPoints = async () => {
                try {
                    const points = await pointApi.getUserPoints(user.id);
                    setUserPoints(points);
                } catch (error) {
                    console.error('Failed to fetch user points:', error);
                }
            };
            fetchUserPoints();
        }
    }, [user?.id]);

    // 구매 처리
    const handlePurchase = async (item: ShopItemDto) => {
        if (!user?.id) return;

        try {
            const response = await purchaseItem({
                userId: user.id,
                shopItemId: item.id
            });

            if (response.success) {
                // 성공 시 데이터 새로고침
                refetch();
                if (user.id) {
                    const updatedPoints = await pointApi.getUserPoints(user.id);
                    setUserPoints(updatedPoints);
                }
                setShowPurchaseModal(false);
                alert(`${item.itemName} 구매 완료!\n남은 포인트: ${response.remainingPoints}`);
            } else {
                alert(`구매 실패: ${response.message}`);
            }
        } catch (error) {
            console.error('Purchase failed:', error);
            alert('구매 중 오류가 발생했습니다.');
        }
    };

    // 구매 모달 열기
    const openPurchaseModal = (item: ShopItemDto) => {
        setSelectedItem(item);
        setShowPurchaseModal(true);
    };

    // 필터링된 아이템들
    const filteredItems = shopItems ? filterItems(shopItems) : [];

    // 인증 로딩 중
    if (authLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
                    <p className="text-gray-600">사용자 정보를 확인하는 중...</p>
                </div>
            </div>
        );
    }

    // 로그인하지 않은 상태
    if (!isAuthenticated) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="text-center">
                    <div className="text-blue-500 text-6xl mb-4">🔐</div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-4">로그인이 필요합니다</h2>
                    <p className="text-gray-600 mb-8">상점을 이용하려면 먼저 로그인해주세요.</p>
                    <a
                        href="/login"
                        className="inline-block px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                        로그인하기
                    </a>
                </div>
            </div>
        );
    }

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
                    <p className="text-gray-600">상점 정보를 불러오는 중...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="text-center">
                    <div className="text-red-500 text-xl mb-4">⚠️</div>
                    <p className="text-red-600 mb-4">상점 정보를 불러오는데 실패했습니다.</p>
                    <button
                        onClick={() => refetch()}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                    >
                        다시 시도
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            {/* 헤더 */}
            <ShopHeader 
                userPoints={userPoints?.totalPoints || 0}
                searchTerm={searchTerm}
                onSearchChange={setSearchTerm}
                showPurchased={showPurchased}
                onShowPurchasedChange={setShowPurchased}
            />

            <div className="max-w-7xl mx-auto px-4 py-8">
                {/* 카테고리 필터 */}
                <CategoryFilter
                    categories={categories}
                    selectedCategory={selectedCategory}
                    onCategoryChange={setSelectedCategory}
                />

                {/* 상품 목록 */}
                <div className="mt-8">
                    {filteredItems.length === 0 ? (
                        <div className="text-center py-16">
                            <div className="text-gray-400 text-6xl mb-4">🛍️</div>
                            <p className="text-gray-600 text-lg">
                                {showPurchased ? '구매한 아이템이 없습니다.' : '조건에 맞는 상품이 없습니다.'}
                            </p>
                            {selectedCategory && (
                                <button
                                    onClick={() => setSelectedCategory(null)}
                                    className="mt-4 text-blue-600 hover:text-blue-800"
                                >
                                    모든 카테고리 보기
                                </button>
                            )}
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                            {filteredItems.map((item) => (
                                <ShopItemCard
                                    key={item.id}
                                    item={item}
                                    onPurchase={() => openPurchaseModal(item)}
                                />
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {/* 구매 확인 모달 */}
            {showPurchaseModal && selectedItem && (
                <PurchaseModal
                    item={selectedItem}
                    userPoints={userPoints?.totalPoints || 0}
                    onConfirm={() => handlePurchase(selectedItem)}
                    onCancel={() => setShowPurchaseModal(false)}
                    loading={purchasing}
                />
            )}
        </div>
    );
} 