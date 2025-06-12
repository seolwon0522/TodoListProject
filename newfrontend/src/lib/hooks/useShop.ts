import { useState, useEffect, useCallback } from 'react';
import { shopApi } from '../api';
import { ShopItemDto, PurchaseRequestDto, PurchaseResponseDto, UserPurchase, ShopCategory } from '../types';

// 모든 상점 아이템 조회 훅
export const useShopItems = (userId: number) => {
    const [data, setData] = useState<ShopItemDto[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const fetchShopItems = useCallback(async () => {
        if (!userId || userId <= 0) return;
        
        setLoading(true);
        setError(null);
        try {
            const items = await shopApi.getAllShopItems(userId);
            setData(items);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to fetch shop items');
        } finally {
            setLoading(false);
        }
    }, [userId]);

    useEffect(() => {
        fetchShopItems();
    }, [fetchShopItems]);

    return { data, loading, error, refetch: fetchShopItems };
};

// 카테고리별 상점 아이템 조회 훅
export const useShopItemsByCategory = (userId: number, category: ShopCategory | null) => {
    const [data, setData] = useState<ShopItemDto[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const fetchShopItemsByCategory = useCallback(async () => {
        if (!userId || userId <= 0) return;
        
        setLoading(true);
        setError(null);
        try {
            const items = category 
                ? await shopApi.getShopItemsByCategory(userId, category)
                : await shopApi.getAllShopItems(userId);
            setData(items);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to fetch shop items');
        } finally {
            setLoading(false);
        }
    }, [userId, category]);

    useEffect(() => {
        fetchShopItemsByCategory();
    }, [fetchShopItemsByCategory]);

    return { data, loading, error, refetch: fetchShopItemsByCategory };
};

// 구매 가능한 아이템들 조회 훅
export const useAffordableItems = (userId: number) => {
    const [data, setData] = useState<ShopItemDto[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const fetchAffordableItems = useCallback(async () => {
        if (!userId || userId <= 0) return;
        
        setLoading(true);
        setError(null);
        try {
            const items = await shopApi.getAffordableItems(userId);
            setData(items);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to fetch affordable items');
        } finally {
            setLoading(false);
        }
    }, [userId]);

    useEffect(() => {
        fetchAffordableItems();
    }, [fetchAffordableItems]);

    return { data, loading, error, refetch: fetchAffordableItems };
};

// 구매 기록 조회 훅
export const usePurchaseHistory = (userId: number) => {
    const [data, setData] = useState<UserPurchase[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const fetchPurchaseHistory = useCallback(async () => {
        if (!userId || userId <= 0) return;
        
        setLoading(true);
        setError(null);
        try {
            const history = await shopApi.getUserPurchaseHistory(userId);
            setData(history);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to fetch purchase history');
        } finally {
            setLoading(false);
        }
    }, [userId]);

    useEffect(() => {
        fetchPurchaseHistory();
    }, [fetchPurchaseHistory]);

    return { data, loading, error, refetch: fetchPurchaseHistory };
};

// 아이템 구매 훅
export const usePurchaseItem = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const purchaseItem = useCallback(async (request: PurchaseRequestDto): Promise<PurchaseResponseDto> => {
        setLoading(true);
        setError(null);
        try {
            const response = await shopApi.purchaseItem(request);
            return response;
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Failed to purchase item';
            setError(errorMessage);
            throw new Error(errorMessage);
        } finally {
            setLoading(false);
        }
    }, []);

    return { purchaseItem, loading, error };
};

// 상점 관련 상태 관리 훅
export const useShopStore = () => {
    const [selectedCategory, setSelectedCategory] = useState<ShopCategory | null>(null);
    const [showPurchased, setShowPurchased] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');

    // 카테고리 목록
    const categories: ShopCategory[] = ['테마', '스티커', '아바타', '위젯', '기능'];

    // 필터링된 아이템들 반환
    const filterItems = useCallback((items: ShopItemDto[]): ShopItemDto[] => {
        return items.filter(item => {
            // 검색어 필터
            const matchesSearch = item.itemName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                                  item.description.toLowerCase().includes(searchTerm.toLowerCase());
            
            // 구매 상태 필터
            const matchesPurchaseStatus = showPurchased ? item.isPurchased : !item.isPurchased;
            
            // 카테고리 필터
            const matchesCategory = !selectedCategory || item.category === selectedCategory;
            
            return matchesSearch && matchesPurchaseStatus && matchesCategory;
        });
    }, [searchTerm, showPurchased, selectedCategory]);

    return {
        selectedCategory,
        setSelectedCategory,
        showPurchased,
        setShowPurchased,
        searchTerm,
        setSearchTerm,
        categories,
        filterItems
    };
}; 