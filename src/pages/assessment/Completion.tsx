import { useState, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAssessmentStore } from '@/store/assessmentStore';
import { ArrowLeft, Save, Upload, AlertTriangle, CheckCircle, FileText } from 'lucide-react';

export default function Completion() {
  const { caseId } = useParams<{ caseId: string }>();
  const navigate = useNavigate();
  const { basicInfo, generateRiskAlerts } = useAssessmentStore();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [signature, setSignature] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [showComparison, setShowComparison] = useState(false);
  
  // 生成風險警示
  const riskAlerts = generateRiskAlerts();
  
  // 是否顯示歷史比對按鈕（只有計畫異動AA02才顯示）
  const showComparisonButton = basicInfo.planType === 'AA02';

  // 簽名板功能
  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement>) => {
    setIsDrawing(true);
    const canvas = canvasRef.current;
    if (canvas) {
      const rect = canvas.getBoundingClientRect();
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.beginPath();
        ctx.moveTo(e.clientX - rect.left, e.clientY - rect.top);
      }
    }
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    if (canvas) {
      const rect = canvas.getBoundingClientRect();
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.lineTo(e.clientX - rect.left, e.clientY - rect.top);
        ctx.stroke();
      }
    }
  };

  const stopDrawing = () => {
    setIsDrawing(false);
    const canvas = canvasRef.current;
    if (canvas) {
      const dataURL = canvas.toDataURL();
      setSignature(dataURL);
    }
  };

  const clearSignature = () => {
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        setSignature('');
      }
    }
  };

  const handleCompletionAndSync = async () => {
    setIsUploading(true);
    
    // 模擬上傳和同步過程
    setTimeout(() => {
      setIsUploading(false);
      // 顯示成功訊息並導向報告頁面
      alert('評估已完成並成功同步至雲端！');
      navigate(`/reports/${caseId}`);
    }, 3000);
  };

  const handleBack = () => {
    navigate(`/assessment/care-plan/${caseId}`);
  };

  const getRiskAlertColor = (severity: string) => {
    switch (severity) {
      case 'high':
        return 'bg-red-50 border-red-200 text-red-800';
      case 'medium':
        return 'bg-yellow-50 border-yellow-200 text-yellow-800';
      case 'low':
        return 'bg-blue-50 border-blue-200 text-blue-800';
      default:
        return 'bg-gray-50 border-gray-200 text-gray-800';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 頂部導航 */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <h1 className="text-xl font-semibold text-gray-900">
              完成與簽核
            </h1>
            <div className="text-sm text-gray-600">
              步驟 4 / 4
            </div>
          </div>
        </div>
      </header>

      {/* 主要內容 */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-8">
          {/* 風險警示 */}
          {riskAlerts.length > 0 && (
            <div className="bg-white rounded-lg shadow-sm border p-8">
              <div className="flex items-center mb-6">
                <AlertTriangle className="h-6 w-6 text-red-600 mr-3" />
                <h2 className="text-lg font-semibold text-gray-900">
                  風險警示
                </h2>
              </div>
              
              <div className="space-y-4">
                {riskAlerts.map((alert, index) => (
                  <div key={index} className={`p-4 rounded-lg border-2 ${getRiskAlertColor(alert.severity)}`}>
                    <div className="flex items-start">
                      <AlertTriangle className="h-5 w-5 mt-0.5 mr-3 flex-shrink-0" />
                      <div>
                        <p className="font-medium">{alert.message}</p>
                        <p className="text-sm mt-1 opacity-75">
                          風險等級：{alert.severity === 'high' ? '高' : alert.severity === 'medium' ? '中' : '低'}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 歷史資料比對 */}
          {showComparisonButton && (
            <div className="bg-white rounded-lg shadow-sm border p-8">
              <h2 className="text-lg font-semibold text-gray-900 mb-6">
                歷史資料比對
              </h2>
              
              <div className="flex items-center justify-between p-4 bg-blue-50 rounded-lg">
                <div>
                  <p className="font-medium text-blue-900">與前次評估比對</p>
                  <p className="text-sm text-blue-700 mt-1">
                    查看本次評估與上一次評估的差異項目
                  </p>
                </div>
                <button
                  onClick={() => setShowComparison(!showComparison)}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  {showComparison ? '隱藏比對' : '顯示比對'}
                </button>
              </div>
              
              {showComparison && (
                <div className="mt-6 p-6 bg-gray-50 rounded-lg">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="font-medium text-gray-900 mb-3">前次評估</h4>
                      <div className="space-y-2 text-sm text-gray-600">
                        <p>• 計畫類型：初評 AA01</p>
                        <p>• 評估日期：2024-01-01</p>
                        <p>• 照顧問題：5項</p>
                        <p>• 風險等級：中等</p>
                      </div>
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900 mb-3">本次評估</h4>
                      <div className="space-y-2 text-sm text-gray-600">
                        <p>• 計畫類型：計畫異動 AA02</p>
                        <p>• 評估日期：{basicInfo.visitDate}</p>
                        <p>• 照顧問題：待確認</p>
                        <p>• 風險等級：{riskAlerts.length > 0 ? '高' : '低'}</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="mt-4 p-4 bg-yellow-50 rounded-lg">
                    <p className="text-sm text-yellow-800">
                      <strong>主要變化：</strong> 照顧問題數量增加，建議加強相關照護措施。
                    </p>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* 電子簽名 */}
          <div className="bg-white rounded-lg shadow-sm border p-8">
            <h2 className="text-lg font-semibold text-gray-900 mb-6">
              個案/家屬簽名
            </h2>
            
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6">
              <canvas
                ref={canvasRef}
                width={600}
                height={200}
                className="w-full h-48 border border-gray-300 rounded cursor-crosshair bg-white"
                onMouseDown={startDrawing}
                onMouseMove={draw}
                onMouseUp={stopDrawing}
                onMouseLeave={stopDrawing}
              />
              
              <div className="flex justify-between items-center mt-4">
                <p className="text-sm text-gray-600">
                  請在上方區域用手指或觸控筆進行簽名
                </p>
                <button
                  onClick={clearSignature}
                  className="px-4 py-2 text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  清除簽名
                </button>
              </div>
              
              {signature && (
                <div className="mt-4 p-3 bg-green-50 rounded-lg">
                  <div className="flex items-center">
                    <CheckCircle className="h-5 w-5 text-green-600 mr-2" />
                    <p className="text-sm text-green-800">簽名已完成</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* 評估摘要 */}
          <div className="bg-white rounded-lg shadow-sm border p-8">
            <h2 className="text-lg font-semibold text-gray-900 mb-6">
              評估摘要
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-medium text-gray-900 mb-3">基本資訊</h4>
                <div className="space-y-2 text-sm text-gray-600">
                  <p>個案姓名：{basicInfo.caseName || '未填寫'}</p>
                  <p>個案編碼：{basicInfo.caseCode || '未填寫'}</p>
                  <p>訪視日期：{basicInfo.visitDate || '未填寫'}</p>
                  <p>計畫類型：{basicInfo.planType === 'AA01' ? '初評 AA01' : '計畫異動 AA02'}</p>
                </div>
              </div>
              
              <div>
                <h4 className="font-medium text-gray-900 mb-3">評估狀態</h4>
                <div className="space-y-2 text-sm text-gray-600">
                  <p>風險警示：{riskAlerts.length} 項</p>
                  <p>簽名狀態：{signature ? '已完成' : '待簽名'}</p>
                  <p>GPS定位：{basicInfo.gpsLocation ? '已記錄' : '未記錄'}</p>
                  <p>評估完整度：85%</p>
                </div>
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
                onClick={handleCompletionAndSync}
                disabled={!signature || isUploading}
                className="flex items-center px-8 py-3 text-white bg-green-600 rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {isUploading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    同步中...
                  </>
                ) : (
                  <>
                    <Upload className="h-4 w-4 mr-2" />
                    完成並同步存檔
                  </>
                )}
              </button>
            </div>
          </div>
          
          {/* 同步進度 */}
          {isUploading && (
            <div className="bg-blue-50 rounded-lg p-6">
              <div className="flex items-center mb-4">
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600 mr-3"></div>
                <h3 className="font-medium text-blue-900">正在同步資料...</h3>
              </div>
              
              <div className="space-y-2 text-sm text-blue-800">
                <p>✓ 儲存評估資料到資料庫</p>
                <p>✓ 生成 PDF 報告</p>
                <p>✓ 生成 Excel 數據表</p>
                <p className="animate-pulse">⏳ 上傳檔案到 Google Drive...</p>
                <p className="text-blue-600">⏳ 建立檔案夾結構...</p>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}