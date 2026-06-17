import { lazy, Suspense } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext.jsx';
import ProtectedRoute from './components/layout/ProtectedRoute.jsx';
import AdminRoute from './components/layout/AdminRoute.jsx';
import Spinner from './components/common/Spinner.jsx';
import ScrollToTop from './components/common/ScrollToTop.jsx';
import RouteProgressBar from './components/common/RouteProgressBar.jsx';

// Eagerly loaded — most common entry points, kept out of the lazy bundle
// so there's no loading flicker on first paint or auth redirects.
import LoginPage from './pages/LoginPage.jsx';
import RegisterPage from './pages/RegisterPage.jsx';
import HomePage from './pages/HomePage.jsx';
import NotFoundPage from './pages/NotFoundPage.jsx';

// Lazily loaded — code-split into separate chunks, fetched on demand.
const MoviesPage = lazy(() => import('./pages/MoviesPage.jsx'));
const SeriesPage = lazy(() => import('./pages/SeriesPage.jsx'));
const GenresPage = lazy(() => import('./pages/GenresPage.jsx'));
const SearchPage = lazy(() => import('./pages/SearchPage.jsx'));
const MovieDetailPage = lazy(() => import('./pages/MovieDetailPage.jsx'));
const TVDetailPage = lazy(() => import('./pages/TVDetailPage.jsx'));
const ProfilePage = lazy(() => import('./pages/ProfilePage.jsx'));
const EditProfilePage = lazy(() => import('./pages/EditProfilePage.jsx'));
const MyListPage = lazy(() => import('./pages/MyListPage.jsx'));

const AdminDashboard = lazy(() => import('./pages/admin/AdminDashboard.jsx'));
const AdminUsers = lazy(() => import('./pages/admin/AdminUsers.jsx'));
const AdminFeatured = lazy(() => import('./pages/admin/AdminFeatured.jsx'));

const PublicRoute = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-brand-bg">
      <Spinner size="lg" />
    </div>
  );
  return user ? <Navigate to="/" replace /> : children;
};

// Shown briefly while a lazy-loaded route chunk is fetched
const PageFallback = () => (
  <div className="min-h-screen flex items-center justify-center bg-brand-bg">
    <Spinner size="lg" />
  </div>
);

const App = () => (
  <>
    <RouteProgressBar />
    <ScrollToTop />
    <Suspense fallback={<PageFallback />}>
      <Routes>
        {/* Public */}
        <Route path="/login"    element={<PublicRoute><LoginPage /></PublicRoute>} />
        <Route path="/register" element={<PublicRoute><RegisterPage /></PublicRoute>} />

        {/* Protected */}
        <Route path="/"             element={<ProtectedRoute><HomePage /></ProtectedRoute>} />
        <Route path="/movies"       element={<ProtectedRoute><MoviesPage /></ProtectedRoute>} />
        <Route path="/series"       element={<ProtectedRoute><SeriesPage /></ProtectedRoute>} />
        <Route path="/genres"       element={<ProtectedRoute><GenresPage /></ProtectedRoute>} />
        <Route path="/search"       element={<ProtectedRoute><SearchPage /></ProtectedRoute>} />
        <Route path="/movie/:id"    element={<ProtectedRoute><MovieDetailPage /></ProtectedRoute>} />
        <Route path="/tv/:id"       element={<ProtectedRoute><TVDetailPage /></ProtectedRoute>} />
        <Route path="/profile"      element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />
        <Route path="/profile/edit" element={<ProtectedRoute><EditProfilePage /></ProtectedRoute>} />
        <Route path="/my-list"      element={<ProtectedRoute><MyListPage /></ProtectedRoute>} />

        {/* Admin */}
        <Route path="/admin"          element={<AdminRoute><AdminDashboard /></AdminRoute>} />
        <Route path="/admin/users"    element={<AdminRoute><AdminUsers /></AdminRoute>} />
        <Route path="/admin/featured" element={<AdminRoute><AdminFeatured /></AdminRoute>} />

        {/* 404 */}
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </Suspense>
  </>
);

export default App;
