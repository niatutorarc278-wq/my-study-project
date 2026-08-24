import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { api } from '../services/api';

const AppContext = createContext();

const defaultUser = {
  id: 'usr-1',
  name: 'Learner User',
  email: 'user@example.com',
  role: 'user',
  avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
  enrolledCount: 0,
  status: 'Active'
};

const defaultReferralData = {
  referralCode: 'STUDY2026',
  referralLink: 'https://studylms.com/ref/STUDY2026',
  totalEarned: 0,
  pendingRewards: 0,
  totalInvites: 0,
  successfulConversions: 0,
  milestones: [],
  invitesList: []
};

export const AppProvider = ({ children }) => {
  const [activePanel, setActivePanel] = useState('admin'); // 'user' | 'admin'
  const [courses, setCourses] = useState([]);
  const [coupons, setCoupons] = useState([]);
  const [users, setUsers] = useState([]);
  const [payments, setPayments] = useState([]);
  const [referralData, setReferralData] = useState(defaultReferralData);
  const [notifications, setNotifications] = useState([]);
  const [currentUser, setCurrentUser] = useState(defaultUser);
  const [toast, setToast] = useState(null); // { message, type: 'success' | 'error' | 'info' }
  const [completedChapters, setCompletedChapters] = useState({});

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3500);
  };

  const switchPanel = (panel) => {
    setActivePanel(panel);
    showToast(`Switched to ${panel === 'admin' ? 'Admin Panel' : 'User Panel'} view`, 'info');
  };

  // Fetch Genuine Data Exclusively from MySQL Express Backend
  const syncDataWithBackend = useCallback(async () => {
    try {
      const [backendCourses, backendCoupons, backendUsers, backendPayments, backendNotifs, backendChapters, backendReferrals] =
        await Promise.allSettled([
          api.getCourses(),
          api.getCoupons(),
          api.getUsers(),
          api.getPayments(),
          api.getNotifications(),
          api.getCompletedChapters(),
          api.getReferrals()
        ]);

      if (backendCourses.status === 'fulfilled' && Array.isArray(backendCourses.value)) {
        setCourses(backendCourses.value);
      }
      if (backendCoupons.status === 'fulfilled' && Array.isArray(backendCoupons.value)) {
        setCoupons(backendCoupons.value);
      }
      if (backendUsers.status === 'fulfilled' && Array.isArray(backendUsers.value)) {
        setUsers(backendUsers.value);
        if (backendUsers.value.length > 0) {
          setCurrentUser(backendUsers.value[0]);
        }
      }
      if (backendPayments.status === 'fulfilled' && Array.isArray(backendPayments.value)) {
        setPayments(backendPayments.value);
      }
      if (backendNotifs.status === 'fulfilled' && Array.isArray(backendNotifs.value)) {
        setNotifications(backendNotifs.value);
      }
      if (backendChapters.status === 'fulfilled' && typeof backendChapters.value === 'object') {
        setCompletedChapters(backendChapters.value);
      }
      if (backendReferrals.status === 'fulfilled' && backendReferrals.value) {
        setReferralData(backendReferrals.value);
      }
    } catch (err) {
      console.warn('Backend sync notice:', err.message);
    }
  }, []);

  // Initial Sync + Auto-Refresh on Window Focus and 8s Polling
  useEffect(() => {
    syncDataWithBackend();

    const handleFocus = () => syncDataWithBackend();
    window.addEventListener('focus', handleFocus);
    // 3-second live polling so any MySQL Workbench edit or deletion shows on screen instantly
    const interval = setInterval(syncDataWithBackend, 3000);

    return () => {
      window.removeEventListener('focus', handleFocus);
      clearInterval(interval);
    };
  }, [syncDataWithBackend]);

  // Notification Handlers
  const addNotification = async ({ title, message, category = 'actions', type = 'info', target = 'all', link = null, actionLabel = null }) => {
    const newNotif = {
      id: `notif-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      title,
      message,
      category,
      type,
      target,
      time: 'Just now',
      read: false,
      timestamp: Date.now(),
      link,
      actionLabel
    };
    setNotifications((prev) => [newNotif, ...prev]);
    try {
      await api.addNotification(newNotif);
      syncDataWithBackend();
    } catch (e) {}
  };

  const markAsRead = async (id) => {
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)));
    try {
      await api.markAsRead(id);
    } catch (e) {}
  };

  const markAllAsRead = async () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    showToast('All notifications marked as read', 'info');
    try {
      await api.markAllAsRead();
    } catch (e) {}
  };

  const deleteNotification = async (id) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
    try {
      await api.deleteNotification(id);
    } catch (e) {}
  };

  const clearAllNotifications = async () => {
    setNotifications([]);
    showToast('All notifications cleared', 'info');
    try {
      await api.clearAllNotifications();
    } catch (e) {}
  };

  const unreadCount = notifications.filter((n) => !n.read).length;

  // Course Chapter Progression State
  const completeChapter = async (courseId, chapterId) => {
    setCompletedChapters((prev) => {
      const current = prev[courseId] || [];
      if (current.includes(chapterId)) return prev;
      const updated = [...current, chapterId];

      const targetCourse = courses.find((c) => c.id === courseId);
      if (targetCourse && targetCourse.units) {
        const totalChapters = targetCourse.units.reduce(
          (acc, unit) => acc + (unit.chapters ? unit.chapters.length : 0),
          0
        );
        if (totalChapters > 0) {
          const calcProgress = Math.min(100, Math.round((updated.length / totalChapters) * 100));
          setCourses((prevCourses) =>
            prevCourses.map((c) => (c.id === courseId ? { ...c, progress: calcProgress } : c))
          );
        }
      }

      showToast('🎉 Chapter completed! Next chapter unlocked.', 'success');
      return { ...prev, [courseId]: updated };
    });

    try {
      await api.completeChapter({ courseId, chapterId, userId: currentUser.id });
      syncDataWithBackend();
    } catch (e) {}
  };

  const isChapterUnlocked = (course, chapterId) => {
    if (!course || !course.units) return true;
    const allChapters = course.units.flatMap((u) => u.chapters || []);
    const index = allChapters.findIndex((ch) => ch.id === chapterId);
    if (index <= 0) return true;
    const courseCompletedList = completedChapters[course.id] || [];
    const isDone = courseCompletedList.includes(chapterId);
    const prevDone = courseCompletedList.includes(allChapters[index - 1].id);
    return isDone || prevDone;
  };

  // User Actions
  const buyCourse = async (courseId, couponCode = '', paymentMethod = 'Credit Card') => {
    const course = courses.find((c) => c.id === courseId);
    if (!course) return false;

    let finalPrice = course.price;
    let appliedCoupon = null;

    if (couponCode.trim()) {
      appliedCoupon = coupons.find(
        (c) => c.code.toLowerCase() === couponCode.trim().toLowerCase() && c.status === 'Active'
      );
      if (appliedCoupon) {
        if (appliedCoupon.discountType === 'percentage') {
          finalPrice = Math.max(0, course.price * (1 - appliedCoupon.discountValue / 100));
        } else {
          finalPrice = Math.max(0, course.price - appliedCoupon.discountValue);
        }
        setCoupons((prev) =>
          prev.map((c) => (c.id === appliedCoupon.id ? { ...c, usageCount: c.usageCount + 1 } : c))
        );
      }
    }

    setCourses((prev) => prev.map((c) => (c.id === courseId ? { ...c, enrolled: true, progress: 0 } : c)));

    const newTxn = {
      id: `TXN-${Math.floor(10000 + Math.random() * 90000)}`,
      user: currentUser.name,
      userEmail: currentUser.email,
      courseTitle: course.title,
      amount: parseFloat(finalPrice.toFixed(2)),
      originalPrice: course.price,
      couponCode: appliedCoupon ? appliedCoupon.code : 'None',
      date: new Date().toISOString().replace('T', ' ').substring(0, 16),
      paymentMethod: paymentMethod,
      status: 'Completed'
    };

    setPayments((prev) => [newTxn, ...prev]);

    setCurrentUser((prev) => ({ ...prev, enrolledCount: (prev.enrolledCount || 0) + 1 }));
    setUsers((prev) =>
      prev.map((u) => (u.id === currentUser.id ? { ...u, enrolledCount: (u.enrolledCount || 0) + 1 } : u))
    );

    showToast(`Successfully enrolled in ${course.title}!`, 'success');

    addNotification({
      title: 'Course Enrollment Confirmed',
      message: `You successfully enrolled in "${course.title}". Payment of ₹${finalPrice.toFixed(2)} processed.`,
      category: 'actions',
      type: 'success',
      target: 'user',
      link: `/courses/${courseId}`,
      actionLabel: 'Go to Course'
    });

    addNotification({
      title: 'New Student Purchase Completed',
      message: `${currentUser.name} purchased "${course.title}" for ₹${finalPrice.toFixed(2)} (${newTxn.id}).`,
      category: 'actions',
      type: 'success',
      target: 'admin',
      link: '/admin/payments',
      actionLabel: 'View Payments'
    });

    try {
      await api.buyCourse({
        courseId,
        couponCode,
        paymentMethod,
        userEmail: currentUser.email,
        userName: currentUser.name
      });
      syncDataWithBackend();
    } catch (e) {}

    return newTxn;
  };

  const updateProfile = async (updatedData) => {
    setCurrentUser((prev) => ({ ...prev, ...updatedData }));
    setUsers((prev) => prev.map((u) => (u.id === currentUser.id ? { ...u, ...updatedData } : u)));
    showToast('Profile updated successfully!', 'success');

    addNotification({
      title: 'Profile Updated',
      message: 'Your personal profile details were saved successfully.',
      category: 'actions',
      type: 'info',
      target: 'user',
      link: '/profile',
      actionLabel: 'View Profile'
    });

    try {
      await api.updateProfile({ ...updatedData, id: currentUser.id });
      syncDataWithBackend();
    } catch (e) {}
  };

  const changePassword = async (currentPass, newPass) => {
    if (!currentPass || !newPass) {
      showToast('Please fill out all password fields', 'error');
      return false;
    }
    showToast('Password changed successfully!', 'success');

    addNotification({
      title: 'Security Alert: Password Changed',
      message: 'Your account password has been updated.',
      category: 'actions',
      type: 'warning',
      target: 'user',
      link: '/profile'
    });

    try {
      await api.changePassword({ currentPassword: currentPass, newPassword: newPass });
    } catch (e) {}

    return true;
  };

  // Admin Actions
  const addCourse = async (newCourseData) => {
    const newCourse = {
      id: `course-${Date.now()}`,
      rating: 5.0,
      reviewsCount: 0,
      studentsCount: 0,
      enrolled: false,
      progress: 0,
      status: 'Published',
      youtubeUrl: newCourseData.youtubeUrl || 'https://www.youtube.com/embed/SqcY0GlETPk',
      curriculum: [
        { section: '1. Course Introduction', lessons: ['Welcome & Overview', 'Environment Setup'] }
      ],
      features: ['Lifetime access to content', 'Downloadable resources', 'Completion certificate'],
      ...newCourseData,
      price: parseFloat(newCourseData.price),
      originalPrice: parseFloat(newCourseData.originalPrice || newCourseData.price)
    };
    setCourses((prev) => [newCourse, ...prev]);
    showToast(`New course "${newCourse.title}" created successfully!`, 'success');

    addNotification({
      title: '🎉 New Course Published',
      message: `Course "${newCourse.title}" is live and open for enrollment.`,
      category: 'announcements',
      type: 'promotion',
      target: 'user',
      link: `/courses/${newCourse.id}`,
      actionLabel: 'View Course'
    });

    addNotification({
      title: 'New Course Added to Catalog',
      message: `"${newCourse.title}" was published to platform catalog.`,
      category: 'actions',
      type: 'info',
      target: 'admin',
      link: '/admin/courses',
      actionLabel: 'Manage Courses'
    });

    try {
      const created = await api.createCourse(newCourseData);
      if (created && created.id) {
        setCourses((prev) => prev.map((c) => (c.id === newCourse.id ? created : c)));
      }
      syncDataWithBackend();
    } catch (e) {}
  };

  const updateCourse = async (courseId, updatedData) => {
    setCourses((prev) => prev.map((c) => (c.id === courseId ? { ...c, ...updatedData } : c)));
    showToast(`Course updated successfully!`, 'success');

    addNotification({
      title: 'Course Catalog Updated',
      message: `Course details for "${updatedData.title || 'Course'}" were saved.`,
      category: 'information',
      type: 'info',
      target: 'admin',
      link: '/admin/courses'
    });

    try {
      await api.updateCourse(courseId, updatedData);
      syncDataWithBackend();
    } catch (e) {}
  };

  const deleteCourse = async (courseId) => {
    setCourses((prev) => prev.filter((c) => c.id !== courseId));
    showToast(`Course deleted!`, 'info');
    try {
      await api.deleteCourse(courseId);
      syncDataWithBackend();
    } catch (e) {}
  };

  const createCoupon = async (newCouponData) => {
    const newCoupon = {
      id: `cup-${Date.now()}`,
      usageCount: 0,
      status: 'Active',
      ...newCouponData,
      discountValue: parseFloat(newCouponData.discountValue),
      minSpend: parseFloat(newCouponData.minSpend || 0),
      usageLimit: parseInt(newCouponData.usageLimit || 500)
    };
    setCoupons((prev) => [newCoupon, ...prev]);
    showToast(`Coupon "${newCoupon.code}" created successfully!`, 'success');

    addNotification({
      title: '🎟️ New Coupon Campaign Launched',
      message: `Discount code "${newCoupon.code}" is active and ready to use!`,
      category: 'announcements',
      type: 'promotion',
      target: 'user',
      link: '/coupons',
      actionLabel: 'Claim Deal'
    });

    addNotification({
      title: 'New Coupon Published',
      message: `Voucher code "${newCoupon.code}" is live.`,
      category: 'actions',
      type: 'info',
      target: 'admin',
      link: '/admin/coupons'
    });

    try {
      const created = await api.createCoupon(newCouponData);
      if (created && created.id) {
        setCoupons((prev) => prev.map((c) => (c.id === newCoupon.id ? created : c)));
      }
      syncDataWithBackend();
    } catch (e) {}
  };

  const deleteCoupon = async (couponId) => {
    setCoupons((prev) => prev.filter((c) => c.id !== couponId));
    showToast(`Coupon deleted!`, 'info');
    try {
      await api.deleteCoupon(couponId);
      syncDataWithBackend();
    } catch (e) {}
  };

  const toggleCouponStatus = async (couponId) => {
    setCoupons((prev) =>
      prev.map((c) => (c.id === couponId ? { ...c, status: c.status === 'Active' ? 'Expired' : 'Active' } : c))
    );
    showToast(`Coupon status toggled`, 'info');
    try {
      await api.toggleCouponStatus(couponId);
      syncDataWithBackend();
    } catch (e) {}
  };

  const toggleUserStatus = async (userId) => {
    setUsers((prev) =>
      prev.map((u) => (u.id === userId ? { ...u, status: u.status === 'Active' ? 'Blocked' : 'Active' } : u))
    );
    showToast(`User status updated`, 'info');

    addNotification({
      title: 'User Account Status Modified',
      message: `User account status was updated in Admin console.`,
      category: 'actions',
      type: 'warning',
      target: 'admin',
      link: '/admin/users'
    });

    try {
      await api.toggleUserStatus(userId);
      syncDataWithBackend();
    } catch (e) {}
  };

  const changeUserRole = async (userId, newRole) => {
    setUsers((prev) => prev.map((u) => (u.id === userId ? { ...u, role: newRole } : u)));
    showToast(`User role changed to ${newRole}`, 'info');
    try {
      await api.changeUserRole(userId, newRole);
      syncDataWithBackend();
    } catch (e) {}
  };

  const updateTransactionStatus = async (txnId, newStatus) => {
    setPayments((prev) => prev.map((p) => (p.id === txnId ? { ...p, status: newStatus } : p)));
    showToast(`Transaction ${txnId} status updated to ${newStatus}`, 'info');

    addNotification({
      title: 'Payment Transaction Status',
      message: `Transaction ${txnId} updated to ${newStatus}.`,
      category: 'information',
      type: 'info',
      target: 'admin',
      link: '/admin/payments'
    });

    try {
      await api.updateTransactionStatus(txnId, newStatus);
      syncDataWithBackend();
    } catch (e) {}
  };

  const logout = () => {
    showToast('You have been logged out.', 'info');
  };

  return (
    <AppContext.Provider
      value={{
        activePanel,
        switchPanel,
        courses,
        coupons,
        users,
        payments,
        referralData,
        notifications,
        unreadCount,
        addNotification,
        markAsRead,
        markAllAsRead,
        deleteNotification,
        clearAllNotifications,
        currentUser,
        toast,
        showToast,
        buyCourse,
        updateProfile,
        changePassword,
        addCourse,
        updateCourse,
        deleteCourse,
        createCoupon,
        deleteCoupon,
        toggleCouponStatus,
        toggleUserStatus,
        changeUserRole,
        updateTransactionStatus,
        completedChapters,
        completeChapter,
        isChapterUnlocked,
        refreshData: syncDataWithBackend,
        logout
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
