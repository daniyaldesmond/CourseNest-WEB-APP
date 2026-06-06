import dotenv from 'dotenv';
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import User from '../models/User.js';
import Course from '../models/Course.js';
import Enrollment from '../models/Enrollment.js';
import Post from '../models/Post.js';

dotenv.config();

const usersData = [
  {
    name: 'Alex Johnson',
    email: 'alex@example.com',
    password: 'password123',
    role: 'student',
    status: 'active',
    avatar: 'AJ',
    bio: 'Lifelong learner interested in software engineering, UI design, and photography.',
    headline: 'Computer Science Student',
    website: 'https://alexjohnson.dev',
    enrolledCount: 2
  },
  {
    name: 'Dr. Angela Chen',
    email: 'angela@example.com',
    password: 'password123',
    role: 'instructor',
    status: 'active',
    avatar: 'AC',
    bio: 'Dr. Angela is a senior software engineer and researcher with 12+ years of experience training engineers at tech firms.',
    headline: 'Senior Software Engineer',
    website: '',
    enrolledCount: 0
  },
  {
    name: 'Sarah Croft',
    email: 'sarah@design.com',
    password: 'password123',
    role: 'instructor',
    status: 'active',
    avatar: 'SC',
    bio: 'Sarah is an award-winning digital artist and UI consultant working with global startups to craft interactive interfaces.',
    headline: 'Lead UI/UX Designer',
    website: '',
    enrolledCount: 0
  },
  {
    name: 'David Miller',
    email: 'david@marketing.com',
    password: 'password123',
    role: 'instructor',
    status: 'active',
    avatar: 'DM',
    bio: 'David is a growth consultant who previously managed $10M+ annual digital ad spend for e-commerce companies.',
    headline: 'Growth Marketing Expert',
    website: '',
    enrolledCount: 0
  },
  {
    name: 'Marcus Miller',
    email: 'marcus@example.com',
    password: 'password123',
    role: 'student',
    status: 'suspended',
    avatar: 'MM',
    bio: 'Learning new tech stacks.',
    headline: 'Student',
    website: '',
    enrolledCount: 1
  },
  {
    name: 'Admin Staff',
    email: 'admin@coursenest.com',
    password: 'password123',
    role: 'admin',
    status: 'active',
    avatar: 'AS',
    bio: 'Platform Administrator. Managing courses and user controls.',
    headline: 'Head Admin',
    website: '',
    enrolledCount: 0
  }
];

