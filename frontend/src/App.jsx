import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ToastProvider } from './components/Toast';
import Sidebar from './components/Sidebar';
import Employees from './pages/Employees';
import Attendance from './pages/Attendance';
import './index.css';

function App() {
  return (
    <BrowserRouter>
      <ToastProvider>
        <div className="app-container">
          <Sidebar />
          <Routes>
            <Route path="/" element={<Navigate to="/employees" replace />} />
            <Route path="/employees" element={<Employees />} />
            <Route path="/attendance" element={<Attendance />} />
          </Routes>
        </div>
      </ToastProvider>
    </BrowserRouter>
  );
}

export default App;
