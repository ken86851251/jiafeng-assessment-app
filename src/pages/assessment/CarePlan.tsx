import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAssessmentStore } from '@/store/assessmentStore';
import { ArrowRight, ArrowLeft, Save, Lightbulb } from 'lucide-react';
import { CARE_PROBLEMS } from '@/types';

export default function CarePlan() {
  const { caseId } = useParams<{ caseId: string }>();
  const navigate = useNavigate();
  const { setCurrentStep, autoSuggestCareProblems } = useAssessmentStore();
  const [selectedProblems, setSelectedProblems] = useState<number[]>([]);
  const [careGoals, setCareGoals] = useState('');
  const [carePlanArrangement, setCarePlanArrangement] = useState({
    homeService: '',
    rehabilitationService: '',
    assistiveDeviceAssessment: '',
    transportation: '',
    respiteService: ''
  });

  const handleProblemChange = (problemId: number, checked: boolean) => {
    if (checked) {
      setSelectedProblems(prev => [...prev, problemId]);
    } else {
      setSelectedProblems(prev => prev.filter(id => id !== problemId));
    }
  };

  const handleAutoSuggest = () => {
    const suggestions = autoSuggestCareProblems();
    setSelectedProblems(prev => [...new Set([...prev, ...suggestions])]);
  };

  const handleNext = () => {
    setCurrentStep(4);
    navigate(`/assessment/completion/${caseId}`);
  };

  const handleBack = () => {
    setCurrentStep(2);
    navigate(`/assessment/comprehensive/${caseId}`);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 頂部導航 */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <h1 className="text-xl font-semibold text-gray-900">
              照顧計畫與目標
            </h1>
            <div className="text-sm text-gray-600">
              步驟 3 / 4
            </div>
          </div>
        </div>
      </header>

      {/* 主要內容 */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-8">
          {/* 照顧問題清單 */}
          <div className="bg-white rounded-lg shadow-sm border p-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold text-gray-900">
                二、照顧問題清單
              </h2>
              <button
                onClick={handleAutoSuggest}
                className="flex items-center px-4 py-2 text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors"
              >
                <Lightbulb className="h-4 w-4 mr-2" />
                智慧建議
              </button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {CARE_PROBLEMS.map((problem) => (
                <label key={problem.id} className="flex items-center p-3 border rounded-lg hover:bg-gray-50">
                  <input
                    type="checkbox"
                    checked={selectedProblems.includes(problem.id)}
                    onChange={(e) => handleProblemChange(problem.id, e.target.checked)}
                    className="mr-3 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <span className="text-sm">
                    {problem.id}. {problem.name}
                  </span>
                </label>
              ))}
            </div>
            
            {selectedProblems.length > 0 && (
              <div className="mt-4 p-4 bg-blue-50 rounded-lg">
                <p className="text-sm font-medium text-blue-800 mb-2">
                  已選擇的照顧問題 ({selectedProblems.length} 項)：
                </p>
                <div className="flex flex-wrap gap-2">
                  {selectedProblems.map(id => {
                    const problem = CARE_PROBLEMS.find(p => p.id === id);
                    return (
                      <span key={id} className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        {problem?.name}
                      </span>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {/* 照顧目標 */}
          <div className="bg-white rounded-lg shadow-sm border p-8">
            <h2 className="text-lg font-semibold text-gray-900 mb-6">
              三、照顧目標
            </h2>
            <textarea
              value={careGoals}
              onChange={(e) => setCareGoals(e.target.value)}
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="請描述照顧目標..."
            />
          </div>

          {/* 照顧計畫安排 */}
          <div className="bg-white rounded-lg shadow-sm border p-8">
            <h2 className="text-lg font-semibold text-gray-900 mb-6">
              四、照顧計畫安排
            </h2>
            
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  (一) 居家服務/B碼
                </label>
                <textarea
                  value={carePlanArrangement.homeService}
                  onChange={(e) => setCarePlanArrangement(prev => ({ ...prev, homeService: e.target.value }))}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="請描述居家服務安排..."
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  (二) 復能專業服務/C碼
                </label>
                <textarea
                  value={carePlanArrangement.rehabilitationService}
                  onChange={(e) => setCarePlanArrangement(prev => ({ ...prev, rehabilitationService: e.target.value }))}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="請描述復能專業服務安排..."
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  (三) 輔具及無障礙評估/EF碼
                </label>
                <textarea
                  value={carePlanArrangement.assistiveDeviceAssessment}
                  onChange={(e) => setCarePlanArrangement(prev => ({ ...prev, assistiveDeviceAssessment: e.target.value }))}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="請描述輔具及無障礙評估安排..."
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  (四) 交通接送
                </label>
                <textarea
                  value={carePlanArrangement.transportation}
                  onChange={(e) => setCarePlanArrangement(prev => ({ ...prev, transportation: e.target.value }))}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="請描述交通接送安排..."
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  (五) 喘息服務
                </label>
                <textarea
                  value={carePlanArrangement.respiteService}
                  onChange={(e) => setCarePlanArrangement(prev => ({ ...prev, respiteService: e.target.value }))}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="請描述喘息服務安排..."
                />
              </div>
            </div>
          </div>

          {/* 操作按鈕 */}
          <div className="flex justify-between">
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
                下一步：完成簽核
                <ArrowRight className="h-4 w-4 ml-2" />
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}