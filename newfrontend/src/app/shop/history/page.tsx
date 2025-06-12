'use client';


import { usePurchaseHistory } from '@/lib/hooks/useShop';
import { useAuth } from '@/lib/hooks/useAuth';
import Link from 'next/link';

export default function PurchaseHistoryPage() {
    // 인증 상태 및 사용자 정보
    const { user, loading: authLoading, isAuthenticated } = useAuth();
    const { data: purchases, loading, error } = usePurchaseHistory(user?.id || 0);

    // 카테고리별 이모지 매핑
    const getCategoryEmoji = (category: string) => {
        const emojis: Record<string, string> = {
            '테마': '🎨',
            '스티커': '✨',
            '아바타': '👤',
            '위젯': '📊',
            '기능': '⚙️'
        };
        return emojis[category] || '🛍️';
    };

    // 날짜 포맷팅
    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleString('ko-KR', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    // 총 지출 포인트 계산
    const totalSpent = purchases?.reduce((sum, purchase) => sum + purchase.shopItem.price, 0) || 0;

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
                    <p className="text-gray-600 mb-8">구매 기록을 확인하려면 먼저 로그인해주세요.</p>
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
                    <p className="text-gray-600">구매 기록을 불러오는 중...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="text-center">
                    <div className="text-red-500 text-xl mb-4">⚠️</div>
                    <p className="text-red-600 mb-4">구매 기록을 불러오는데 실패했습니다.</p>
                    <Link
                        href="/shop"
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                    >
                        상점으로 돌아가기
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            {/* 헤더 */}
            <div className="bg-white shadow-sm border-b">
                <div className="max-w-4xl mx-auto px-4 py-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900 mb-2">
                                📋 구매 기록
                            </h1>
                            <p className="text-gray-600">
                                지금까지 구매한 아이템들을 확인해보세요.
                            </p>
                        </div>
                        <Link
                            href="/shop"
                            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                        >
                            상점으로 가기
                        </Link>
                    </div>

                    {/* 통계 */}
                    {purchases && purchases.length > 0 && (
                        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                                <div className="text-blue-600 text-sm font-medium">총 구매 아이템</div>
                                <div className="text-2xl font-bold text-blue-800">{purchases.length}개</div>
                            </div>
                            <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                                <div className="text-green-600 text-sm font-medium">총 지출 포인트</div>
                                <div className="text-2xl font-bold text-green-800">{totalSpent.toLocaleString()}P</div>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            <div className="max-w-4xl mx-auto px-4 py-8">
                {purchases && purchases.length === 0 ? (
                    <div className="text-center py-16">
                        <div className="text-gray-400 text-6xl mb-4">🛒</div>
                        <p className="text-gray-600 text-lg mb-4">아직 구매한 아이템이 없습니다.</p>
                        <Link
                            href="/shop"
                            className="inline-block px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                        >
                            상점에서 쇼핑하기
                        </Link>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {purchases?.map((purchase) => (
                            <div key={purchase.id} className="bg-white rounded-lg shadow-sm border p-6">
                                <div className="flex items-start justify-between">
                                    <div className="flex items-start space-x-4">
                                        <span className="text-2xl">
                                            {getCategoryEmoji(purchase.shopItem.category)}
                                        </span>
                                        <div className="flex-1">
                                            <h3 className="font-semibold text-gray-900 text-lg">
                                                {purchase.shopItem.itemName}
                                            </h3>
                                            <p className="text-gray-600 text-sm mt-1">
                                                {purchase.shopItem.description}
                                            </p>
                                            <div className="flex items-center space-x-3 mt-2">
                                                <span className="inline-block bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded-full">
                                                    {purchase.shopItem.category}
                                                </span>
                                                <span className="text-sm text-gray-500">
                                                    {formatDate(purchase.purchasedAt)}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <div className="text-xl font-bold text-blue-600">
                                            {purchase.shopItem.price.toLocaleString()}P
                                        </div>
                                        <div className="text-xs text-gray-500 mt-1">구매 완료</div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
} 