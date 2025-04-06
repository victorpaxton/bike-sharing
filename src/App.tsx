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
import ActiveRentalPage from './pages/rental/ActiveRentalPage';
import RideHistoryPage from './pages/history/RideHistoryPage';
import ProfilePage from './pages/ProfilePage';
import NotFoundPage from './pages/NotFoundPage';

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
              <Route path="/dashboard" element={<DashboardPage />} />
              <Route path="/map" element={<MapPage />} />
              <Route path="/reservation/:stationId" element={<ReservationPage />} />
              <Route path="/reservation/confirmation" element={<ReservationConfirmationPage />} />
              <Route path="/rides" element={<RidesPage />} />
              <Route path="/pricing" element={<PricingPage />} />
            </Route>

            {/* Admin routes */}
            <Route path="/admin" element={<AdminLayout />}>
              <Route index element={<Navigate to="/admin/dashboard" replace />} />
              <Route path="dashboard" element={<AdminDashboardPage />} />
              <Route path="users" element={<UserManagementPage />} />
              <Route path="stations" element={<StationManagementPage />} />
              <Route path="bikes" element={<BikeManagementPage />} />
              <Route path="system" element={<div>System Configuration</div>} />
              <Route path="pricing" element={<PricingManagementPage />} />
              <Route path="promotions" element={<div>Promotions</div>} />
            </Route>

            {/* Redirect root to dashboard or login based on auth status */}
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
          </Routes>
          <Toaster />
        </AuthProvider>
      </Router>
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}

export default App;