const coursesData = [
  {
    title: 'Full-Stack Web Development Bootcamp',
    description: 'Learn HTML, CSS, JavaScript, React, Node.js, Express, and MongoDB from scratch. Build 10+ real-world responsive web applications with professional designs.',
    shortDescription: 'Master web development from frontend to backend with hands-on projects.',
    category: 'Development',
    instructor: 'Dr. Angela Chen',
    instructorBio: 'Dr. Angela is a senior software engineer and researcher with 12+ years of experience training engineers at tech firms.',
    rating: 4.8,
    reviewsCount: 1420,
    price: 94.99,
    originalPrice: 199.99,
    duration: '42 hours',
    level: 'Beginner',
    studentsEnrolled: 8250,
    thumbnail: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=800&auto=format&fit=crop&q=60',
    lessons: [
      { title: 'Course Overview & Introduction', duration: '08:45', videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4' },
      { title: 'Understanding HTML Semantics and Structure', duration: '14:20', videoUrl: 'https://www.w3schools.com/html/movie.mp4' },
      { title: 'CSS Layouts: Flexbox and Grid Masterclass', duration: '22:15', videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4' },
      { title: 'Modern JavaScript: ES6+ Syntax & Features', duration: '18:40', videoUrl: 'https://www.w3schools.com/html/movie.mp4' },
      { title: 'DOM Manipulation and Interactive Web Pages', duration: '25:10', videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4' },
      { title: 'React.js Core: Components, Props, and State', duration: '30:15', videoUrl: 'https://www.w3schools.com/html/movie.mp4' }
    ],
    quiz: [
      {
        question: 'Which of the following is correct about React components?',
        options: [
          'They must return a single JSX element.',
          'They are case-insensitive.',
          'They cannot hold local state.',
          'They are strictly class-based.'
        ],
        answer: 0
      },
      {
        question: 'What is the correct command to create a new React application via Vite?',
        options: [
          'npm init react-app',
          'npm create vite@latest',
          'npx make-react-app',
          'yarn new react-project'
        ],
        answer: 1
      },
      {
        question: 'Which hook is used to perform side effects in functional components?',
        options: [
          'useState',
          'useContext',
          'useEffect',
          'useReducer'
        ],
        answer: 2
      },
      {
        question: 'Which HTTP status code represents a client unauthorized error?',
        options: [
          '200 OK',
          '400 Bad Request',
          '401 Unauthorized',
          '500 Internal Server Error'
        ],
        answer: 2
      }
    ]
  },
  {
    title: 'Advanced UI/UX Design Masterclass',
    description: 'Deep dive into Figma, user research, wireframing, interactive prototyping, glassmorphism design layouts, and usability testing. Become a professional UI designer.',
    shortDescription: 'Master modern interface design, typography, Figma layouts, and branding.',
    category: 'Design',
    instructor: 'Sarah Croft',
    instructorBio: 'Sarah is an award-winning digital artist and UI consultant working with global startups to craft interactive interfaces.',
    rating: 4.9,
    reviewsCount: 930,
    price: 84.99,
    originalPrice: 159.99,
    duration: '28 hours',
    level: 'Intermediate',
    studentsEnrolled: 4320,
    thumbnail: 'https://images.unsplash.com/photo-1551650975-87deedd944c3?w=800&auto=format&fit=crop&q=60',
    lessons: [
      { title: 'Introduction to UI/UX Paradigms', duration: '10:30', videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4' },
      { title: 'Figma Basics: Frames, Shapes, and Auto-Layout', duration: '18:50', videoUrl: 'https://www.w3schools.com/html/movie.mp4' },
      { title: 'Typography Rules and Harmonious Color Palettes', duration: '15:12', videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4' },
      { title: 'Designing Premium Shadows & Glassmorphism Panels', duration: '24:45', videoUrl: 'https://www.w3schools.com/html/movie.mp4' }
    ],
    quiz: [
      {
        question: 'What design style combines transparency, blur background, and soft borders?',
        options: [
          'Neumorphism',
          'Glassmorphism',
          'Flat Design',
          'Material Design'
        ],
        answer: 1
      },
      {
        question: 'Which of the following describes Figma Auto-Layout?',
        options: [
          'It automatically draws vector icons.',
          'It aligns objects dynamically based on padding and spacing rules.',
          'It exports assets in high resolution.',
          'It is a canvas rendering engine.'
        ],
        answer: 1
      },
      {
        question: 'What does UX stand for?',
        options: [
          'User Experience',
          'User eXtension',
          'Universal eXchange',
          'Unified eXperiment'
        ],
        answer: 0
      },
      {
        question: 'In UI design, what is a "wireframe"?',
        options: [
          'A final colorful design',
          'A low-fidelity outline of a page layout',
          'A 3D model of a product',
          'A database schema layout'
        ],
        answer: 1
      }
    ]
  },
  {
    title: 'Growth Marketing & Search Engine Optimization',
    description: 'Learn SEO, SEM, content writing, email campaigns, Google Analytics 4, and social media ads to grow any digital brand or startup to millions of users.',
    shortDescription: 'Build high-traffic marketing funnels and optimize conversions.',
    category: 'Marketing',
    instructor: 'David Miller',
    instructorBio: 'David is a growth consultant who previously managed $10M+ annual digital ad spend for e-commerce companies.',
    rating: 4.5,
    reviewsCount: 650,
    price: 49.99,
    originalPrice: 99.99,
    duration: '18 hours',
    level: 'Beginner',
    studentsEnrolled: 2900,
    thumbnail: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&auto=format&fit=crop&q=60',
    lessons: [
      { title: 'Core Principles of Growth Funnels', duration: '12:40', videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4' },
      { title: 'On-Page SEO and Google Crawl Algorithms', duration: '20:15', videoUrl: 'https://www.w3schools.com/html/movie.mp4' },
      { title: 'Writing Newsletters that Convert Subscribers', duration: '16:10', videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4' }
    ],
    quiz: [
      {
        question: 'What does CTR stand for in digital marketing?',
        options: [
          'Click-Through Rate',
          'Cost-To-Run',
          'Customer-Trust Ratio',
          'Campaign-Target Range'
        ],
        answer: 0
      },
      {
        question: 'Which of the following is an on-page SEO factor?',
        options: [
          'Social media likes',
          'Meta description tags',
          'External backlinks',
          'Domain registration age'
        ],
        answer: 1
      },
      {
        question: 'What does domain authority measure?',
        options: [
          'The speed of a website hosting provider',
          'The search engine ranking strength of a website',
          'The cost of domain registration',
          'The total bandwidth consumed'
        ],
        answer: 1
      },
      {
        question: 'Which metric measures the percentage of visitors who leave a website after viewing only one page?',
        options: [
          'Exit Rate',
          'Conversion Rate',
          'Bounce Rate',
          'Click-through Rate'
        ],
        answer: 2
      }
    ]
  },
  {
    title: 'Python for Data Science and Machine Learning',
    description: 'Complete guide to NumPy, Pandas, Matplotlib, Seaborn, Scikit-Learn, and building neural networks. Master machine learning algorithms today.',
    shortDescription: 'Analyze data, build models, and visualize statistical metrics.',
    category: 'Development',
    instructor: 'Dr. Angela Chen',
    instructorBio: 'Dr. Angela is a senior software engineer and researcher with 12+ years of experience training engineers at tech firms.',
    rating: 4.7,
    reviewsCount: 1120,
    price: 119.99,
    originalPrice: 249.99,
    duration: '52 hours',
    level: 'Advanced',
    studentsEnrolled: 6800,
    thumbnail: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&auto=format&fit=crop&q=60',
    lessons: [
      { title: 'Python Basics Recap & OOP Concepts', duration: '15:20', videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4' },
      { title: 'Pandas DataFrames: Cleaning and Aggregating Data', duration: '28:10', videoUrl: 'https://www.w3schools.com/html/movie.mp4' },
      { title: 'Linear Regression and Cost Functions', duration: '32:45', videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4' }
    ],
    quiz: [
      {
        question: 'Which library is primarily used for multidimensional array operations in Python?',
        options: [
          'Pandas',
          'Matplotlib',
          'NumPy',
          'Django'
        ],
        answer: 2
      },
      {
        question: 'Which Pandas method is used to load data from a CSV file?',
        options: [
          'read_csv()',
          'load_csv()',
          'open_csv()',
          'get_csv()'
        ],
        answer: 0
      },
      {
        question: 'In machine learning, what is "overfitting"?',
        options: [
          'When a model generalizes perfectly to unseen data',
          'When a model performs well on training data but poorly on test data',
          'When a model is too simple to learn from training data',
          'When the training dataset is too small'
        ],
        answer: 1
      },
      {
        question: 'What type of machine learning task is predicting a continuous numerical value?',
        options: [
          'Classification',
          'Regression',
          'Clustering',
          'Dimensionality Reduction'
        ],
        answer: 1
      }
    ]
  },
  {
    title: 'React Native Mobile App Development',
    description: 'Build cross-platform iOS and Android mobile apps using React Native, Expo, and Redux Toolkit. Design interactive user interfaces with animations.',
    shortDescription: 'Build native mobile apps for iOS and Android using React Native.',
    category: 'Development',
    instructor: 'Dr. Angela Chen',
    instructorBio: 'Dr. Angela is a senior software engineer and researcher with 12+ years of experience training engineers at tech firms.',
    rating: 4.6,
    reviewsCount: 420,
    price: 79.99,
    originalPrice: 149.99,
    duration: '30 hours',
    level: 'Intermediate',
    studentsEnrolled: 2500,
    thumbnail: 'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=800&auto=format&fit=crop&q=60',
    lessons: [
      { title: 'Setting Up Expo & Android/iOS Simulators', duration: '12:10', videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4' },
      { title: 'Styling with Flexbox & Native Components', duration: '19:40', videoUrl: 'https://www.w3schools.com/html/movie.mp4' }
    ],
    quiz: [
      {
        question: 'Which tool is commonly used to run React Native apps without setting up Xcode or Android Studio?',
        options: ['Expo', 'Webpack', 'Babel', 'Vite'],
        answer: 0
      },
      {
        question: 'How do you style components in React Native?',
        options: [
          'Using CSS stylesheet files',
          'Using the StyleSheet API and inline styles',
          'Using HTML style tags',
          'Using Bootstrap classes'
        ],
        answer: 1
      },
      {
        question: 'Which core component in React Native is used to display text?',
        options: [
          '<Paragraph>',
          '<Label>',
          '<Text>',
          '<Span>'
        ],
        answer: 2
      },
      {
        question: 'What React Native component is used to render scrollable lists efficiently?',
        options: [
          '<ScrollView>',
          '<FlatList>',
          '<ListView>',
          '<SafeList>'
        ],
        answer: 1
      }
    ]
  },
  {
    title: 'Docker & Kubernetes Containerization Masterclass',
    description: 'Learn containerization with Docker and orchestrate complex microservices at scale using Kubernetes clusters. Master DevOps pipelines.',
    shortDescription: 'Learn Docker and orchestrate container clusters with Kubernetes.',
    category: 'Development',
    instructor: 'Dr. Angela Chen',
    instructorBio: 'Dr. Angela is a senior software engineer and researcher with 12+ years of experience training engineers at tech firms.',
    rating: 4.9,
    reviewsCount: 310,
    price: 109.99,
    originalPrice: 199.99,
    duration: '20 hours',
    level: 'Advanced',
    studentsEnrolled: 1800,
    thumbnail: 'https://images.unsplash.com/photo-1607799279861-4dd421887fb3?w=800&auto=format&fit=crop&q=60',
    lessons: [
      { title: 'Docker Containers vs Virtual Machines', duration: '15:18', videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4' },
      { title: 'Writing Dockerfiles and Docker-Compose configuration', duration: '22:10', videoUrl: 'https://www.w3schools.com/html/movie.mp4' }
    ],
    quiz: [
      {
        question: 'What Kubernetes resource is the smallest deployable unit?',
        options: ['Service', 'Pod', 'Deployment', 'Node'],
        answer: 1
      },
      {
        question: 'Which Docker command is used to build an image from a Dockerfile?',
        options: [
          'docker compile',
          'docker build',
          'docker create',
          'docker run'
        ],
        answer: 1
      },
      {
        question: 'What is the main purpose of a Dockerfile?',
        options: [
          'To store database credentials',
          'To define instructions for building a container image',
          'To manage cluster deployment schedules',
          'To run container network firewalls'
        ],
        answer: 1
      },
      {
        question: 'In Kubernetes, what component is responsible for orchestrating the worker nodes?',
        options: [
          'Kubelet',
          'Control Plane',
          'Container Runtime',
          'etcd'
        ],
        answer: 1
      }
    ]
  },
  {
    title: 'Complete Figma Design System Course',
    description: 'Create robust components, typography grids, dynamic variables, and custom theme configurations to build enterprise UI systems in Figma.',
    shortDescription: 'Build scalable and enterprise-ready UI design systems in Figma.',
    category: 'Design',
    instructor: 'Sarah Croft',
    instructorBio: 'Sarah is an award-winning digital artist and UI consultant working with global startups to craft interactive interfaces.',
    rating: 4.8,
    reviewsCount: 510,
    price: 39.99,
    originalPrice: 79.99,
    duration: '15 hours',
    level: 'Beginner',
    studentsEnrolled: 3200,
    thumbnail: 'https://images.unsplash.com/photo-1611532736597-de2d4265fba3?w=800&auto=format&fit=crop&q=60',
    lessons: [
      { title: 'Design System Fundamentals & Typography Grids', duration: '14:22', videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4' },
      { title: 'Building Components with Variants & Properties', duration: '26:15', videoUrl: 'https://www.w3schools.com/html/movie.mp4' }
    ],
    quiz: [
      {
        question: 'What Figma feature allows developers to inspect tokens, spacing, and styling properties directly?',
        options: ['Dev Mode', 'Design Mode', 'Prototype Mode', 'Inspect Panel'],
        answer: 0
      },
      {
        question: 'What is a "component library" in Figma?',
        options: [
          'A collection of reusable design elements like buttons and inputs',
          'A file containing code snippets',
          'A repository of high-res stock photos',
          'A list of user personas'
        ],
        answer: 0
      },
      {
        question: 'What Figma feature allows you to define styles that can adapt based on light or dark modes?',
        options: [
          'Variables',
          'Auto-Layout',
          'Masks',
          'Constraints'
        ],
        answer: 0
      },
      {
        question: 'In Figma, what are "Styles" primarily used for?',
        options: [
          'Defining layout constraints',
          'Reusing colors, typography, shadows, and grids consistently',
          'Generating code snippets',
          'Creating animated transitions'
        ],
        answer: 1
      }
    ]
  },
  {
    title: 'Copywriting & Brand Messaging Masterclass',
    description: 'Master the art of writing landing page copy, email sales funnels, and compelling brand headlines that drive customer conversion.',
    shortDescription: 'Write sales copy and brand messaging that converts prospects to customers.',
    category: 'Marketing',
    instructor: 'David Miller',
    instructorBio: 'David is a growth consultant who previously managed $10M+ annual digital ad spend for e-commerce companies.',
    rating: 4.6,
    reviewsCount: 390,
    price: 29.99,
    originalPrice: 69.99,
    duration: '12 hours',
    level: 'Beginner',
    studentsEnrolled: 2100,
    thumbnail: 'https://images.unsplash.com/photo-1455390582262-044cdead277a?w=800&auto=format&fit=crop&q=60',
    lessons: [
      { title: 'Emotional Triggers & Psychological Copywriting', duration: '11:50', videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4' },
      { title: 'Formulating Landing Page Headings & CTAs', duration: '18:12', videoUrl: 'https://www.w3schools.com/html/movie.mp4' }
    ],
    quiz: [
      {
        question: 'What is the copywriting formula AIDA short for?',
        options: [
          'Attention, Interest, Desire, Action',
          'Action, Insight, Data, Analysis',
          'Aim, Interest, Demand, Achievement',
          'Audience, Interaction, Development, Activity'
        ],
        answer: 0
      },
      {
        question: 'In copywriting, what is a CTA?',
        options: [
          'Client Trust Agreement',
          'Call To Action',
          'Content Target Audience',
          'Campaign Time Allocation'
        ],
        answer: 1
      },
      {
        question: 'What is the primary purpose of a headline in a landing page?',
        options: [
          'To explain every technical feature of the product',
          'To grab the reader\'s attention and make them want to read more',
          'To improve the site\'s search engine load times',
          'To display the pricing information'
        ],
        answer: 1
      },
      {
        question: 'Which tone of voice is generally recommended for copywriting aimed at building user trust?',
        options: [
          'Condescending and highly academic',
          'Clear, empathetic, and benefit-focused',
          'Overly promotional with multiple exclamation marks',
          'Extremely formal and dry'
        ],
        answer: 1
      }
    ]
  },
  {
    title: 'Next.js & Server-Side Rendering Guide',
    description: 'Deep dive into Next.js App Router, server-side data fetching, Server Actions, SEO optimizations, and static site generation (SSG).',
    shortDescription: 'Master Next.js App Router, SSR, and production performance.',
    category: 'Development',
    instructor: 'Dr. Angela Chen',
    instructorBio: 'Dr. Angela is a senior software engineer and researcher with 12+ years of experience training engineers at tech firms.',
    rating: 4.8,
    reviewsCount: 480,
    price: 89.99,
    originalPrice: 179.99,
    duration: '25 hours',
    level: 'Advanced',
    studentsEnrolled: 2700,
    thumbnail: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800&auto=format&fit=crop&q=60',
    lessons: [
      { title: 'Next.js Routing: Pages vs App Router', duration: '16:40', videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4' },
      { title: 'Server Components vs Client Components', duration: '21:30', videoUrl: 'https://www.w3schools.com/html/movie.mp4' }
    ],
    quiz: [
      {
        question: 'By default, components inside the Next.js App Router are:',
        options: ['Server Components', 'Client Components', 'Static Files', 'Hydrated Elements'],
        answer: 0
      },
      {
        question: 'What folder-based router convention does the Next.js App Router use?',
        options: [
          'File-based routes inside the /pages folder',
          'Folder-based routing where folders define path segments and page.js defines the UI',
          'A centralized routes.json configuration file',
          'Dynamic Express-like routes in index.js'
        ],
        answer: 1
      },
      {
        question: 'Which function or feature in Next.js is used to handle data mutations on the server?',
        options: [
          'getServerSideProps',
          'Server Actions',
          'useSession',
          'getStaticProps'
        ],
        answer: 1
      },
      {
        question: 'How does Server-Side Rendering (SSR) improve SEO compared to Client-Side Rendering (CSR)?',
        options: [
          'It serves a fully rendered HTML page that crawlers can immediately parse',
          'It minifies CSS automatically',
          'It eliminates the need for meta tags',
          'It prevents users from inspecting the page source code'
        ],
        answer: 0
      }
    ]
  },
  {
    title: 'Adobe Illustrator Vector Art & Illustration',
    description: 'Create professional logos, typography branding designs, vector illustrations, and character drawings from scratch in Adobe Illustrator.',
    shortDescription: 'Learn vector illustration and professional logo design in Illustrator.',
    category: 'Design',
    instructor: 'Sarah Croft',
    instructorBio: 'Sarah is an award-winning digital artist and UI consultant working with global startups to craft interactive interfaces.',
    rating: 4.7,
    reviewsCount: 310,
    price: 59.99,
    originalPrice: 119.99,
    duration: '22 hours',
    level: 'Beginner',
    studentsEnrolled: 1900,
    thumbnail: 'https://images.unsplash.com/photo-1626785774573-4b799315345d?w=800&auto=format&fit=crop&q=60',
    lessons: [
      { title: 'Pen Tool Mechanics & Vector Anchor Points', duration: '13:50', videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4' },
      { title: 'Creating Custom Branding Grids & Typography', duration: '20:15', videoUrl: 'https://www.w3schools.com/html/movie.mp4' }
    ],
    quiz: [
      {
        question: 'Which tool is used in Illustrator to select individual vector points or segments?',
        options: ['Direct Selection Tool', 'Selection Tool', 'Pen Tool', 'Lasso Tool'],
        answer: 0
      },
      {
        question: 'What is the difference between Vector and Raster graphics?',
        options: [
          'Vector uses pixels, Raster uses mathematical equations',
          'Vector uses mathematical paths that scale infinitely, Raster uses a grid of pixels',
          'Vector graphics cannot be printed, Raster graphics can',
          'Vector graphics always have larger file sizes'
        ],
        answer: 1
      },
      {
        question: 'What panel in Illustrator allows you to combine or subtract overlapping vector shapes?',
        options: [
          'Pathfinder',
          'Align',
          'Layers',
          'Gradient'
        ],
        answer: 0
      },
      {
        question: 'What file format is standard for vector graphics on the web?',
        options: [
          'JPEG',
          'PNG',
          'SVG',
          'GIF'
        ],
        answer: 2
      }
    ]
  },
  {
    title: 'Social Media Marketing & Brand Building',
    description: 'Build a massive community on Instagram, LinkedIn, and TikTok using visual storytelling, scheduling pipelines, and viral video campaigns.',
    shortDescription: 'Build a massive social media brand presence and run campaigns.',
    category: 'Marketing',
    instructor: 'David Miller',
    instructorBio: 'David is a growth consultant who previously managed $10M+ annual digital ad spend for e-commerce companies.',
    rating: 4.5,
    reviewsCount: 280,
    price: 44.99,
    originalPrice: 89.99,
    duration: '16 hours',
    level: 'Intermediate',
    studentsEnrolled: 1500,
    thumbnail: 'https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?w=800&auto=format&fit=crop&q=60',
    lessons: [
      { title: 'Decoding Social Algorithms & Viral Mechanics', duration: '10:45', videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4' },
      { title: 'Video Editing Funnels for Short-Form Content', duration: '16:30', videoUrl: 'https://www.w3schools.com/html/movie.mp4' }
    ],
    quiz: [
      {
        question: 'What metric represents the percentage of viewers who watched a video to completion?',
        options: ['Retention Rate', 'Click-Through Rate', 'Bounce Rate', 'Engagement Ratio'],
        answer: 0
      },
      {
        question: 'Which platform is best suited for B2B (business-to-business) marketing and professional networking?',
        options: [
          'TikTok',
          'Instagram',
          'LinkedIn',
          'Pinterest'
        ],
        answer: 2
      },
      {
        question: 'What does "organic reach" refer to?',
        options: [
          'The number of views gained through paid sponsorships',
          'The number of people who see your content without paid promotion',
          'The reach of marketing campaigns for organic food products',
          'The click rate of email newsletters'
        ],
        answer: 1
      },
      {
        question: 'What is a key benefit of using a social media content calendar?',
        options: [
          'It increases server response times',
          'It helps plan, schedule, and maintain consistent posting frequencies',
          'It automatically writes all post copy using AI',
          'It eliminates the need for social media ads'
        ],
        answer: 1
      }
    ]
  },
  {
    title: 'AWS Cloud Practitioner Certificate Prep',
    description: 'Master AWS core services, IAM security policies, pricing plans, and cloud architectures to pass the AWS Certified Cloud Practitioner exam.',
    shortDescription: 'Get certified as an AWS Cloud Practitioner with comprehensive exam prep.',
    category: 'Development',
    instructor: 'Dr. Angela Chen',
    instructorBio: 'Dr. Angela is a senior software engineer and researcher with 12+ years of experience training engineers at tech firms.',
    rating: 4.8,
    reviewsCount: 710,
    price: 99.99,
    originalPrice: 199.99,
    duration: '35 hours',
    level: 'Beginner',
    studentsEnrolled: 3900,
    thumbnail: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800&auto=format&fit=crop&q=60',
    lessons: [
      { title: 'Global Infrastructure: Regions and Availability Zones', duration: '18:40', videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4' },
      { title: 'AWS Identity and Access Management (IAM)', duration: '24:10', videoUrl: 'https://www.w3schools.com/html/movie.mp4' }
    ],
    quiz: [
      {
        question: 'Which AWS service is used to store unstructured flat files and static assets?',
        options: ['S3', 'EC2', 'RDS', 'Lambda'],
        answer: 0
      },
      {
        question: 'What does the "Pay-as-you-go" pricing model in AWS mean?',
        options: [
          'You pay a fixed monthly subscription fee regardless of usage',
          'You only pay for the cloud resources you actually provision and consume',
          'You must pay in advance for 3 years of usage',
          'All AWS services are completely free for personal accounts'
        ],
        answer: 1
      },
      {
        question: 'What is the AWS service used to spin up virtual servers in the cloud?',
        options: [
          'RDS',
          'EC2',
          'S3',
          'Lambda'
        ],
        answer: 1
      },
      {
        question: 'Under the AWS Shared Responsibility Model, what is the customer responsible for?',
        options: [
          'Physical security of data centers',
          'Managing guest operating systems, application software, and data firewall settings',
          'Disposal of old server hardware',
          'Patching the host virtualization software'
        ],
        answer: 1
      }
    ]
  },
  {
    title: 'Data Visualization with Tableau & SQL',
    description: 'Write advanced SQL queries, group aggregates, and build complex interactive data dashboards in Tableau to drive business decisions.',
    shortDescription: 'Write SQL queries and build dashboards in Tableau.',
    category: 'Development',
    instructor: 'Dr. Angela Chen',
    instructorBio: 'Dr. Angela is a senior software engineer and researcher with 12+ years of experience training engineers at tech firms.',
    rating: 4.6,
    reviewsCount: 430,
    price: 69.99,
    originalPrice: 129.99,
    duration: '19 hours',
    level: 'Intermediate',
    studentsEnrolled: 2200,
    thumbnail: 'https://images.unsplash.com/photo-1504868584819-f8e8b4b6d7e3?w=800&auto=format&fit=crop&q=60',
    lessons: [
      { title: 'SQL Joins, Group By, and Aggregation Queries', duration: '14:50', videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4' },
      { title: 'Connecting Databases to Tableau Workspaces', duration: '19:10', videoUrl: 'https://www.w3schools.com/html/movie.mp4' }
    ],
    quiz: [
      {
        question: 'Which SQL join returns all records from the left table and matching records from the right table?',
        options: ['LEFT JOIN', 'INNER JOIN', 'RIGHT JOIN', 'FULL OUTER JOIN'],
        answer: 0
      },
      {
        question: 'Which SQL clause is used to filter records returned by a GROUP BY clause based on aggregate values?',
        options: [
          'WHERE',
          'HAVING',
          'ORDER BY',
          'LIMIT'
        ],
        answer: 1
      },
      {
        question: 'What is the difference between a "Dimension" and a "Measure" in Tableau?',
        options: [
          'Dimensions are qualitative/categorical values, Measures are quantitative/numerical values',
          'Dimensions are for maps, Measures are for charts',
          'Dimensions cannot be filtered, Measures can',
          'Dimensions are loaded from SQL, Measures are computed in Tableau'
        ],
        answer: 0
      },
      {
        question: 'What SQL keyword is used to remove duplicate rows from a query result?',
        options: [
          'UNIQUE',
          'DISTINCT',
          'GROUP BY',
          'SORT'
        ],
        answer: 1
      }
    ]
  },
  {
    title: 'User Research & Usability Testing Methods',
    description: 'Conduct user interviews, build affinity maps, configure tree testing grids, and perform card sorting to validate usability issues.',
    shortDescription: 'Learn UX research, interviewing, mapping, and testing techniques.',
    category: 'Design',
    instructor: 'Sarah Croft',
    instructorBio: 'Sarah is an award-winning digital artist and UI consultant working with global startups to craft interactive interfaces.',
    rating: 4.8,
    reviewsCount: 210,
    price: 49.99,
    originalPrice: 99.99,
    duration: '14 hours',
    level: 'Advanced',
    studentsEnrolled: 1200,
    thumbnail: 'https://images.unsplash.com/photo-1531403009284-440f080d1e12?w=800&auto=format&fit=crop&q=60',
    lessons: [
      { title: 'Formulating Unbiased Interview Questions', duration: '11:20', videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4' },
      { title: 'Analyzing User Sessions with Hotjar Maps', duration: '17:40', videoUrl: 'https://www.w3schools.com/html/movie.mp4' }
    ],
    quiz: [
      {
        question: 'What research method involves users grouping menu categories to organize navigation structures?',
        options: ['Card Sorting', 'A/B Testing', 'Eye Tracking', 'Heuristic Evaluation'],
        answer: 0
      },
      {
        question: 'What is the primary difference between Qualitative and Quantitative user research?',
        options: [
          'Qualitative focuses on "why" users behave a certain way, Quantitative focuses on "how many" or statistical data',
          'Qualitative is cheaper, Quantitative is more expensive',
          'Qualitative only uses surveys, Quantitative only uses interviews',
          'There is no difference'
        ],
        answer: 0
      },
      {
        question: 'What is a "User Persona"?',
        options: [
          'A detailed biography of the CEO',
          'A semi-fictional representation of your target user based on data and research',
          'A technical specification document for developer handoff',
          'An actor hired to test the product'
        ],
        answer: 1
      },
      {
        question: 'In usability testing, what is "think-aloud protocol"?',
        options: [
          'Having the designer explain their thought process during a presentation',
          'Asking users to verbalize their thoughts, feelings, and actions as they complete a task',
          'Having developers write down code comments',
          'Asking users to write a review after the session'
        ],
        answer: 1
      }
    ]
  },
  {
    title: 'Google Analytics 4 & Conversion Optimization',
    description: 'Track user behavior, conversion funnel metrics, drop-offs, and custom parameters using Google Tag Manager and GA4 dashboard interfaces.',
    shortDescription: 'Master GA4 behavior tracking and conversion rate optimization.',
    category: 'Marketing',
    instructor: 'David Miller',
    instructorBio: 'David is a growth consultant who previously managed $10M+ annual digital ad spend for e-commerce companies.',
    rating: 4.7,
    reviewsCount: 310,
    price: 34.99,
    originalPrice: 79.99,
    duration: '11 hours',
    level: 'Intermediate',
    studentsEnrolled: 1800,
    thumbnail: 'https://images.unsplash.com/photo-1551836022-d5d88e9218df?w=800&auto=format&fit=crop&q=60',
    lessons: [
      { title: 'GA4 Setup: Data Streams and Event Configuration', duration: '12:15', videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4' },
      { title: 'Building Funnel Explorations in GA4 Custom Reports', duration: '17:50', videoUrl: 'https://www.w3schools.com/html/movie.mp4' }
    ],
    quiz: [
      {
        question: 'In Google Analytics 4, all interactions and page hits are tracked as:',
        options: ['Events', 'Sessions', 'Pageviews', 'Hits'],
        answer: 0
      },
      {
        question: 'What is a "conversion funnel"?',
        options: [
          'A visualization of the path users take to complete a goal, showing drop-offs at each step',
          'A method of compressing website images',
          'A tool for redirecting web traffic to other domains',
          'An email marketing list generator'
        ],
        answer: 0
      },
      {
        question: 'What does CRO stand for in web analytics?',
        options: [
          'Conversion Rate Optimization',
          'Customer Reach Organization',
          'Click Rate Observation',
          'Campaign Resource Optimization'
        ],
        answer: 0
      },
      {
        question: 'Which GA4 report category helps you see where your website visitors came from (e.g., organic search, direct, paid ads)?',
        options: [
          'Engagement',
          'Retention',
          'Acquisition',
          'Monetization'
        ],
        answer: 2
      }
    ]
  }
];

const importData = async () => {
  try {
    const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/coursenest';
    console.log(`Connecting to database at ${mongoUri}...`);
    await mongoose.connect(mongoUri);
    
    console.log('Wiping existing data...');
    await User.deleteMany();
    await Course.deleteMany();
    await Enrollment.deleteMany();
    await Post.deleteMany();

    console.log('Inserting users...');
    const createdUsers = [];
    for (let u of usersData) {
      const newUser = new User(u);
      const savedUser = await newUser.save();
      createdUsers.push(savedUser);
    }
    console.log(`${createdUsers.length} users inserted successfully.`);

    console.log('Inserting courses...');
    const createdCourses = await Course.insertMany(coursesData);
    console.log(`${createdCourses.length} courses inserted successfully.`);

    // Find specific users and courses to setup initial enrollments and forum posts
    const alex = createdUsers.find(u => u.email === 'alex@example.com');
    const angela = createdUsers.find(u => u.email === 'angela@example.com');
    const sarah = createdUsers.find(u => u.email === 'sarah@design.com');
    const marcus = createdUsers.find(u => u.email === 'marcus@example.com');

    const webBootcamp = createdCourses.find(c => c.title.includes('Full-Stack'));
    const uiMasterclass = createdCourses.find(c => c.title.includes('Advanced UI/UX'));

    console.log('Inserting enrollments for Alex Johnson...');
    if (alex && webBootcamp && uiMasterclass) {
      // Enrollment 1: 33% progress (completed 1st two lessons)
      const lesson1_1 = webBootcamp.lessons[0]._id;
      const lesson1_2 = webBootcamp.lessons[1]._id;
      const enrollment1 = new Enrollment({
        userId: alex._id,
        courseId: webBootcamp._id,
        progress: 33,
        completedLessons: [lesson1_1, lesson1_2],
        quizScore: null
      });

      // Enrollment 2: 50% progress, quiz score 100
      const lesson2_1 = uiMasterclass.lessons[0]._id;
      const lesson2_2 = uiMasterclass.lessons[2]._id; // complete 1st and 3rd lessons
      const enrollment2 = new Enrollment({
        userId: alex._id,
        courseId: uiMasterclass._id,
        progress: 50,
        completedLessons: [lesson2_1, lesson2_2],
        quizScore: 100
      });

      await Enrollment.insertMany([enrollment1, enrollment2]);
      console.log('Alex Johnson enrollments created.');
    }

    console.log('Inserting forum posts...');
    if (alex && angela && sarah && marcus) {
      const postsData = [
        {
          title: 'Trouble with CSS Grid alignment inside a React component',
          content: 'Hi everyone, I am building the Course Player page, and my CSS Grid lessons-sidebar layout breaks whenever I resize to mobile portrait. The grid item overlaps the main video panel. Should I convert it to a Flexbox layout or use CSS Grid grid-template-areas? Thanks!',
          userId: alex._id,
          likes: [marcus._id], // Liked by Marcus
          comments: [
            {
              userId: angela._id,
              content: 'For responsive layouts, media queries targeting flex-direction column are usually easier for course sidebars. You can set the sidebar grid-column: span 12 for screens under 768px!'
            },
            {
              userId: alex._id,
              content: "I had this issue and Dr. Angela's solution worked like a charm! Make sure you define grid-template-columns: 1fr on mobile."
            }
          ]
        },
        {
          title: 'Figma Auto-Layout 4.0 update is a game changer!',
          content: 'Just explored the new wrap-lines options in Figma Auto-Layout! It makes responsive layout mockups 10x faster. We do not need to create different screens for mobile and web anymore, we can just wrap the design. Let me know your thoughts.',
          userId: sarah._id,
          likes: [alex._id, angela._id], // Liked by Alex and Angela
          comments: [
            {
              userId: marcus._id,
              content: "Wow, this is awesome! I was manually aligning cards for my CourseNest mockup last week. Can't wait to try this out."
            }
          ]
        }
      ];

      await Post.insertMany(postsData);
      console.log('Forum posts inserted.');
    }

    console.log('Data seeding completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error(`Seeding error: ${error.message}`);
    process.exit(1);
  }
};

importData();
