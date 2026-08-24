// Pure Database State Store (Synchronized live from MySQL studylms_db)
export const memoryStore = {
  courses: [],
  coupons: [],
  users: [],
  payments: [],
  referralData: {
    referralCode: 'STUDY2026',
    referralLink: 'https://studylms.com/ref/STUDY2026',
    totalEarned: 0,
    pendingRewards: 0,
    totalInvites: 0,
    successfulConversions: 0,
    milestones: [],
    invitesList: []
  },
  notifications: [],
  completedChapters: {}
};
