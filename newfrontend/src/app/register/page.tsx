'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../lib/hooks/useAuth';
import { UserRequestDto } from '../../lib/types';
import Link from 'next/link';

export default function RegisterPage() {
    const [form, setForm] = useState<UserRequestDto>({ userId: '', userPw: '', userName: '' });
    const [confirmPassword, setConfirmPassword] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const { register, error, isAuthenticated } = useAuth();
    const router = useRouter();

    // 이미 로그인된 사용자는 홈으로 리다이렉트
    useEffect(() => {
        if (isAuthenticated) {
            router.push('/');
        }
    }, [isAuthenticated, router]);

    // 로딩 중이거나 이미 인증된 사용자는 로딩 화면 표시
    if (isAuthenticated) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                    <p className="mt-4 text-gray-600">리다이렉트 중...</p>
                </div>
            </div>
        );
    }

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        // 유효성 검사
        if (!form.userId.trim() || !form.userPw.trim() || !form.userName.trim()) {
            alert('모든 필드를 입력해주세요.');
            return;
        }

        if (form.userPw !== confirmPassword) {
            alert('비밀번호가 일치하지 않습니다.');
            return;
        }

        if (form.userPw.length < 4) {
            alert('비밀번호는 최소 4자 이상이어야 합니다.');
            return;
        }

        try {
            setIsSubmitting(true);
            await register(form);
            alert('회원가입이 완료되었습니다. 로그인 페이지로 이동합니다.');
            router.push('/login');
        } catch (err) {
            console.error('회원가입 실패:', err);
            // useAuth 훅에서 에러 상태를 관리하므로 별도 처리 불필요
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
            <div className="sm:mx-auto sm:w-full sm:max-w-md">
                <h2 className="mt-6 text-center text-3xl font-bold text-gray-900">
                    새 계정 만들기
                </h2>
                <p className="mt-2 text-center text-sm text-gray-600">
                    이미 계정이 있으신가요?{' '}
                    <Link href="/login" className="font-medium text-blue-600 hover:text-blue-500">
                        로그인하기
                    </Link>
                </p>
            </div>

            <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
                <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* 아이디 입력 */}
                        <div>
                            <label htmlFor="userId" className="block text-sm font-medium text-gray-700">
                                아이디 *
                            </label>
                            <div className="mt-1">
                                <input
                                    id="userId"
                                    name="userId"
                                    type="text"
                                    value={form.userId}
                                    onChange={handleChange}
                                    required
                                    className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                    placeholder="사용할 아이디를 입력하세요"
                                />
                            </div>
                        </div>

                        {/* 이름 입력 */}
                        <div>
                            <label htmlFor="userName" className="block text-sm font-medium text-gray-700">
                                이름 *
                            </label>
                            <div className="mt-1">
                                <input
                                    id="userName"
                                    name="userName"
                                    type="text"
                                    value={form.userName}
                                    onChange={handleChange}
                                    required
                                    className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                    placeholder="실제 이름을 입력하세요"
                                />
                            </div>
                        </div>

                        {/* 비밀번호 입력 */}
                        <div>
                            <label htmlFor="userPw" className="block text-sm font-medium text-gray-700">
                                비밀번호 *
                            </label>
                            <div className="mt-1">
                                <input
                                    id="userPw"
                                    name="userPw"
                                    type="password"
                                    value={form.userPw}
                                    onChange={handleChange}
                                    required
                                    className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                    placeholder="비밀번호를 입력하세요 (최소 4자)"
                                />
                            </div>
                        </div>

                        {/* 비밀번호 확인 */}
                        <div>
                            <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
                                비밀번호 확인 *
                            </label>
                            <div className="mt-1">
                                <input
                                    id="confirmPassword"
                                    type="password"
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    required
                                    className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                    placeholder="비밀번호를 다시 입력하세요"
                                />
                            </div>
                        </div>

                        {/* 에러 메시지 */}
                        {error && (
                            <div className="bg-red-50 border border-red-200 rounded-md p-4">
                                <div className="text-sm text-red-800">{error}</div>
                            </div>
                        )}

                        {/* 회원가입 버튼 */}
                        <div>
                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white ${
                                    isSubmitting
                                        ? 'bg-gray-400 cursor-not-allowed'
                                        : 'bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500'
                                } transition-colors`}
                            >
                                {isSubmitting ? (
                                    <>
                                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                        가입 중...
                                    </>
                                ) : (
                                    '회원가입'
                                )}
                            </button>
                        </div>
                    </form>

                    {/* 추가 링크들 */}
                    <div className="mt-6">
                        <div className="relative">
                            <div className="absolute inset-0 flex items-center">
                                <div className="w-full border-t border-gray-300" />
                            </div>
                            <div className="relative flex justify-center text-sm">
                                <span className="px-2 bg-white text-gray-500">또는</span>
                            </div>
                        </div>

                        <div className="mt-6 text-center">
                            <Link
                                href="/"
                                className="text-sm text-blue-600 hover:text-blue-500"
                            >
                                홈으로 돌아가기
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
