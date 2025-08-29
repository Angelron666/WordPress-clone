import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import { ApiProvider } from './context/ApiContext';
import AdminLayout from './components/layout/AdminLayout';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import PostsPage from './pages/PostsPage';
import PostEditor from './pages/PostEditor';
import PostViewPage from './pages/PostViewPage';
import CategoriesPage from './pages/CategoriesPage';
import MediaLibraryPage from './pages/MediaLibraryPage';

// Protected route component
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};

function App() {
  return (
    <AuthProvider>
      <ThemeProvider>
        <ApiProvider>
          <Router>
            <Routes>
            <Route path="/login" element={<LoginPage />} />
            
            <Route
              path="/"
              element={
                <ProtectedRoute>
                  <Navigate to="/dashboard" replace />
                </ProtectedRoute>
              }
            />

            <Route
              path="/"
              element={
                <ProtectedRoute>
                  <AdminLayout />
                </ProtectedRoute>
              }
            >
              <Route path="dashboard" element={<DashboardPage />} />
              <Route path="posts" element={<PostsPage />} />
              <Route path="posts/new" element={<PostEditor />} />
              <Route path="posts/:id" element={<PostViewPage />} />
              <Route path="posts/edit/:id" element={<PostEditor />} />
              <Route path="categories" element={<CategoriesPage />} />
              <Route path="media" element={<MediaLibraryPage />} />
            </Route>
            </Routes>
          </Router>
        </ApiProvider>
      </ThemeProvider>
    </AuthProvider>
  );
}

export default App;