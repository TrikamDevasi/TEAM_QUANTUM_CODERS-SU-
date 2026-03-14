import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Landing from './pages/Landing';
import Auth from './pages/Auth';
import StudentDashboard from './pages/StudentDashboard';
import InstituteDashboard from './pages/InstituteDashboard';
import IndustryDashboard from './pages/IndustryDashboard';
import GovernmentDashboard from './pages/GovernmentDashboard';
import AdminDashboard from './pages/AdminDashboard';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/auth/:role" element={<Auth />} />
        <Route path="/dashboard/student" element={<StudentDashboard />} />
        <Route path="/dashboard/student/:tab" element={<StudentDashboard />} />
        <Route path="/dashboard/institute" element={<InstituteDashboard />} />
        <Route path="/dashboard/institute/:tab" element={<InstituteDashboard />} />
        <Route path="/dashboard/industry" element={<IndustryDashboard />} />
        <Route path="/dashboard/industry/:tab" element={<IndustryDashboard />} />
        <Route path="/dashboard/government" element={<GovernmentDashboard />} />
        <Route path="/dashboard/government/:tab" element={<GovernmentDashboard />} />
        <Route path="/dashboard/admin" element={<AdminDashboard />} />
        <Route path="/dashboard/admin/:tab" element={<AdminDashboard />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
