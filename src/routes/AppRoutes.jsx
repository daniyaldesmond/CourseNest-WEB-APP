import React from 'react';
import { Routes, Route, Navigate, Outlet } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import Footer from '../components/Footer';
import { useAuth } from '../context/AuthContext';
import ProtectedRoute from '../components/ProtectedRoute';

// Import Pages (to be implemented next)
import Home from '../pages/Home';
import About from '../pages/About';
import Courses from '../pages/Courses';
import CourseDetails from '../pages/CourseDetails';
import Login from '../pages/Login';
import Signup from '../pages/Signup';
import StudentDashboard from '../pages/StudentDashboard';
import MyLearning from '../pages/MyLearning';
import CoursePlayer from '../pages/CoursePlayer';
import QuizPage from '../pages/QuizPage';
import Community from '../pages/Community';
import Profile from '../pages/Profile';
import AdminDashboard from '../pages/AdminDashboard';
import ManageCourses from '../pages/ManageCourses';
import ManageLessons from '../pages/ManageLessons';
import ManageQuizzes from '../pages/ManageQuizzes';
import ManageUsers from '../pages/ManageUsers';

// Layout 1: Main Public Layout (Navbar + Page Content + Footer)
const MainLayout = () => (
  <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
    <Navbar />
    <main style={{ flex: 1, marginTop: 'var(--header-height)' }}>
      <Outlet />
    </main>
    <Footer />
  </div>
);

// Layout 2: Student Dashboard Layout (Navbar + Sidebar + Content)
const DashboardLayout = () => {
  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Navbar />
      <div className="dashboard-layout">
        <Sidebar isAdmin={false} />
        <main className="dashboard-content" style={{ marginLeft: 'var(--sidebar-width)' }}>
          <Outlet />
        </main>
      </div>
      {/* Visual helper: no global footer in dashboard view to maximize space */}
    </div>
  );
};

// Layout 3: Admin Dashboard Layout (Navbar + Sidebar + Content)
const AdminLayout = () => {
  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Navbar />
      <div className="dashboard-layout">
        <Sidebar isAdmin={true} />
        <main className="dashboard-content" style={{ marginLeft: 'var(--sidebar-width)' }}>
          <Outlet />
        </main>
      </div>
    </div>
  );
};

// Layout 4: Specialized Course Player/Quiz Header Layout (Navbar only, no sidebar/footer)
const SpecialPlayerLayout = () => {
  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Navbar />
      <main style={{ flex: 1, marginTop: 'var(--header-height)', backgroundColor: 'var(--dark-bg)' }}>
        <Outlet />
      </main>
    </div>
  );
};

const AppRoutes = () => {
  return (
    <Routes>
      {/* Public Pages */}
      <Route element={<MainLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/courses" element={<Courses />} />
        <Route path="/courses/:id" element={<CourseDetails />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/community" element={<Community />} />
        <Route path="/profile" element={<Profile />} />
      </Route>

      {/* Student Dashboard Pages */}
      <Route element={<ProtectedRoute allowedRoles={['student', 'instructor']} />}>
        <Route element={<DashboardLayout />}>
          <Route path="/dashboard" element={<StudentDashboard />} />
          <Route path="/my-learning" element={<MyLearning />} />
        </Route>
      </Route>

      {/* Course Player & Quiz Specialized Pages */}
      <Route element={<ProtectedRoute allowedRoles={['student', 'instructor', 'admin']} />}>
        <Route element={<SpecialPlayerLayout />}>
          <Route path="/player/:courseId" element={<CoursePlayer />} />
          <Route path="/quiz/:courseId" element={<QuizPage />} />
        </Route>
      </Route>

      {/* Admin Dashboard Pages */}
      <Route element={<ProtectedRoute allowedRoles={['admin']} />}>
        <Route element={<AdminLayout />}>
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/admin/courses" element={<ManageCourses />} />
          <Route path="/admin/lessons" element={<ManageLessons />} />
          <Route path="/admin/quizzes" element={<ManageQuizzes />} />
          <Route path="/admin/users" element={<ManageUsers />} />
        </Route>
      </Route>

      {/* Fallback route */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export default AppRoutes;
