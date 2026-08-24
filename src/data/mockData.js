export const initialCourses = [
  {
    id: 'course-1',
    title: 'Full-Stack Web Development Bootcamp 2026',
    subtitle: 'Master React, Node.js, Next.js 15, TypeScript & Tailwind CSS from scratch to deployment.',
    category: 'Development',
    price: 4999,
    originalPrice: 8999,
    rating: 4.9,
    reviewsCount: 1240,
    studentsCount: 5430,
    instructor: 'Alex Rivera',
    instructorTitle: 'Senior Full Stack Architect',
    instructorAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    thumbnail: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800&auto=format&fit=crop&q=80',
    youtubeUrl: 'https://www.youtube.com/embed/SqcY0GlETPk',
    duration: '42 Hours',
    lessonsCount: 8,
    level: 'All Levels',
    status: 'Published',
    enrolled: true,
    progress: 25,
    lastAccessed: '2 hours ago',
    badge: 'Bestseller',
    description: 'Build modern, real-world full-stack web applications using the modern JavaScript ecosystem. Includes React 19, Server Components, Node, Express, PostgreSQL, Prisma, and automated cloud deployments.',
    features: [
      'Access to 42+ hours of HD video content',
      'Downloadable source code & starter boilerplate projects',
      'Lifetime access & completion certificate',
      'Dedicated Q&A support community'
    ],
    units: [
      {
        id: 'c1-u1',
        unitNumber: 1,
        title: 'Unit 1: Modern JavaScript & ES2026 Fundamentals',
        chapters: [
          {
            id: 'c1-u1-ch1',
            title: 'Chapter 1: Modern JS Overview & Async Execution',
            duration: '12:30',
            youtubeUrl: 'https://www.youtube.com/embed/SqcY0GlETPk',
            summary: 'Learn how JavaScript executes under the hood, call stack, memory heap, and event loop.'
          },
          {
            id: 'c1-u1-ch2',
            title: 'Chapter 2: Async/Await & Promises Deep Dive',
            duration: '18:45',
            youtubeUrl: 'https://www.youtube.com/embed/V_Kr9OSfDeU',
            summary: 'Master asynchronous JavaScript, promise chaining, error handling, and async/await syntax.'
          },
          {
            id: 'c1-u1-ch3',
            title: 'Chapter 3: ES Modules & Destructuring Scope',
            duration: '14:20',
            youtubeUrl: 'https://www.youtube.com/embed/cRHQNNcYf6s',
            summary: 'Understand ES6+ import/export modules, lexical scoping, closures, and object destructuring.'
          }
        ]
      },
      {
        id: 'c1-u2',
        unitNumber: 2,
        title: 'Unit 2: React 19 Architecture & Custom Hooks',
        chapters: [
          {
            id: 'c1-u2-ch1',
            title: 'Chapter 1: Component Lifecycle & Virtual DOM',
            duration: '15:10',
            youtubeUrl: 'https://www.youtube.com/embed/w7ejDZ8SWv8',
            summary: 'Explore React 19 fiber reconciliation engine, JSX compilation, and component trees.'
          },
          {
            id: 'c1-u2-ch2',
            title: 'Chapter 2: Custom Hooks & Global Context API',
            duration: '22:15',
            youtubeUrl: 'https://www.youtube.com/embed/35lXWvCuM8o',
            summary: 'Build robust global state management containers using React Context and custom hooks.'
          },
          {
            id: 'c1-u2-ch3',
            title: 'Chapter 3: Performance Optimization & Memoization',
            duration: '19:40',
            youtubeUrl: 'https://www.youtube.com/embed/N3AkSS5hXMA',
            summary: 'Prevent unnecessary re-renders using useMemo, useCallback, and auto-memoization compiler.'
          }
        ]
      },
      {
        id: 'c1-u3',
        unitNumber: 3,
        title: 'Unit 3: Backend REST API & Database Engineering',
        chapters: [
          {
            id: 'c1-u3-ch1',
            title: 'Chapter 1: Express Server Setup & REST Architecture',
            duration: '16:30',
            youtubeUrl: 'https://www.youtube.com/embed/Oe421EPjeBE',
            summary: 'Design modular Express routes, request validation, middleware, and CORS security.'
          },
          {
            id: 'c1-u3-ch2',
            title: 'Chapter 2: PostgreSQL & Prisma ORM Integration',
            duration: '25:00',
            youtubeUrl: 'https://www.youtube.com/embed/rLqq8m-Wn1s',
            summary: 'Define relational database models, execute type-safe queries, and deploy database migrations.'
          }
        ]
      }
    ],
    curriculum: [
      { section: '1. Modern JavaScript & ES2026 Fundamentals', lessons: ['Async/Await & Promises', 'Array Methods & Destructuring', 'ES Modules'] },
      { section: '2. React 19 Architecture', lessons: ['Component Lifecycle & State', 'Custom Hooks & Context API', 'Performance Optimization'] },
      { section: '3. Backend API Development', lessons: ['Express Server Setup', 'Prisma ORM & PostgreSQL'] }
    ]
  },
  {
    id: 'course-2',
    title: 'UI/UX Design Masterclass: Figma & Design Systems',
    subtitle: 'Learn research, prototyping, design tokens, and modern micro-interactions in Figma.',
    category: 'Design',
    price: 3499,
    originalPrice: 6999,
    rating: 4.8,
    reviewsCount: 890,
    studentsCount: 3820,
    instructor: 'Elena Rostova',
    instructorTitle: 'Principal Product Designer',
    instructorAvatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80',
    thumbnail: 'https://images.unsplash.com/photo-1581291518633-83b4ebd1d83e?w=800&auto=format&fit=crop&q=80',
    youtubeUrl: 'https://www.youtube.com/embed/c9Wg6Cb_YlU',
    duration: '28 Hours',
    lessonsCount: 6,
    level: 'Intermediate',
    status: 'Published',
    enrolled: true,
    progress: 33,
    lastAccessed: 'Yesterday',
    badge: 'Popular',
    description: 'Transform raw product ideas into high-converting, visually breathtaking user interfaces. Master Figma Auto-Layout 5.0, variables, tokens, accessibility standards, and seamless developer handoff.',
    features: [
      'Exclusive Figma UI Kit & Design System template',
      'Interactive prototyping exercises',
      'Personalized design feedback on capstones',
      'Certificate of Completion'
    ],
    units: [
      {
        id: 'c2-u1',
        unitNumber: 1,
        title: 'Unit 1: Figma Foundations & Wireframing',
        chapters: [
          {
            id: 'c2-u1-ch1',
            title: 'Chapter 1: Figma UI Interface & Vector Tools',
            duration: '14:00',
            youtubeUrl: 'https://www.youtube.com/embed/c9Wg6Cb_YlU',
            summary: 'Master Figma tools, frame management, vector networks, and shape boolean operations.'
          },
          {
            id: 'c2-u1-ch2',
            title: 'Chapter 2: Wireframing & Grid Systems',
            duration: '16:30',
            youtubeUrl: 'https://www.youtube.com/embed/FTFaQWZBqQ8',
            summary: 'Construct responsive column grids, baseline grids, and low-fidelity layout wireframes.'
          },
          {
            id: 'c2-u1-ch3',
            title: 'Chapter 3: User Journey Mapping & Personas',
            duration: '12:15',
            youtubeUrl: 'https://www.youtube.com/embed/jwXvO3OQpG8',
            summary: 'Define customer journey maps, empathy maps, and user research personas.'
          }
        ]
      },
      {
        id: 'c2-u2',
        unitNumber: 2,
        title: 'Unit 2: Design Systems & Component Variants',
        chapters: [
          {
            id: 'c2-u2-ch1',
            title: 'Chapter 1: Typography & Color Token Systems',
            duration: '18:10',
            youtubeUrl: 'https://www.youtube.com/embed/1v0iZ3sQnK8',
            summary: 'Build reusable color styles, design tokens, and modular fluid typography scales.'
          },
          {
            id: 'c2-u2-ch2',
            title: 'Chapter 2: Auto Layout 5.0 & Responsive Containers',
            duration: '21:00',
            youtubeUrl: 'https://www.youtube.com/embed/e211G2v3v6g',
            summary: 'Master Auto Layout wrapping, absolute positioning, and dynamic component sizing.'
          },
          {
            id: 'c2-u2-ch3',
            title: 'Chapter 3: Interactive Micro-Animations',
            duration: '15:45',
            youtubeUrl: 'https://www.youtube.com/embed/38XkI-6B2Xk',
            summary: 'Create smart-animate prototype transitions, hover states, and dynamic overlays.'
          }
        ]
      }
    ],
    curriculum: [
      { section: '1. User Research & Wireframing', lessons: ['Figma Interface', 'Wireframing', 'User Journey Mapping'] },
      { section: '2. Design Systems in Figma', lessons: ['Design Tokens', 'Auto Layout 5.0', 'Micro-Animations'] }
    ]
  },
  {
    id: 'course-3',
    title: 'Python for AI & Machine Learning Specialization',
    subtitle: 'From NumPy & Pandas to Neural Networks with PyTorch and OpenAI API integrations.',
    category: 'AI & Data',
    price: 5499,
    originalPrice: 9999,
    rating: 4.95,
    reviewsCount: 2150,
    studentsCount: 8900,
    instructor: 'Dr. Marcus Vance',
    instructorTitle: 'AI Research Scientist',
    instructorAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    thumbnail: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=800&auto=format&fit=crop&q=80',
    youtubeUrl: 'https://www.youtube.com/embed/kqtD5dpn9C8',
    duration: '54 Hours',
    lessonsCount: 5,
    level: 'All Levels',
    status: 'Published',
    enrolled: false,
    progress: 0,
    lastAccessed: null,
    badge: 'Trending',
    description: 'Deep dive into practical Artificial Intelligence engineering. Build custom LLM agents, train supervised models, process natural language, and deploy scalable ML APIs using FastAPI.',
    features: [
      '50+ Google Colab interactive notebooks',
      'Real-world LLM Agent building capstone',
      'GPU Cloud credits for model training',
      'Industry recognized credential'
    ],
    units: [
      {
        id: 'c3-u1',
        unitNumber: 1,
        title: 'Unit 1: Data Science Foundations with Python',
        chapters: [
          {
            id: 'c3-u1-ch1',
            title: 'Chapter 1: Python for Data Science & AI Intro',
            duration: '15:30',
            youtubeUrl: 'https://www.youtube.com/embed/kqtD5dpn9C8',
            summary: 'Introduction to Python data structures, Jupyter notebooks, and AI ecosystem.'
          },
          {
            id: 'c3-u1-ch2',
            title: 'Chapter 2: NumPy Vectorization & Array Ops',
            duration: '20:15',
            youtubeUrl: 'https://www.youtube.com/embed/vmEHCJofslg',
            summary: 'Perform high-performance vector calculations, matrix operations, and broadcasting.'
          },
          {
            id: 'c3-u1-ch3',
            title: 'Chapter 3: Pandas Data Wrangling & Seaborn',
            duration: '18:40',
            youtubeUrl: 'https://www.youtube.com/embed/0LT9w-52mZ4',
            summary: 'Clean dataset null values, aggregate dataframes, and plot statistical visualizations.'
          }
        ]
      },
      {
        id: 'c3-u2',
        unitNumber: 2,
        title: 'Unit 2: Deep Learning & Neural Networks',
        chapters: [
          {
            id: 'c3-u2-ch1',
            title: 'Chapter 1: Neural Networks & PyTorch Fundamentals',
            duration: '24:50',
            youtubeUrl: 'https://www.youtube.com/embed/aircAruvnKk',
            summary: 'Train multi-layer perceptron neural networks, loss functions, and backpropagation.'
          },
          {
            id: 'c3-u2-ch2',
            title: 'Chapter 2: LLM Agents & OpenAI API Integration',
            duration: '28:10',
            youtubeUrl: 'https://www.youtube.com/embed/tPYj3fFJGjk',
            summary: 'Connect GPT-4 models, design custom function calling tools, and build autonomous agents.'
          }
        ]
      }
    ],
    curriculum: [
      { section: '1. Data Science Foundation', lessons: ['Python for Data Science', 'NumPy Vectorization', 'Pandas & Seaborn'] },
      { section: '2. Machine Learning Algorithms', lessons: ['PyTorch Neural Networks', 'OpenAI LLM Agents'] }
    ]
  },
  {
    id: 'course-4',
    title: 'DevOps & Cloud Native Architecture (AWS, K8s, CI/CD)',
    subtitle: 'Master Docker, Kubernetes, Terraform, GitHub Actions, and AWS Infrastructure as Code.',
    category: 'DevOps',
    price: 4499,
    originalPrice: 7999,
    rating: 4.75,
    reviewsCount: 640,
    studentsCount: 2100,
    instructor: 'David Kim',
    instructorTitle: 'DevOps Lead Engineer',
    instructorAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
    thumbnail: 'https://images.unsplash.com/photo-1667372393119-3d4c48d07fc9?w=800&auto=format&fit=crop&q=80',
    youtubeUrl: 'https://www.youtube.com/embed/hQcFE0RD0cQ',
    duration: '36 Hours',
    lessonsCount: 4,
    level: 'Advanced',
    status: 'Published',
    enrolled: false,
    progress: 0,
    lastAccessed: null,
    badge: 'New',
    description: 'Streamline software delivery pipelines with industrial DevOps standards. Automate multi-cloud infrastructure with Terraform, monitor clusters with Prometheus & Grafana, and master zero-downtime deployments.',
    features: [
      'Production-grade CI/CD templates',
      'Terraform AWS Infrastructure blueprints',
      'Kubernetes hands-on lab sandbox',
      'Career coaching & interview prep'
    ],
    units: [
      {
        id: 'c4-u1',
        unitNumber: 1,
        title: 'Unit 1: Containers & CI/CD Pipelines',
        chapters: [
          {
            id: 'c4-u1-ch1',
            title: 'Chapter 1: Modern DevOps Architecture & CI/CD Overview',
            duration: '16:00',
            youtubeUrl: 'https://www.youtube.com/embed/hQcFE0RD0cQ',
            summary: 'Understand continuous integration, continuous deployment, and infrastructure automation.'
          },
          {
            id: 'c4-u1-ch2',
            title: 'Chapter 2: Docker Containerization Masterclass',
            duration: '22:15',
            youtubeUrl: 'https://www.youtube.com/embed/3c-iBn73dDE',
            summary: 'Write production Dockerfiles, multi-stage builds, and Docker Compose environments.'
          },
          {
            id: 'c4-u1-ch3',
            title: 'Chapter 3: Kubernetes Cluster Deployment & Pod Scaling',
            duration: '26:40',
            youtubeUrl: 'https://www.youtube.com/embed/X48VuDVv0do',
            summary: 'Deploy Kubernetes pods, services, ingress controllers, and auto-scaling policies.'
          }
        ]
      }
    ],
    curriculum: [
      { section: '1. Containerization & Orchestration', lessons: ['DevOps & CI/CD Overview', 'Docker Containerization', 'Kubernetes Deployment'] }
    ]
  }
];

