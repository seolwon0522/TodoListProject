import { ShopItemDto } from '@/lib/types';

interface ShopItemCardProps {
    item: ShopItemDto;
    onPurchase: () => void;
}

export default function ShopItemCard({ item, onPurchase }: ShopItemCardProps) {
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

    return (
        <div className="bg-white rounded-lg shadow-sm border hover:shadow-md transition-shadow">
            <div className="p-6">
                {/* 헤더 */}
                <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center space-x-2">
                        <span className="text-2xl">{getCategoryEmoji(item.category)}</span>
                        <div>
                            <h3 className="font-semibold text-gray-900 text-lg">{item.itemName}</h3>
                            <span className="inline-block bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded-full">
                                {item.category}
                            </span>
                        </div>
                    </div>
                    {item.isPurchased && (
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                            ✓ 구매 완료
                        </span>
                    )}
                </div>

                {/* 설명 */}
                <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                    {item.description}
                </p>

                {/* 가격 및 구매 버튼 */}
                <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-1">
                        <span className="text-xl font-bold text-blue-600">
                            {item.price.toLocaleString()}
                        </span>
                        <span className="text-sm text-gray-500">P</span>
                    </div>

                    {item.isPurchased ? (
                        <button 
                            disabled 
                            className="px-4 py-2 bg-gray-100 text-gray-500 rounded-lg text-sm font-medium cursor-not-allowed"
                        >
                            구매 완료
                        </button>
                    ) : item.canPurchase ? (
                        <button
                            onClick={onPurchase}
                            className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
                        >
                            구매하기
                        </button>
                    ) : (
                        <button 
                            disabled 
                            className="px-4 py-2 bg-gray-100 text-gray-500 rounded-lg text-sm font-medium cursor-not-allowed"
                        >
                            포인트 부족
                        </button>
                    )}
                </div>

                {/* 구매 불가능한 경우 추가 정보 */}
                {!item.isPurchased && !item.canPurchase && (
                    <div className="mt-3 text-xs text-gray-500 text-center">
                        💰 더 많은 포인트가 필요해요!
                    </div>
                )}
            </div>
        </div>
    );
} 