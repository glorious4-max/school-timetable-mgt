import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ProtectedRoute } from './components/ProtectedRoute';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import TeacherList from './pages/teachers/TeacherList';
import TeacherDetails from './pages/teachers/TeacherDetails';
import TeacherForm from './pages/teachers/TeacherForm';
import NotFound from './pages/NotFound';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route 
            path="/dashboard" 
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/teachers" 
            element={
              <ProtectedRoute>
                <TeacherList />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/teachers/new" 
            element={
              <ProtectedRoute>
                <TeacherForm />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/teachers/:id" 
            element={
              <ProtectedRoute>
                <TeacherDetails />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/teachers/:id/edit" 
            element={
              <ProtectedRoute>
                <TeacherForm />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/" 
            element={<Navigate to="/dashboard" replace />} 
          />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;

