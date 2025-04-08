import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { Toaster } from './components/ui/Toaster';
import PublicLayout from './layouts/PublicLayout';
import DashboardLayout from './layouts/DashboardLayout';
import AdminLayout from './layouts/AdminLayout';
import LoginPage from './pages/auth/LoginPage';
import RegisterPage from './pages/auth/RegisterPage';
import DashboardPage from './pages/dashboard/DashboardPage';
import MapPage from './pages/map/MapPage';
import ReservationPage from './pages/reservation/ReservationPage';
import ReservationConfirmationPage from './pages/reservation/ReservationConfirmationPage';
import PricingPage from './pages/pricing/PricingPage';
import RidesPage from './pages/rides/RidesPage';
import AdminDashboardPage from './pages/admin/DashboardPage';
import UserManagementPage from './pages/admin/UserManagementPage';
import PricingManagementPage from './pages/admin/PricingManagementPage';
import StationManagementPage from './pages/admin/StationManagementPage';
import BikeManagementPage from './pages/admin/BikeManagementPage';
import { ProtectedRoute } from './guards/ProtectedRoute';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      retry: 1,
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <AuthProvider>
          <Routes>
            {/* Public routes */}
            <Route element={<PublicLayout />}>
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
            </Route>

            {/* Protected routes */}
            <Route element={<DashboardLayout />}>
              <Route path="/dashboard" element={<ProtectedRoute><DashboardPage /></ProtectedRoute>} />
              <Route path="/map" element={<ProtectedRoute><MapPage /></ProtectedRoute>} />
              <Route path="/reservation/:stationId" element={<ProtectedRoute><ReservationPage /></ProtectedRoute>} />
              <Route path="/reservation/confirmation" element={<ProtectedRoute><ReservationConfirmationPage /></ProtectedRoute>} />
              <Route path="/rides" element={<ProtectedRoute><RidesPage /></ProtectedRoute>} />
              <Route path="/pricing" element={<ProtectedRoute><PricingPage /></ProtectedRoute>} />
            </Route>

            {/* Admin routes */}
            <Route path="/admin" element={<AdminLayout />}>
              <Route index element={<Navigate to="/admin/dashboard" replace />} />
              <Route path="dashboard" element={<ProtectedRoute><AdminDashboardPage /></ProtectedRoute>} />
              <Route path="users" element={<ProtectedRoute><UserManagementPage /></ProtectedRoute>} />
              <Route path="stations" element={<ProtectedRoute><StationManagementPage /></ProtectedRoute>} />
              <Route path="bikes" element={<ProtectedRoute><BikeManagementPage /></ProtectedRoute>} />
              <Route path="system" element={<ProtectedRoute><div>System Configuration</div></ProtectedRoute>} />
              <Route path="pricing" element={<ProtectedRoute><PricingManagementPage /></ProtectedRoute>} />
              <Route path="promotions" element={<ProtectedRoute><div>Promotions</div></ProtectedRoute>} />
            </Route>

            {/* Redirect root to dashboard or login based on auth status */}
            <Route path="/" element={<Navigate to="/dashboard" replace />} />

            {/* Catch all route for 404 */}
            <Route path="*" element={<Navigate to="/dashboard" replace />} />
          </Routes>
          <Toaster />
        </AuthProvider>
      </Router>
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}

export default App;
