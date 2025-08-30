import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Plus, Users, Calendar, FileText, ArrowLeft } from 'lucide-react';

interface CaseRecord {
  id: string;
  name: string;
  caseCode: string;
  birthDate: string;
  gender: 'male' | 'female';
  lastVisit: string;
  assessmentCount: number;
  status: 'active' | 'inactive';
}

export default function Cases() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [cases] = useState<CaseRecord[]>([
    {
      id: '1',
      name: '王大明',
      caseCode: 'JF001',
      birthDate: '1950-03-15',
      gender: 'male',
      lastVisit: '2024-01-15',
      assessmentCount: 3,
      status: 'active'
    },
    {
      id: '2',
      name: '李小華',
      caseCode: 'JF002',
      birthDate: '1945-07-22',
      gender: 'female',
      lastVisit: '2024-01-10',
      assessmentCount: 5,
      status: 'active'
    },
    {
      id: '3',
      name: '陳美玲',
      caseCode: 'JF003',
      birthDate: '1955-11-08',
      gender: 'female',
      lastVisit: '2023-12-20',
      assessmentCount: 2,
      status: 'inactive'
    }
  ]);

  const filteredCases = cases.filter(caseRecord => 
    caseRecord.name.includes(searchTerm) || 
    caseRecord.caseCode.includes(searchTerm)
  );

  const handleNewAssessment = (caseId: string) => {
    navigate(`/assessment/basic/${caseId}`);
  };

  const handleBack = () => {
    navigate('/dashboard');
  };

  const getStatusColor = (status: string) => {
    return status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800';
  };

  const getStatusText = (status: string) => {
    return status === 'active' ? '活躍' : '非活躍';
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 頂部導航 */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <h1 className="text-xl font-semibold text-gray-900">
              個案管理
            </h1>
            <button
              onClick={handleBack}
              className="flex items-center text-gray-600 hover:text-gray-900 transition-colors"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              返回首頁
            </button>
          </div>
        </div>
      </header>

      {/* 主要內容 */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* 搜尋和統計 */}
        <div className="bg-white rounded-lg shadow-sm border p-6 mb-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
            <div className="flex items-center mb-4 md:mb-0">
              <Users className="h-6 w-6 text-blue-600 mr-3" />
              <div>
                <h2 className="text-lg font-semibold text-gray-900">個案總覽</h2>
                <p className="text-sm text-gray-600">共 {cases.length} 位個案</p>
              </div>
            </div>
            
            <div className="flex space-x-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">{cases.filter(c => c.status === 'active').length}</div>
                <div className="text-xs text-gray-600">活躍個案</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">{cases.reduce((sum, c) => sum + c.assessmentCount, 0)}</div>
                <div className="text-xs text-gray-600">總評估次數</div>
              </div>
            </div>
          </div>
          
          {/* 搜尋框 */}
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="搜尋個案姓名或編碼..."
            />
          </div>
        </div>

        {/* 個案列表 */}
        <div className="bg-white rounded-lg shadow-sm border">
          <div className="p-6 border-b">
            <h3 className="text-lg font-semibold text-gray-900">個案列表</h3>
          </div>
          
          <div className="divide-y">
            {filteredCases.map((caseRecord) => (
              <div key={caseRecord.id} className="p-6 hover:bg-gray-50 transition-colors">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-4">
                      <div className="flex-shrink-0">
                        <div className="h-12 w-12 bg-blue-100 rounded-full flex items-center justify-center">
                          <Users className="h-6 w-6 text-blue-600" />
                        </div>
                      </div>
                      
                      <div className="flex-1">
                        <div className="flex items-center space-x-3">
                          <h4 className="text-lg font-medium text-gray-900">
                            {caseRecord.name}
                          </h4>
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            getStatusColor(caseRecord.status)
                          }`}>
                            {getStatusText(caseRecord.status)}
                          </span>
                        </div>
                        
                        <div className="mt-2 grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-600">
                          <div className="flex items-center">
                            <FileText className="h-4 w-4 mr-2" />
                            個案編碼：{caseRecord.caseCode}
                          </div>
                          <div className="flex items-center">
                            <Calendar className="h-4 w-4 mr-2" />
                            生日：{new Date(caseRecord.birthDate).toLocaleDateString('zh-TW')}
                          </div>
                          <div className="flex items-center">
                            <Users className="h-4 w-4 mr-2" />
                            性別：{caseRecord.gender === 'male' ? '男' : '女'}
                          </div>
                        </div>
                        
                        <div className="mt-2 text-sm text-gray-600">
                          最後訪視：{new Date(caseRecord.lastVisit).toLocaleDateString('zh-TW')} | 
                          評估次數：{caseRecord.assessmentCount} 次
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex space-x-3">
                    <button
                      onClick={() => handleNewAssessment(caseRecord.id)}
                      className="flex items-center px-4 py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      新增評估
                    </button>
                    
                    <button className="flex items-center px-4 py-2 text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors">
                      <FileText className="h-4 w-4 mr-2" />
                      查看記錄
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          {filteredCases.length === 0 && (
            <div className="p-12 text-center">
              <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">找不到符合的個案</h3>
              <p className="text-gray-600">請嘗試不同的搜尋關鍵字</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}