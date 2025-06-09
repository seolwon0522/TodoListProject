'use client';

import { useRouter } from 'next/navigation';
import { useAuth } from '../../lib/hooks/useAuth';
import { useTodos } from '../../lib/hooks/useTodos';
import PointDisplay from '../components/PointDisplay';
import Link from 'next/link';

export default function MePage() {
    const { user, logout, loading, error, isAuthenticated } = useAuth();
    const { todos } = useTodos();
    const router = useRouter();

    const handleLogout = async () => {
        try {
            await logout();
            router.push('/');
        } catch (error) {
            console.error('로그아웃 실패:', error);
        }
    };

    // 로딩 중
    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                    <p className="mt-4 text-gray-600">사용자 정보를 불러오는 중...</p>
                </div>
            </div> 
        );
    }

    // 인증되지 않은 사용자
    if (!isAuthenticated || !user) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="max-w-md mx-auto text-center">
                    <div className="bg-white rounded-lg shadow-sm p-8">
                        <h2 className="text-2xl font-bold text-gray-900 mb-4">로그인이 필요합니다</h2>
                        <p className="text-gray-600 mb-6">
                            내 정보를 확인하려면 먼저 로그인해주세요.
                        </p>
                        <div className="space-y-3">
                            <Link
                                href="/login"
                                className="block w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg font-medium transition-colors"
                            >
                                로그인하기
                            </Link>
                            <Link
                                href="/register"
                                className="block w-full bg-gray-100 hover:bg-gray-200 text-gray-700 py-2 px-4 rounded-lg font-medium transition-colors"
                            >
                                회원가입하기
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    // 할 일 통계 계산
    const todoStats = {
        total: todos.length,
        todo: todos.filter(t => t.status === 'TODO').length,
        inProgress: todos.filter(t => t.status === 'IN_PROGRESS').length,
        done: todos.filter(t => t.status === 'DONE').length
    };

    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* 에러 메시지 */}
                {error && (
                    <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
                        <p className="text-red-800">{error}</p>
                    </div>
                )}

                {/* 사용자 정보 카드 */}
                <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900">
                                안녕하세요, {user.userName}님! 👋
                            </h1>
                            <p className="text-gray-600 mt-1">
                                아이디: <span className="font-medium">{user.userId}</span>
                            </p>
                        </div>
                        <button
                            onClick={handleLogout}
                            className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
                        >
                            로그아웃
                        </button>
                    </div>
                </div>

                {/* 포인트 정보 */}
                <div className="mb-6">
                    <PointDisplay userId={user.id} />
                </div>

                {/* 할 일 통계 */}
                <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
                    <h2 className="text-xl font-semibold text-gray-900 mb-4">나의 할 일 통계</h2>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div className="text-center p-4 bg-blue-50 rounded-lg">
                            <div className="text-2xl font-bold text-blue-600">{todoStats.total}</div>
                            <p className="text-sm text-gray-600">전체 할 일</p>
                        </div>
                        <div className="text-center p-4 bg-gray-50 rounded-lg">
                            <div className="text-2xl font-bold text-gray-600">{todoStats.todo}</div>
                            <p className="text-sm text-gray-600">할 일</p>
                        </div>
                        <div className="text-center p-4 bg-yellow-50 rounded-lg">
                            <div className="text-2xl font-bold text-yellow-600">{todoStats.inProgress}</div>
                            <p className="text-sm text-gray-600">진행 중</p>
                        </div>
                        <div className="text-center p-4 bg-green-50 rounded-lg">
                            <div className="text-2xl font-bold text-green-600">{todoStats.done}</div>
                            <p className="text-sm text-gray-600">완료</p>
                        </div>
                    </div>
                </div>

                {/* 빠른 액션 */}
                <div className="bg-white rounded-lg shadow-sm p-6">
                    <h2 className="text-xl font-semibold text-gray-900 mb-4">빠른 액션</h2>
                    <div className="flex justify-center">
                        <Link
                            href="/kanban"
                            className="flex items-center p-6 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors max-w-md"
                        >
                            <div className="text-3xl mr-4">📋</div>
                            <div>
                                <h3 className="font-medium text-gray-900">칸반보드로 이동</h3>
                                <p className="text-sm text-gray-600">할 일을 생성하고 드래그 앤 드롭으로 상태를 관리하세요</p>
                            </div>
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