export const initialCoupons = [
  {
    id: 'cup-1',
    code: 'WELCOME50',
    discountType: 'percentage', // 'percentage' | 'fixed'
    discountValue: 50,
    minSpend: 2499,
    expiryDate: '2026-12-31',
    usageLimit: 500,
    usageCount: 184,
    status: 'Active',
    description: '50% off on your first course enrollment!'
  },
  {
    id: 'cup-2',
    code: 'FLASHSALE30',
    discountType: 'percentage',
    discountValue: 30,
    minSpend: 1999,
    expiryDate: '2026-09-15',
    usageLimit: 300,
    usageCount: 112,
    status: 'Active',
    description: 'Flash sale! Save 30% on any course item.'
  },
  {
    id: 'cup-3',
    code: 'SAVE1000FIXED',
    discountType: 'fixed',
    discountValue: 1000,
    minSpend: 3499,
    expiryDate: '2026-10-01',
    usageLimit: 200,
    usageCount: 45,
    status: 'Active',
    description: 'Flat ₹1,000 instant discount on orders over ₹3,499'
  },
  {
    id: 'cup-4',
    code: 'SUMMER2025',
    discountType: 'percentage',
    discountValue: 25,
    minSpend: 0,
    expiryDate: '2025-08-31',
    usageLimit: 1000,
    usageCount: 1000,
    status: 'Expired',
    description: 'Past summer special promotional discount.'
  }
];

