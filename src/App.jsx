import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import { AppProvider } from './context/AppContext';
import { AppLayout } from './components/layout/AppLayout';

// User Pages
import { UserDashboardPage } from './pages/user/UserDashboardPage';
import { CourseCatalogPage } from './pages/user/CourseCatalogPage';
import { CourseDetailPage } from './pages/user/CourseDetailPage';import { ChapterPlayerPage } from './pages/user/ChapterPlayerPage';
import { CouponPage } from './pages/user/CouponPage';
import { ReferEarnPage } from './pages/user/ReferEarnPage';
import { PaymentDetailsPage } from './pages/user/PaymentDetailsPage';
import { ProfilePage } from './pages/user/ProfilePage';
import { ChangePasswordPage } from './pages/user/ChangePasswordPage';
import { LogoutPage } from './pages/user/LogoutPage';

// Admin Pages
import { AdminDashboardPage } from './pages/admin/AdminDashboardPage';
import { AdminCoursesPage } from './pages/admin/AdminCoursesPage';
import { AdminCouponsPage } from './pages/admin/AdminCouponsPage';
import { AdminUsersPage } from './pages/admin/AdminUsersPage';
import { AdminPaymentsPage } from './pages/admin/AdminPaymentsPage';

export default function App() {
  return (
    <ThemeProvider>
      <AppProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<AppLayout />}>
              {/* Default Redirect to User Dashboard */}
              <Route index element={<Navigate to="/dashboard" replace />} />

              {/* User Panel Routes */}
              <Route path="dashboard" element={<UserDashboardPage />} />
              <Route path="courses" element={<CourseCatalogPage />} />
              <Route path="courses/:id" element={<CourseDetailPage />} />
              <Route path="courses/:id/chapters/:chapterId" element={<ChapterPlayerPage />} /> 
              <Route path="coupons" element={<CouponPage />} />
              <Route path="refer-earn" element={<ReferEarnPage />} />
              <Route path="payment-details" element={<PaymentDetailsPage />} />
              <Route path="profile" element={<ProfilePage />} />
             <Route path="change-password" element={<ChangePasswordPage />} />
              <Route path="logout" element={<LogoutPage />} /> 

              {/* Admin Panel Routes */}
              <Route path="admin" element={<Navigate to="/admin/dashboard" replace />} />
              <Route path="admin/dashboard" element={<AdminDashboardPage />} />
              <Route path="admin/courses" element={<AdminCoursesPage />} />
              <Route path="admin/coupons" element={<AdminCouponsPage />} />
              <Route path="admin/users" element={<AdminUsersPage />} />
              <Route path="admin/payments" element={<AdminPaymentsPage />} />

              {/* Fallback */}
              <Route path="*" element={<Navigate to="/admin/dashboard" replace />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </AppProvider>
    </ThemeProvider>
  );
}
