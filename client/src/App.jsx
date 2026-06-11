import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext.jsx';
import ProtectedRoute from './components/layout/ProtectedRoute.jsx';
import Spinner from './components/common/Spinner.jsx';

// Pages
import LoginPage from './pages/LoginPage.jsx';
import RegisterPage from './pages/RegisterPage.jsx';
import HomePage from './pages/HomePage.jsx';
import MoviesPage from './pages/MoviesPage.jsx';
import GenresPage from './pages/GenresPage.jsx';
import SearchPage from './pages/SearchPage.jsx';
import MovieDetailPage from './pages/MovieDetailPage.jsx';
import ProfilePage from './pages/ProfilePage.jsx';
import NotFoundPage from './pages/NotFoundPage.jsx';

const PublicRoute = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-brand-bg">
      <Spinner size="lg" />
    </div>
  );
  return user ? <Navigate to="/" replace /> : children;
};

const App = () => (
  <Routes>
    {/* Public */}
    <Route path="/login"    element={<PublicRoute><LoginPage /></PublicRoute>} />
    <Route path="/register" element={<PublicRoute><RegisterPage /></PublicRoute>} />

    {/* Protected */}
    <Route path="/"          element={<ProtectedRoute><HomePage /></ProtectedRoute>} />
    <Route path="/movies"    element={<ProtectedRoute><MoviesPage /></ProtectedRoute>} />
    <Route path="/genres"    element={<ProtectedRoute><GenresPage /></ProtectedRoute>} />
    <Route path="/search"    element={<ProtectedRoute><SearchPage /></ProtectedRoute>} />
    <Route path="/movie/:id" element={<ProtectedRoute><MovieDetailPage /></ProtectedRoute>} />
    <Route path="/profile"   element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />

    {/* Stubs (Stage 3+) */}
    <Route path="/series"  element={<ProtectedRoute><MoviesPage /></ProtectedRoute>} />
    <Route path="/my-list" element={<ProtectedRoute><HomePage /></ProtectedRoute>} />

    {/* 404 */}
    <Route path="*" element={<NotFoundPage />} />
  </Routes>
);

export default App;