export const initialUsers = [
  {
    id: 'usr-1',
    name: 'Alex Rivera',
    email: 'alex.rivera@example.com',
    role: 'user', // 'user' | 'admin'
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    joinedDate: '2026-01-14',
    enrolledCount: 2,
    status: 'Active',
    phone: '+91 98765 43210',
    bio: 'Passionate web developer learning full-stack cloud engineering.',
    referralCode: 'ALEX2026'
  },
  {
    id: 'usr-2',
    name: 'Sarah Connor',
    email: 'sarah.c@example.com',
    role: 'user',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
    joinedDate: '2026-02-01',
    enrolledCount: 4,
    status: 'Active',
    phone: '+91 98123 45678',
    bio: 'UX designer & creative technologist.',
    referralCode: 'SARAH20'
  },
  {
    id: 'usr-3',
    name: 'Admin Gateway',
    email: 'admin@gateway.io',
    role: 'admin',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop&q=80',
    joinedDate: '2025-11-10',
    enrolledCount: 4,
    status: 'Active',
    phone: '+91 99000 11223',
    bio: 'Platform Manager & Content Coordinator.',
    referralCode: 'ADMINGATE'
  },
  {
    id: 'usr-4',
    name: 'Michael Scott',
    email: 'm.scott@dunder.com',
    role: 'user',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
    joinedDate: '2026-03-19',
    enrolledCount: 1,
    status: 'Blocked',
    phone: '+91 97654 32109',
    bio: 'Regional Manager looking to learn Python.',
    referralCode: 'MICHAEL50'
  }
];

