import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAssessmentStore } from '@/store/assessmentStore';
import { ArrowRight, ArrowLeft, Save } from 'lucide-react';

export default function ComprehensiveAssessment() {
  const { caseId } = useParams<{ caseId: string }>();
  const navigate = useNavigate();
  const { setCurrentStep } = useAssessmentStore();
  const [activeTab, setActiveTab] = useState(0);

  const tabs = [
    { id: 0, name: '健康醫療', key: 'health' },
    { id: 1, name: '生理身體', key: 'physical' },
    { id: 2, name: '社會家庭', key: 'social' },
    { id: 3, name: '居住環境', key: 'environment' }
  ];

  const handleNext = () => {
    setCurrentStep(3);
    navigate(`/assessment/care-plan/${caseId}`);
  };

  const handleBack = () => {
    setCurrentStep(1);
    navigate(`/assessment/basic/${caseId}`);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 頂部導航 */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <h1 className="text-xl font-semibold text-gray-900">
              個案綜合評估
            </h1>
            <div className="text-sm text-gray-600">
              步驟 2 / 4
            </div>
          </div>
        </div>
      </header>

      {/* 分頁導航 */}
      <div className="bg-white border-b">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex space-x-8">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                {tab.name}
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* 主要內容 */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow-sm border p-8">
          {/* 分頁內容 */}
          <div className="min-h-96">
            {activeTab === 0 && (
              <div>
                <h2 className="text-lg font-semibold text-gray-900 mb-6">
                  （一）健康相關面向_M醫療
                </h2>
                <div className="text-center text-gray-500 py-12">
                  健康醫療評估內容開發中...
                  <br />
                  將包含：目前醫療處置、住院紀錄、手術紀錄、用藥狀況、血液透析等
                </div>
              </div>
            )}
            
            {activeTab === 1 && (
              <div>
                <h2 className="text-lg font-semibold text-gray-900 mb-6">
                  （一）生理面向_身體
                </h2>
                <div className="text-center text-gray-500 py-12">
                  生理身體評估內容開發中...
                  <br />
                  將包含：心智功能、感官功能、營養飲食、肌力評估、活動能力等
                </div>
              </div>
            )}
            
            {activeTab === 2 && (
              <div>
                <h2 className="text-lg font-semibold text-gray-900 mb-6">
                  （二）社會心理面向_A
                </h2>
                <div className="text-center text-gray-500 py-12">
                  社會家庭評估內容開發中...
                  <br />
                  將包含：主照者資料、家庭支持、社會參與等
                </div>
              </div>
            )}
            
            {activeTab === 3 && (
              <div>
                <h2 className="text-lg font-semibold text-gray-900 mb-6">
                  （三）家庭環境面向_H
                </h2>
                <div className="text-center text-gray-500 py-12">
                  居住環境評估內容開發中...
                  <br />
                  將包含：住宅類型、環境評估、輔具使用、環境照片等
                </div>
              </div>
            )}
          </div>

          {/* 操作按鈕 */}
          <div className="flex justify-between mt-8">
            <button
              onClick={handleBack}
              className="flex items-center px-6 py-3 text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              上一步
            </button>
            
            <div className="flex space-x-3">
              <button
                className="flex items-center px-6 py-3 text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors"
              >
                <Save className="h-4 w-4 mr-2" />
                儲存草稿
              </button>
              
              <button
                onClick={handleNext}
                className="flex items-center px-6 py-3 text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors"
              >
                下一步：照顧計畫
                <ArrowRight className="h-4 w-4 ml-2" />
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}