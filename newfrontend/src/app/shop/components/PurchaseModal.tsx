import { ShopItemDto } from '@/lib/types';

interface PurchaseModalProps {
    item: ShopItemDto;
    userPoints: number;
    onConfirm: () => void;
    onCancel: () => void;
    loading: boolean;
}

export default function PurchaseModal({
    item,
    userPoints,
    onConfirm,
    onCancel,
    loading
}: PurchaseModalProps) {
    const remainingPoints = userPoints - item.price;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg max-w-md w-full p-6">
                {/* 헤더 */}
                <div className="flex items-center justify-between mb-6">
                    <h3 className="text-xl font-semibold text-gray-900">
                        구매 확인
                    </h3>
                    <button
                        onClick={onCancel}
                        disabled={loading}
                        className="text-gray-400 hover:text-gray-600 disabled:opacity-50"
                    >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                {/* 아이템 정보 */}
                <div className="bg-gray-50 rounded-lg p-4 mb-6">
                    <div className="flex items-start space-x-3">
                        <span className="text-2xl">
                            {item.category === '테마' ? '🎨' :
                             item.category === '스티커' ? '✨' :
                             item.category === '아바타' ? '👤' :
                             item.category === '위젯' ? '📊' :
                             item.category === '기능' ? '⚙️' : '🛍️'}
                        </span>
                        <div className="flex-1">
                            <h4 className="font-semibold text-gray-900">{item.itemName}</h4>
                            <p className="text-sm text-gray-600 mt-1">{item.description}</p>
                            <div className="flex items-center justify-between mt-3">
                                <span className="text-xs bg-gray-200 text-gray-700 px-2 py-1 rounded">
                                    {item.category}
                                </span>
                                <span className="text-lg font-bold text-blue-600">
                                    {item.price.toLocaleString()}P
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* 포인트 정보 */}
                <div className="space-y-3 mb-6">
                    <div className="flex justify-between text-sm">
                        <span className="text-gray-600">현재 보유 포인트:</span>
                        <span className="font-medium">{userPoints.toLocaleString()}P</span>
                    </div>
                    <div className="flex justify-between text-sm">
                        <span className="text-gray-600">아이템 가격:</span>
                        <span className="font-medium text-red-600">-{item.price.toLocaleString()}P</span>
                    </div>
                    <div className="border-t pt-3">
                        <div className="flex justify-between">
                            <span className="font-medium text-gray-900">구매 후 남은 포인트:</span>
                            <span className={`font-bold ${remainingPoints >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                                {remainingPoints.toLocaleString()}P
                            </span>
                        </div>
                    </div>
                </div>

                {/* 경고 메시지 */}
                {remainingPoints < 0 && (
                    <div className="bg-red-50 border border-red-200 rounded-lg p-3 mb-6">
                        <div className="flex items-center">
                            <span className="text-red-500 mr-2">⚠️</span>
                            <p className="text-sm text-red-700">
                                포인트가 부족합니다. 더 많은 포인트를 모아주세요!
                            </p>
                        </div>
                    </div>
                )}

                {/* 액션 버튼들 */}
                <div className="flex space-x-3">
                    <button
                        type="button"
                        onClick={onCancel}
                        disabled={loading}
                        className="flex-1 px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 border border-gray-300 rounded-lg hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        취소
                    </button>
                    <button
                        type="button"
                        onClick={onConfirm}
                        disabled={loading || remainingPoints < 0}
                        className="flex-1 px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {loading ? (
                            <span className="flex items-center justify-center">
                                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                구매 중...
                            </span>
                        ) : (
                            '구매하기'
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
} 