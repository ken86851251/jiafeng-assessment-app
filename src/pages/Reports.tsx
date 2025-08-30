import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Download, FileText, Table, Eye } from 'lucide-react';

export default function Reports() {
  const { assessmentId } = useParams<{ assessmentId: string }>();
  const navigate = useNavigate();

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
              評估報告
            </h1>
            <button
              onClick={handleBack}
              className="flex items-center text-gray-600 hover:text-gray-900 transition-colors"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              返回
            </button>
          </div>
        </div>
      </header>

      {/* 主要內容 */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow-sm border p-8">
          <div className="text-center py-12">
            <FileText className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-gray-900 mb-2">
              報告生成中
            </h2>
            <p className="text-gray-600 mb-8">
              評估報告正在生成中，請稍候...
              <br />
              評估ID: {assessmentId}
            </p>
            
            <div className="flex justify-center space-x-4">
              <button className="flex items-center px-6 py-3 text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors">
                <Eye className="h-4 w-4 mr-2" />
                預覽 PDF
              </button>
              
              <button className="flex items-center px-6 py-3 text-green-600 bg-green-50 rounded-lg hover:bg-green-100 transition-colors">
                <Download className="h-4 w-4 mr-2" />
                下載 PDF
              </button>
              
              <button className="flex items-center px-6 py-3 text-purple-600 bg-purple-50 rounded-lg hover:bg-purple-100 transition-colors">
                <Table className="h-4 w-4 mr-2" />
                下載 Excel
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}