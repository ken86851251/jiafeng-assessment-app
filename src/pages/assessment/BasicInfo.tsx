import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAssessmentStore } from '@/store/assessmentStore';
import { MapPin, Mic, MicOff, ArrowRight, ArrowLeft, Save } from 'lucide-react';
import { BasicInfo as BasicInfoType } from '@/types';

// 疾病史選項
const MEDICAL_HISTORY_OPTIONS = [
  '高血壓', '糖尿病', '心臟病', '中風', '失智症', '帕金森氏症',
  '癌症', '腎臟病', '肝病', '肺病', '骨質疏鬆', '關節炎',
  '憂鬱症', '焦慮症', '其他精神疾病'
];

export default function BasicInfo() {
  const { caseId } = useParams<{ caseId: string }>();
  const navigate = useNavigate();
  const { basicInfo, updateBasicInfo, setCurrentStep } = useAssessmentStore();
  
  // 表單狀態
  const [formData, setFormData] = useState<Partial<BasicInfoType>>({
    caseCode: '',
    assessor: '',
    caseName: '',
    visitDate: new Date().toISOString().split('T')[0],
    planType: 'AA01',
    interviewSubject: '',
    birthday: '',
    gender: 'male',
    cmsLevel: 2,
    ltcBenefit: 'type1',
    maritalStatus: 'married',
    disabilityICF: 'none',
    medicalHistory: [],
    medicalHistoryOther: '',
    problemNeeds: '',
    gpsLocation: '',
    visitTimestamp: new Date().toISOString(),
    ...basicInfo
  });
  
  const [isRecording, setIsRecording] = useState(false);
  const [gpsStatus, setGpsStatus] = useState<'loading' | 'success' | 'error'>('loading');

  // 獲取GPS位置
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const location = `${position.coords.latitude}, ${position.coords.longitude}`;
          setFormData(prev => ({ ...prev, gpsLocation: location }));
          setGpsStatus('success');
        },
        (error) => {
          console.error('GPS定位失敗:', error);
          setGpsStatus('error');
        }
      );
    } else {
      setGpsStatus('error');
    }
  }, []);

  // 載入使用者資訊
  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (userData) {
      const user = JSON.parse(userData);
      setFormData(prev => ({ ...prev, assessor: user.name }));
    }
  }, []);

  // 語音轉文字功能
  const startVoiceRecording = () => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = (window as any).webkitSpeechRecognition || (window as any).SpeechRecognition;
      const recognition = new SpeechRecognition();
      
      recognition.lang = 'zh-TW';
      recognition.continuous = false;
      recognition.interimResults = false;
      
      recognition.onstart = () => {
        setIsRecording(true);
      };
      
      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setFormData(prev => ({
          ...prev,
          problemNeeds: prev.problemNeeds + ' ' + transcript
        }));
      };
      
      recognition.onerror = (event: any) => {
        console.error('語音識別錯誤:', event.error);
        setIsRecording(false);
      };
      
      recognition.onend = () => {
        setIsRecording(false);
      };
      
      recognition.start();
    } else {
      alert('您的瀏覽器不支援語音識別功能');
    }
  };

  const handleInputChange = (field: keyof BasicInfoType, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleMedicalHistoryChange = (option: string, checked: boolean) => {
    setFormData(prev => {
      const currentHistory = prev.medicalHistory || [];
      if (checked) {
        return { ...prev, medicalHistory: [...currentHistory, option] };
      } else {
        return { ...prev, medicalHistory: currentHistory.filter(item => item !== option) };
      }
    });
  };

  const handleSave = () => {
    updateBasicInfo(formData);
    // 這裡可以加入API保存邏輯
  };

  const handleNext = () => {
    updateBasicInfo(formData);
    setCurrentStep(2);
    navigate(`/assessment/comprehensive/${caseId}`);
  };

  const handleBack = () => {
    navigate('/dashboard');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 頂部導航 */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <h1 className="text-xl font-semibold text-gray-900">
              社區整合型服務中心(A)服務個案訪視評量表
            </h1>
            <div className="flex items-center space-x-2">
              <div className={`flex items-center text-sm ${
                gpsStatus === 'success' ? 'text-green-600' : 
                gpsStatus === 'error' ? 'text-red-600' : 'text-yellow-600'
              }`}>
                <MapPin className="h-4 w-4 mr-1" />
                {gpsStatus === 'success' ? 'GPS已定位' : 
                 gpsStatus === 'error' ? 'GPS定位失敗' : 'GPS定位中...'}
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* 主要內容 */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow-sm border p-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* 個案編碼 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                個案編碼
              </label>
              <input
                type="text"
                value={formData.caseCode}
                onChange={(e) => handleInputChange('caseCode', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="請輸入個案編碼"
              />
            </div>

            {/* 訪視人員 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                訪視人員
              </label>
              <input
                type="text"
                value={formData.assessor}
                onChange={(e) => handleInputChange('assessor', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50"
                placeholder="自動帶入登入者姓名"
                readOnly
              />
            </div>

            {/* 個案姓名 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                個案姓名
              </label>
              <input
                type="text"
                value={formData.caseName}
                onChange={(e) => handleInputChange('caseName', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="請輸入個案姓名"
              />
            </div>

            {/* 訪視日期 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                訪視日期
              </label>
              <input
                type="date"
                value={formData.visitDate}
                onChange={(e) => handleInputChange('visitDate', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* 計畫類型 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                計畫類型
              </label>
              <div className="flex space-x-4">
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="planType"
                    value="AA01"
                    checked={formData.planType === 'AA01'}
                    onChange={(e) => handleInputChange('planType', e.target.value)}
                    className="mr-2"
                  />
                  初評 AA01
                </label>
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="planType"
                    value="AA02"
                    checked={formData.planType === 'AA02'}
                    onChange={(e) => handleInputChange('planType', e.target.value)}
                    className="mr-2"
                  />
                  計畫異動 AA02
                </label>
              </div>
            </div>

            {/* 訪談對象 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                訪談對象
              </label>
              <input
                type="text"
                value={formData.interviewSubject}
                onChange={(e) => handleInputChange('interviewSubject', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="請輸入訪談對象"
              />
            </div>

            {/* 生日 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                生日
              </label>
              <input
                type="date"
                value={formData.birthday}
                onChange={(e) => handleInputChange('birthday', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* 性別 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                性別
              </label>
              <div className="flex space-x-4">
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="gender"
                    value="male"
                    checked={formData.gender === 'male'}
                    onChange={(e) => handleInputChange('gender', e.target.value)}
                    className="mr-2"
                  />
                  男
                </label>
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="gender"
                    value="female"
                    checked={formData.gender === 'female'}
                    onChange={(e) => handleInputChange('gender', e.target.value)}
                    className="mr-2"
                  />
                  女
                </label>
              </div>
            </div>

            {/* CMS等級 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                CMS等級
              </label>
              <select
                value={formData.cmsLevel}
                onChange={(e) => handleInputChange('cmsLevel', parseInt(e.target.value))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {[2, 3, 4, 5, 6, 7, 8].map(level => (
                  <option key={level} value={level}>{level}</option>
                ))}
              </select>
            </div>

            {/* 長照福利別 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                長照福利別
              </label>
              <div className="flex space-x-4">
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="ltcBenefit"
                    value="type1"
                    checked={formData.ltcBenefit === 'type1'}
                    onChange={(e) => handleInputChange('ltcBenefit', e.target.value)}
                    className="mr-2"
                  />
                  第一類
                </label>
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="ltcBenefit"
                    value="type2"
                    checked={formData.ltcBenefit === 'type2'}
                    onChange={(e) => handleInputChange('ltcBenefit', e.target.value)}
                    className="mr-2"
                  />
                  第二類
                </label>
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="ltcBenefit"
                    value="type3"
                    checked={formData.ltcBenefit === 'type3'}
                    onChange={(e) => handleInputChange('ltcBenefit', e.target.value)}
                    className="mr-2"
                  />
                  第三類
                </label>
              </div>
            </div>

            {/* 婚姻狀況 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                婚姻狀況
              </label>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { value: 'single', label: '未婚' },
                  { value: 'married', label: '已婚' },
                  { value: 'divorced', label: '離婚' },
                  { value: 'widowed', label: '喪偶' },
                  { value: 'other', label: '其它' }
                ].map(option => (
                  <label key={option.value} className="flex items-center">
                    <input
                      type="radio"
                      name="maritalStatus"
                      value={option.value}
                      checked={formData.maritalStatus === option.value}
                      onChange={(e) => handleInputChange('maritalStatus', e.target.value)}
                      className="mr-2"
                    />
                    {option.label}
                  </label>
                ))}
              </div>
            </div>

            {/* 身障ICF */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                身障ICF
              </label>
              <select
                value={formData.disabilityICF}
                onChange={(e) => handleInputChange('disabilityICF', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="none">無</option>
                <option value="mild">輕度</option>
                <option value="moderate">中度</option>
                <option value="severe">重度</option>
                <option value="profound">極重度</option>
              </select>
            </div>
          </div>

          {/* 疾病史 */}
          <div className="mt-6">
            <label className="block text-sm font-medium text-gray-700 mb-3">
              疾病史
            </label>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {MEDICAL_HISTORY_OPTIONS.map(option => (
                <label key={option} className="flex items-center">
                  <input
                    type="checkbox"
                    checked={formData.medicalHistory?.includes(option) || false}
                    onChange={(e) => handleMedicalHistoryChange(option, e.target.checked)}
                    className="mr-2"
                  />
                  {option}
                </label>
              ))}
            </div>
            <div className="mt-3">
              <input
                type="text"
                value={formData.medicalHistoryOther}
                onChange={(e) => handleInputChange('medicalHistoryOther', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="其他疾病史..."
              />
            </div>
          </div>

          {/* 問題需求 */}
          <div className="mt-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              問題需求
            </label>
            <div className="relative">
              <textarea
                value={formData.problemNeeds}
                onChange={(e) => handleInputChange('problemNeeds', e.target.value)}
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 pr-12"
                placeholder="請描述個案的問題需求..."
              />
              <button
                type="button"
                onClick={startVoiceRecording}
                disabled={isRecording}
                className={`absolute bottom-3 right-3 p-2 rounded-full ${
                  isRecording 
                    ? 'bg-red-500 text-white animate-pulse' 
                    : 'bg-blue-500 text-white hover:bg-blue-600'
                } transition-colors`}
                title="語音輸入"
              >
                {isRecording ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
              </button>
            </div>
            {isRecording && (
              <p className="text-sm text-red-600 mt-1">正在錄音中，請說話...</p>
            )}
          </div>

          {/* GPS位置資訊 */}
          {formData.gpsLocation && (
            <div className="mt-6 p-4 bg-green-50 rounded-lg">
              <div className="flex items-center">
                <MapPin className="h-5 w-5 text-green-600 mr-2" />
                <div>
                  <p className="text-sm font-medium text-green-800">GPS位置已記錄</p>
                  <p className="text-xs text-green-600">{formData.gpsLocation}</p>
                  <p className="text-xs text-green-600">記錄時間：{new Date(formData.visitTimestamp || '').toLocaleString('zh-TW')}</p>
                </div>
              </div>
            </div>
          )}

          {/* 操作按鈕 */}
          <div className="flex justify-between mt-8">
            <button
              onClick={handleBack}
              className="flex items-center px-6 py-3 text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              返回首頁
            </button>
            
            <div className="flex space-x-3">
              <button
                onClick={handleSave}
                className="flex items-center px-6 py-3 text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors"
              >
                <Save className="h-4 w-4 mr-2" />
                儲存草稿
              </button>
              
              <button
                onClick={handleNext}
                className="flex items-center px-6 py-3 text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors"
              >
                下一步：綜合評估
                <ArrowRight className="h-4 w-4 ml-2" />
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}