export const initialPayments = [
  {
    id: 'TXN-98401',
    user: 'Alex Rivera',
    userEmail: 'alex.rivera@example.com',
    courseTitle: 'Full-Stack Web Development Bootcamp 2026',
    amount: 2499.50,
    originalPrice: 4999.00,
    couponCode: 'WELCOME50',
    date: '2026-08-10 14:32',
    paymentMethod: 'UPI / NetBanking',
    status: 'Completed'
  },
  {
    id: 'TXN-98402',
    user: 'Alex Rivera',
    userEmail: 'alex.rivera@example.com',
    courseTitle: 'UI/UX Design Masterclass: Figma & Design Systems',
    amount: 3499.00,
    originalPrice: 3499.00,
    couponCode: 'None',
    date: '2026-08-14 09:15',
    paymentMethod: 'Credit Card (•••• 4242)',
    status: 'Completed'
  },
  {
    id: 'TXN-98403',
    user: 'Sarah Connor',
    userEmail: 'sarah.c@example.com',
    courseTitle: 'Python for AI & Machine Learning Specialization',
    amount: 3849.30,
    originalPrice: 5499.00,
    couponCode: 'FLASHSALE30',
    date: '2026-08-15 18:45',
    paymentMethod: 'Razorpay',
    status: 'Completed'
  },
  {
    id: 'TXN-98404',
    user: 'Michael Scott',
    userEmail: 'm.scott@dunder.com',
    courseTitle: 'DevOps & Cloud Native Architecture',
    amount: 4499.00,
    originalPrice: 4499.00,
    couponCode: 'None',
    date: '2026-08-16 11:20',
    paymentMethod: 'UPI (GPay)',
    status: 'Pending'
  }
];

