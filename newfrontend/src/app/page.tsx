import Link from 'next/link';

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* 히어로 섹션 */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            할 일 관리 애플리케이션
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            효율적으로 할 일을 관리하고 생산성을 높여보세요
          </p>
          
          {/* 주요 기능 버튼들 */}
          <div className="flex justify-center">
            <Link 
              href="/kanban"
              className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg font-medium transition-colors"
            >
              📋 칸반보드에서 할 일 관리하기
            </Link>
          </div>
        </div>

        {/* 기능 소개 */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="text-3xl mb-4">📋</div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">칸반보드</h3>
            <p className="text-gray-600">
              드래그 앤 드롭으로 직관적으로 할 일의 진행 상태를 관리하고, 새로운 할 일을 바로 생성하세요.
            </p>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="text-3xl mb-4">⏱️</div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">집중시간 추적</h3>
            <p className="text-gray-600">
              할 일을 진행하는 동안 자동으로 집중시간을 추적하고 포인트를 획득하세요.
            </p>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="text-3xl mb-4">🔐</div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">개인화</h3>
            <p className="text-gray-600">
              개인 계정으로 로그인하여 나만의 할 일과 포인트를 관리하세요.
            </p>
          </div>
        </div>

        {/* 상태별 통계 (예시) */}
        <div className="mt-12 bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
            할 일 상태별 관리
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <div className="text-2xl font-bold text-gray-600 mb-2">할 일</div>
              <p className="text-gray-500">아직 시작하지 않은 작업들</p>
            </div>
            <div className="text-center p-4 bg-yellow-50 rounded-lg">
              <div className="text-2xl font-bold text-yellow-600 mb-2">진행 중</div>
              <p className="text-gray-500">현재 작업 중인 항목들</p>
            </div>
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <div className="text-2xl font-bold text-green-600 mb-2">완료</div>
              <p className="text-gray-500">완료된 작업들</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
