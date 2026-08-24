const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

/**
 * Universal Fetch Helper with error handling
 */
const request = async (endpoint, options = {}) => {
  try {
    const config = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers
      },
      ...options
    };

    if (config.body && typeof config.body === 'object') {
      config.body = JSON.stringify(config.body);
    }

    const response = await fetch(`${API_BASE_URL}${endpoint}`, config);
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || `HTTP ${response.status} Error`);
    }
    return await response.json();
  } catch (err) {
    console.warn(`API call failed for ${endpoint}:`, err.message);
    throw err;
  }
};

export const api = {
  // Course Endpoints
  getCourses: () => request('/courses'),
  getCourseById: (id) => request(`/courses/${id}`),
  createCourse: (data) => request('/courses', { method: 'POST', body: data }),
  updateCourse: (id, data) => request(`/courses/${id}`, { method: 'PUT', body: data }),
  deleteCourse: (id) => request(`/courses/${id}`, { method: 'DELETE' }),

  // Coupon Endpoints
  getCoupons: () => request('/coupons'),
  createCoupon: (data) => request('/coupons', { method: 'POST', body: data }),
  toggleCouponStatus: (id) => request(`/coupons/${id}/status`, { method: 'PATCH' }),
  deleteCoupon: (id) => request(`/coupons/${id}`, { method: 'DELETE' }),

  // User Endpoints
  getUsers: () => request('/users'),
  updateProfile: (data) => request('/users/profile', { method: 'PUT', body: data }),
  changePassword: (data) => request('/users/password', { method: 'POST', body: data }),
  toggleUserStatus: (id) => request(`/users/${id}/status`, { method: 'PATCH' }),
  changeUserRole: (id, role) => request(`/users/${id}/role`, { method: 'PATCH', body: { role } }),

  // Payment & Purchase Endpoints
  getPayments: () => request('/payments'),
  buyCourse: (data) => request('/payments/buy', { method: 'POST', body: data }),
  updateTransactionStatus: (id, status) => request(`/payments/${id}/status`, { method: 'PATCH', body: { status } }),

  // Progress Endpoints
  getCompletedChapters: () => request('/progress'),
  completeChapter: (data) => request('/progress/complete', { method: 'POST', body: data }),

  // Notification Endpoints
  getNotifications: () => request('/notifications'),
  addNotification: (data) => request('/notifications', { method: 'POST', body: data }),
  markAsRead: (id) => request(`/notifications/${id}/read`, { method: 'PATCH' }),
  markAllAsRead: () => request('/notifications/read-all', { method: 'PATCH' }),
  deleteNotification: (id) => request(`/notifications/${id}`, { method: 'DELETE' }),
  clearAllNotifications: () => request('/notifications', { method: 'DELETE' }),

  // Referral Endpoints
  getReferrals: () => request('/referrals')
};
