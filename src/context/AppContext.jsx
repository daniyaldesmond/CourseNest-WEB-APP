import React, { createContext, useState, useContext, useEffect } from 'react';
import apiService from '../services/api';
import { useAuth } from './AuthContext';

const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const [courses, setCourses] = useState([]);
  const [enrollments, setEnrollments] = useState([]);
  const [posts, setPosts] = useState([]);
  const [users, setUsers] = useState([]);
  const { isAuthenticated, user } = useAuth();

  // Load initial database records
  useEffect(() => {
    const fetchData = async () => {
      try {
        const coursesData = await apiService.getCourses();
        const normalizedCourses = coursesData.map(c => ({
          ...c,
          id: c._id,
          lessons: (c.lessons || []).map(l => ({ ...l, id: l._id })),
          quiz: (c.quiz || []).map(q => ({ ...q, id: q._id }))
        }));
        setCourses(normalizedCourses);

        const postsData = await apiService.getPosts();
        setPosts(postsData);

        if (isAuthenticated) {
          const enrollmentsData = await apiService.getMyEnrollments();
          const normalizedEnrollments = enrollmentsData.map(e => ({
            ...e,
            courseId: e.courseId?._id || e.courseId
          }));
          setEnrollments(normalizedEnrollments);

          if (user?.role === 'admin') {
            const usersData = await apiService.getAllUsers();
            setUsers(usersData.map(u => ({ ...u, id: u._id })));
          }
        } else {
          setEnrollments([]);
          setUsers([]);
        }
      } catch (err) {
        console.error("Error loading database records:", err);
      }
    };

    fetchData();
  }, [isAuthenticated, user]);

  // Course management
  const addCourse = async (newCourse) => {
    try {
      const saved = await apiService.saveCourse(newCourse);
      const normalized = {
        ...saved,
        id: saved._id,
        lessons: (saved.lessons || []).map(l => ({ ...l, id: l._id })),
        quiz: (saved.quiz || []).map(q => ({ ...q, id: q._id }))
      };
      setCourses(prev => [...prev, normalized]);
      return { success: true, course: normalized };
    } catch (err) {
      console.error(err);
      return { success: false, message: err.message };
    }
  };

  const updateCourse = async (id, updatedFields) => {
    try {
      const saved = await apiService.saveCourse({ id, ...updatedFields });
      const normalized = {
        ...saved,
        id: saved._id,
        lessons: (saved.lessons || []).map(l => ({ ...l, id: l._id })),
        quiz: (saved.quiz || []).map(q => ({ ...q, id: q._id }))
      };
      setCourses(prev => prev.map(c => c.id === id ? normalized : c));
      return { success: true };
    } catch (err) {
      console.error(err);
      return { success: false, message: err.message };
    }
  };

  const deleteCourse = async (id) => {
    try {
      await apiService.deleteCourse(id);
      setCourses(prev => prev.filter(c => c.id !== id));
      setEnrollments(prev => prev.filter(e => e.courseId !== id));
      return { success: true };
    } catch (err) {
      console.error(err);
      return { success: false, message: err.message };
    }
  };

  // Student progress actions
  const enrollInCourse = async (courseId) => {
    try {
      await apiService.enrollInCourse(courseId);
      const enrollmentsData = await apiService.getMyEnrollments();
      const normalizedEnrollments = enrollmentsData.map(e => ({
        ...e,
        courseId: e.courseId?._id || e.courseId
      }));
      setEnrollments(normalizedEnrollments);
      setCourses(prev => prev.map(c => c.id === courseId ? { ...c, studentsEnrolled: c.studentsEnrolled + 1 } : c));
      return { success: true };
    } catch (err) {
      console.error(err);
      return { success: false, message: err.message };
    }
  };

  const completeLesson = async (courseId, lessonId) => {
    try {
      await apiService.toggleLessonCompletion(courseId, lessonId);
      const enrollmentsData = await apiService.getMyEnrollments();
      const normalizedEnrollments = enrollmentsData.map(e => ({
        ...e,
        courseId: e.courseId?._id || e.courseId
      }));
      setEnrollments(normalizedEnrollments);
    } catch (err) {
      console.error(err);
    }
  };

  const submitQuizScore = async (courseId, score) => {
    try {
      await apiService.submitQuizScore(courseId, score);
      const enrollmentsData = await apiService.getMyEnrollments();
      const normalizedEnrollments = enrollmentsData.map(e => ({
        ...e,
        courseId: e.courseId?._id || e.courseId
      }));
      setEnrollments(normalizedEnrollments);
    } catch (err) {
      console.error(err);
    }
  };

  // Community action
  const createPost = async (title, content) => {
    try {
      const saved = await apiService.createPost(title, content);
      setPosts(prev => [saved, ...prev]);
      return { success: true };
    } catch (err) {
      console.error(err);
      return { success: false, message: err.message };
    }
  };

  const addComment = async (postId, content) => {
    try {
      const updatedPost = await apiService.addComment(postId, content);
      setPosts(prev => prev.map(p => p.id === postId ? updatedPost : p));
      return { success: true };
    } catch (err) {
      console.error(err);
      return { success: false, message: err.message };
    }
  };

  const likePost = async (postId) => {
    try {
      const data = await apiService.likePost(postId);
      setPosts(prev => prev.map(p => p.id === postId ? { ...p, likes: data.likes, likedByCurrentUser: data.likedByCurrentUser } : p));
    } catch (err) {
      console.error(err);
    }
  };

  // User management
  const updateUserRole = async (id, newRole) => {
    try {
      await apiService.updateUserRole(id, newRole);
      setUsers(prev => prev.map(u => u.id === id ? { ...u, role: newRole } : u));
    } catch (err) {
      console.error(err);
    }
  };

  const toggleUserStatus = async (id) => {
    try {
      const data = await apiService.toggleUserStatus(id);
      setUsers(prev => prev.map(u => u.id === id ? { ...u, status: data.status } : u));
    } catch (err) {
      console.error(err);
    }
  };

  const deleteUser = async (id) => {
    try {
      await apiService.deleteUser(id);
      setUsers(prev => prev.filter(u => u.id !== id));
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <AppContext.Provider value={{
      courses,
      enrollments,
      posts,
      users,
      addCourse,
      updateCourse,
      deleteCourse,
      enrollInCourse,
      completeLesson,
      submitQuizScore,
      createPost,
      addComment,
      likePost,
      updateUserRole,
      toggleUserStatus,
      deleteUser
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => useContext(AppContext);
