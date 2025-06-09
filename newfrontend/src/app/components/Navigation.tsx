'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '../../lib/hooks/useAuth';

export default function Navigation() {
    const pathname = usePathname();
    const { user, logout, isAuthenticated, loading } = useAuth();

    const handleLogout = async () => {
        try {
            await logout();
            // useAuth 훅에서 페이지 새로고침을 처리함
        } catch (error) {
            console.error('로그아웃 실패:', error);
        }
    };

    // 인증된 사용자용 메뉴
    const authenticatedNavItems = [
        { href: '/', label: '홈', icon: '🏠' },
        { href: '/kanban', label: '칸반보드', icon: '📋' },
        { href: '/me', label: '내 정보', icon: '👨‍💼' },
    ];

    // 비인증 사용자용 메뉴
    const unauthenticatedNavItems = [
        { href: '/', label: '홈', icon: '🏠' },
        { href: '/login', label: '로그인', icon: '🔐' },
        { href: '/register', label: '회원가입', icon: '👤' },
    ];

    const navItems = isAuthenticated ? authenticatedNavItems : unauthenticatedNavItems;

    return (
        <nav className="bg-white shadow-sm border-b">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16">
                    <div className="flex">
                        {/* 로고 */}
                        <div className="flex-shrink-0 flex items-center">
                            <Link href="/" className="text-xl font-bold text-blue-600">
                                TodoApp
                            </Link>
                        </div>

                        {/* 네비게이션 메뉴 */}
                        <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
                            {navItems.map((item) => (
                                <Link
                                    key={item.href}
                                    href={item.href}
                                    className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium transition-colors ${
                                        pathname === item.href
                                            ? 'border-blue-500 text-gray-900'
                                            : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                                    }`}
                                >
                                    <span className="mr-2">{item.icon}</span>
                                    {item.label}
                                </Link>
                            ))}
                        </div>
                    </div>

                    {/* 사용자 정보 및 로그아웃 */}
                    <div className="flex items-center space-x-4">
                        {loading ? (
                            <div className="text-sm text-gray-500">로딩 중...</div>
                        ) : isAuthenticated && user ? (
                            <>
                                <span className="text-sm text-gray-700">
                                    안녕하세요, <span className="font-medium">{user.userName}</span>님!
                                </span>
                                <button
                                    onClick={handleLogout}
                                    className="text-sm text-gray-500 hover:text-gray-700 transition-colors"
                                >
                                    로그아웃
                                </button>
                            </>
                        ) : (
                            <div className="text-sm text-gray-500">
                                로그인이 필요합니다
                            </div>
                        )}

                        {/* 모바일 메뉴 버튼 */}
                        <div className="sm:hidden flex items-center">
                            <button
                                type="button"
                                className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100"
                                aria-expanded="false"
                            >
                                <span className="sr-only">메뉴 열기</span>
                                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                                </svg>
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* 모바일 메뉴 (기본적으로 숨김) */}
            <div className="sm:hidden">
                <div className="pt-2 pb-3 space-y-1">
                    {navItems.map((item) => (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={`block pl-3 pr-4 py-2 border-l-4 text-base font-medium transition-colors ${
                                pathname === item.href
                                    ? 'bg-blue-50 border-blue-500 text-blue-700'
                                    : 'border-transparent text-gray-500 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-700'
                            }`}
                        >
                            <span className="mr-2">{item.icon}</span>
                            {item.label}
                        </Link>
                    ))}
                    
                    {/* 모바일에서 로그아웃 버튼 */}
                    {isAuthenticated && (
                        <button
                            onClick={handleLogout}
                            className="block w-full text-left pl-3 pr-4 py-2 border-l-4 border-transparent text-gray-500 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-700 text-base font-medium"
                        >
                            🚪 로그아웃
                        </button>
                    )}
                </div>
            </div>
        </nav>
    );
} 