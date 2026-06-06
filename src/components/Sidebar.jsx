import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  Layout, BookOpen, MessageSquare, User,
  Settings, ShieldAlert, FileSpreadsheet, PlusCircle,
  Users, HelpCircle, FileQuestion
} from 'lucide-react';

const Sidebar = ({ isAdmin = false }) => {

  const studentLinks = [
    { to: '/dashboard', label: 'Dashboard', icon: Layout },
    { to: '/my-learning', label: 'My Learning', icon: BookOpen },
    { to: '/community', label: 'Community Feed', icon: MessageSquare },
    { to: '/profile', label: 'My Profile', icon: User }
  ];

  const adminLinks = [
    { to: '/admin', label: 'Admin Panel', icon: Layout },
    { to: '/admin/courses', label: 'Manage Courses', icon: PlusCircle },
    { to: '/admin/lessons', label: 'Manage Lessons', icon: FileSpreadsheet },
    { to: '/admin/quizzes', label: 'Manage Quizzes', icon: FileQuestion },
    { to: '/admin/users', label: 'Manage Users', icon: Users }
  ];

  const links = isAdmin ? adminLinks : studentLinks;

  return (
    <aside style={{
      width: 'var(--sidebar-width)',
      backgroundColor: 'var(--dark-surface)',
      borderRight: '1px solid var(--dark-border)',
      height: 'calc(100vh - var(--header-height))',
      position: 'fixed',
      top: 'var(--header-height)',
      left: 0,
      display: 'flex',
      flexDirection: 'column',
      padding: '1.5rem 1rem',
      justifyContent: 'space-between',
      zIndex: 10
    }} className="sidebar-container">
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
        {links.map((link) => {
          const Icon = link.icon;
          return (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.to === '/dashboard' || link.to === '/admin'}
              className={({ isActive }) => `sidebar-link${isActive ? ' active' : ''}`}
            >
              <Icon size={18} />
              <span>{link.label}</span>
            </NavLink>
          );
        })}
      </div>



      <style dangerouslySetInnerHTML={{
        __html: `
        @media (max-width: 768px) {
          .sidebar-container {
            display: none !important;
          }
        }
      `}} />
    </aside>
  );
};

export default Sidebar;