export const initialReferralData = {
  referralCode: 'STUDY2026',
  referralLink: 'https://studylms.com/signup?ref=STUDY2026',
  totalEarned: 0.00,
  pendingRewards: 0.00,
  totalInvites: 0,
  successfulConversions: 0,
  milestones: [
    { title: 'Bronze Referrer (3 Friends)', reward: '₹1,500 Bonus', achieved: false },
    { title: 'Silver Referrer (5 Friends)', reward: '₹3,500 Bonus', achieved: false },
    { title: 'Gold Referrer (10 Friends)', reward: 'Free Pro Course', achieved: false },
    { title: 'VIP Ambassador (25 Friends)', reward: '₹25,000 Cash Reward', achieved: false }
  ],
  invitesList: []
};

export const initialNotifications = [
  // USER-FACING NOTIFICATIONS
  {
    id: 'notif-u1',
    target: 'user',
    title: 'Course Enrollment Confirmed',
    message: 'You successfully enrolled in "Full-Stack Web Development Bootcamp 2026". Transaction TXN-98401 processed.',
    category: 'actions',
    type: 'success',
    time: '12m ago',
    read: false,
    timestamp: Date.now() - 12 * 60 * 1000,
    link: '/courses/course-1',
    actionLabel: 'Go to Course'
  },
  {
    id: 'notif-u2',
    target: 'user',
    title: '🎉 Special Flash Sale Announced!',
    message: 'Get up to 50% OFF on all AI & Data Science tracks using coupon WELCOME50.',
    category: 'announcements',
    type: 'promotion',
    time: '1h ago',
    read: false,
    timestamp: Date.now() - 60 * 60 * 1000,
    link: '/coupons',
    actionLabel: 'Claim Coupon'
  },
  {
    id: 'notif-u3',
    target: 'user',
    title: 'Referral Reward Credited',
    message: 'You earned ₹1,000 for referring Jessica Alba! Funds added to your rewards wallet.',
    category: 'actions',
    type: 'success',
    time: '2h ago',
    read: false,
    timestamp: Date.now() - 2 * 60 * 60 * 1000,
    link: '/refer-earn',
    actionLabel: 'View Wallet'
  },
  {
    id: 'notif-u4',
    target: 'user',
    title: 'Course Progress Milestone',
    message: 'Awesome progress! You completed 68% of Full-Stack Web Development Bootcamp.',
    category: 'information',
    type: 'info',
    time: '5h ago',
    read: true,
    timestamp: Date.now() - 5 * 60 * 60 * 1000,
    link: '/courses/course-1',
    actionLabel: 'Resume Course'
  },

  // ADMIN-FACING NOTIFICATIONS
  {
    id: 'notif-a1',
    target: 'admin',
    title: 'New Student Purchase Completed',
    message: 'Alex Rivera purchased "Full-Stack Web Development Bootcamp" for ₹2,499.50 (TXN-98401).',
    category: 'actions',
    type: 'success',
    time: '12m ago',
    read: false,
    timestamp: Date.now() - 12 * 60 * 1000,
    link: '/admin/payments',
    actionLabel: 'View Payments'
  },
  {
    id: 'notif-a2',
    target: 'admin',
    title: 'Weekly Executive Revenue Digest',
    message: 'Gross platform revenue reached ₹9,847.80 (+18.4% growth vs last period).',
    category: 'information',
    type: 'info',
    time: '3h ago',
    read: false,
    timestamp: Date.now() - 3 * 60 * 60 * 1000,
    link: '/admin/dashboard',
    actionLabel: 'View Executive Dashboard'
  },
  {
    id: 'notif-a3',
    target: 'admin',
    title: 'New Coupon Campaign Created',
    message: 'Voucher "FLASHSALE30" with 30% discount was published live.',
    category: 'actions',
    type: 'info',
    time: '5h ago',
    read: true,
    timestamp: Date.now() - 5 * 60 * 60 * 1000,
    link: '/admin/coupons',
    actionLabel: 'Manage Campaigns'
  },
  {
    id: 'notif-a4',
    target: 'admin',
    title: 'Course Catalog Updated',
    message: 'Admin updated course curriculum and video lessons for "UI/UX Design Masterclass".',
    category: 'information',
    type: 'info',
    time: '8h ago',
    read: true,
    timestamp: Date.now() - 8 * 60 * 60 * 1000,
    link: '/admin/courses',
    actionLabel: 'View Catalog'
  },

  // SYSTEM-WIDE ANNOUNCEMENTS (VISIBLE TO BOTH USER & ADMIN)
  {
    id: 'notif-all1',
    target: 'all',
    title: '📢 Scheduled Platform Maintenance',
    message: 'Studycademy servers will undergo routine database optimization on Aug 28, 02:00 AM UTC.',
    category: 'announcements',
    type: 'warning',
    time: '1d ago',
    read: true,
    timestamp: Date.now() - 24 * 60 * 60 * 1000,
    link: null
  }
];

