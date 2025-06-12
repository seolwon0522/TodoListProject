import { ShopCategory } from '@/lib/types';

interface CategoryFilterProps {
    categories: ShopCategory[];
    selectedCategory: ShopCategory | null;
    onCategoryChange: (category: ShopCategory | null) => void;
}

export default function CategoryFilter({
    categories,
    selectedCategory,
    onCategoryChange
}: CategoryFilterProps) {
    // 카테고리별 이모지 매핑
    const categoryEmojis: Record<ShopCategory, string> = {
        '테마': '🎨',
        '스티커': '✨',
        '아바타': '👤',
        '위젯': '📊',
        '기능': '⚙️'
    };

    return (
        <div className="bg-white rounded-lg shadow-sm border p-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">카테고리</h3>
            <div className="flex flex-wrap gap-2">
                {/* 전체 카테고리 버튼 */}
                <button
                    onClick={() => onCategoryChange(null)}
                    className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                        selectedCategory === null
                            ? 'bg-blue-600 text-white'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                >
                    🏪 전체
                </button>

                {/* 카테고리 버튼들 */}
                {categories.map((category) => (
                    <button
                        key={category}
                        onClick={() => onCategoryChange(category)}
                        className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                            selectedCategory === category
                                ? 'bg-blue-600 text-white'
                                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                    >
                        {categoryEmojis[category]} {category}
                    </button>
                ))}
            </div>
        </div>
    );
} 