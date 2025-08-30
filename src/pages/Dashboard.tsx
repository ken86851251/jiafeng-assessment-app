import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Search, FileText, Users, Clock, MapPin, LogOut } from 'lucide-react';

interface RecentAssessment {
  id: string;
  caseName: string;
  visitDate: string;
  status: 'draft' | 'completed' | 'synced';
  planType: 'AA01' | 'AA02';
}

export default function Dashboard() {
  const [user, setUser] = useState<any>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [recentAssessments] = useState<RecentAssessment[]>([
    {
      id: '1',
      caseName: '王大明',
      visitDate: '2024-01-15',
      status: 'completed',
      planType: 'AA01'
    },
    {
      id: '2',
      caseName: '李小華',
      visitDate: '2024-01-14',
      status: 'draft',
      planType: 'AA02'
    },
    {
      id: '3',
      caseName: '陳美玲',
      visitDate: '2024-01-13',
      status: 'synced',
      planType: 'AA01'
    }
  ]);
  const navigate = useNavigate();

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (userData) {
      setUser(JSON.parse(userData));
    } else {
      navigate('/');
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('user');
    navigate('/');
  };

  const handleStartNewAssessment = () => {
    // 創建新的評估，這裡先導向基本資料頁面
    const newCaseId = 'new-' + Date.now();
    navigate(`/assessment/basic/${newCaseId}`);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'draft':
        return 'bg-yellow-100 text-yellow-800';
      case 'synced':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'completed':
        return '已完成';
      case 'draft':
        return '草稿';
      case 'synced':
        return '已同步';
      default:
        return '未知';
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 頂部導航列 */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <div className="h-8 w-8 bg-blue-600 rounded-lg flex items-center justify-center mr-3">
                <FileText className="h-5 w-5 text-white" />
              </div>
              <h1 className="text-xl font-semibold text-gray-900">
                嘉豐智能訪視評估
              </h1>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="flex items-center text-sm text-gray-600">
                <Users className="h-4 w-4 mr-1" />
                {user.name}
              </div>
              <button
                onClick={handleLogout}
                className="flex items-center text-sm text-gray-600 hover:text-gray-900 transition-colors"
              >
                <LogOut className="h-4 w-4 mr-1" />
                登出
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* 主要內容 */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* 歡迎區塊 */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            歡迎回來，{user.name}
          </h2>
          <p className="text-gray-600">
            今天是 {new Date().toLocaleDateString('zh-TW', { 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric',
              weekday: 'long'
            })}
          </p>
        </div>

        {/* 快速操作區塊 */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {/* 開始新訪視 */}
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">開始新訪視</h3>
              <Plus className="h-6 w-6 text-blue-600" />
            </div>
            <p className="text-gray-600 mb-4">
              建立新的個案訪視評估
            </p>
            <button
              onClick={handleStartNewAssessment}
              className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors font-medium"
            >
              開始新訪視
            </button>
          </div>

          {/* 個案管理 */}
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">個案管理</h3>
              <Users className="h-6 w-6 text-green-600" />
            </div>
            <p className="text-gray-600 mb-4">
              查看和管理所有個案資料
            </p>
            <button
              onClick={() => navigate('/cases')}
              className="w-full bg-green-600 text-white py-3 px-4 rounded-lg hover:bg-green-700 transition-colors font-medium"
            >
              管理個案
            </button>
          </div>

          {/* 報告查看 */}
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">報告查看</h3>
              <FileText className="h-6 w-6 text-purple-600" />
            </div>
            <p className="text-gray-600 mb-4">
              查看已完成的評估報告
            </p>
            <button
              onClick={() => navigate('/reports/all')}
              className="w-full bg-purple-600 text-white py-3 px-4 rounded-lg hover:bg-purple-700 transition-colors font-medium"
            >
              查看報告
            </button>
          </div>
        </div>

        {/* 個案搜尋 */}
        <div className="bg-white rounded-lg shadow-sm border p-6 mb-8">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">個案搜尋</h3>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="輸入個案姓名或編碼進行搜尋..."
            />
          </div>
          {searchTerm && (
            <div className="mt-4 p-4 bg-gray-50 rounded-lg">
              <p className="text-sm text-gray-600">搜尋結果將在這裡顯示...</p>
            </div>
          )}
        </div>

        {/* 最近訪視記錄 */}
        <div className="bg-white rounded-lg shadow-sm border">
          <div className="p-6 border-b">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900">最近訪視記錄</h3>
              <Clock className="h-5 w-5 text-gray-400" />
            </div>
          </div>
          
          <div className="divide-y">
            {recentAssessments.map((assessment) => (
              <div key={assessment.id} className="p-6 hover:bg-gray-50 transition-colors">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3">
                      <h4 className="text-lg font-medium text-gray-900">
                        {assessment.caseName}
                      </h4>
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        getStatusColor(assessment.status)
                      }`}>
                        {getStatusText(assessment.status)}
                      </span>
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                        {assessment.planType === 'AA01' ? '初評' : '計畫異動'}
                      </span>
                    </div>
                    <div className="flex items-center mt-2 text-sm text-gray-600">
                      <MapPin className="h-4 w-4 mr-1" />
                      訪視日期：{new Date(assessment.visitDate).toLocaleDateString('zh-TW')}
                    </div>
                  </div>
                  
                  <div className="flex space-x-2">
                    {assessment.status === 'draft' && (
                      <button
                        onClick={() => navigate(`/assessment/basic/${assessment.id}`)}
                        className="px-4 py-2 text-sm font-medium text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors"
                      >
                        繼續編輯
                      </button>
                    )}
                    <button
                      onClick={() => navigate(`/reports/${assessment.id}`)}
                      className="px-4 py-2 text-sm font-medium text-gray-600 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                    >
                      查看詳情
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}