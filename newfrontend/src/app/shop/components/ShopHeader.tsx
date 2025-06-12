interface ShopHeaderProps {
    userPoints: number;
    searchTerm: string;
    onSearchChange: (term: string) => void;
    showPurchased: boolean;
    onShowPurchasedChange: (show: boolean) => void;
}

export default function ShopHeader({
    userPoints,
    searchTerm,
    onSearchChange,
    showPurchased,
    onShowPurchasedChange
}: ShopHeaderProps) {
    return (
        <div className="bg-white shadow-sm border-b">
            <div className="max-w-7xl mx-auto px-4 py-6">
                {/* 타이틀과 포인트 */}
                <div className="flex flex-col md:flex-row md:items-center justify-between mb-6">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900 mb-2">
                            🛍️ 포인트 상점
                        </h1>
                        <p className="text-gray-600">
                            집중 시간으로 얻은 포인트로 다양한 아이템을 구매해보세요!
                        </p>
                    </div>
                    <div className="mt-4 md:mt-0 flex items-center space-x-4">
                        <a
                            href="/shop/history"
                            className="px-3 py-2 text-sm font-medium text-blue-600 hover:text-blue-800 border border-blue-200 rounded-lg hover:bg-blue-50 transition-colors"
                        >
                            📋 구매 기록
                        </a>
                        <div className="bg-blue-50 px-4 py-3 rounded-lg border border-blue-200">
                            <div className="flex items-center space-x-2">
                                <span className="text-blue-600 font-medium">💰 보유 포인트:</span>
                                <span className="text-2xl font-bold text-blue-800">
                                    {userPoints.toLocaleString()}P
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* 검색 및 필터 */}
                <div className="flex flex-col md:flex-row gap-4">
                    {/* 검색창 */}
                    <div className="flex-1 relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                            </svg>
                        </div>
                        <input
                            type="text"
                            placeholder="아이템 이름이나 설명으로 검색..."
                            value={searchTerm}
                            onChange={(e) => onSearchChange(e.target.value)}
                            className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                        />
                    </div>

                    {/* 구매 상태 토글 */}
                    <div className="flex items-center space-x-4">
                        <label className="flex items-center space-x-2 cursor-pointer">
                            <input
                                type="checkbox"
                                checked={showPurchased}
                                onChange={(e) => onShowPurchasedChange(e.target.checked)}
                                className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 focus:ring-2"
                            />
                            <span className="text-sm font-medium text-gray-700">
                                구매한 아이템만 보기
                            </span>
                        </label>
                    </div>
                </div>
            </div>
        </div>
    );
} 