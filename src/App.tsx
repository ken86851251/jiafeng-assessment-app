import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "@/pages/Home";
import Login from "@/pages/Login";
import Dashboard from "@/pages/Dashboard";
import BasicInfo from "@/pages/assessment/BasicInfo";
import ComprehensiveAssessment from "@/pages/assessment/ComprehensiveAssessment";
import CarePlan from "@/pages/assessment/CarePlan";
import Completion from "@/pages/assessment/Completion";
import Reports from "@/pages/Reports";
import Cases from "@/pages/Cases";
import Profile from "@/pages/Profile";

export default function App() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Router>
        <Routes>
          {/* 登入頁面 */}
          <Route path="/" element={<Login />} />
          
          {/* 主要頁面 */}
          <Route path="/dashboard" element={<Dashboard />} />
          
          {/* 評估流程頁面 */}
          <Route path="/assessment/basic/:caseId" element={<BasicInfo />} />
          <Route path="/assessment/comprehensive/:caseId" element={<ComprehensiveAssessment />} />
          <Route path="/assessment/care-plan/:caseId" element={<CarePlan />} />
          <Route path="/assessment/completion/:caseId" element={<Completion />} />
          
          {/* 其他功能頁面 */}
          <Route path="/reports/:assessmentId" element={<Reports />} />
          <Route path="/cases" element={<Cases />} />
          <Route path="/profile" element={<Profile />} />
          
          {/* 舊的Home頁面保留作為測試 */}
          <Route path="/home" element={<Home />} />
        </Routes>
      </Router>
    </div>
  );
}
