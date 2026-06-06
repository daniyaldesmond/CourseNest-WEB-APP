import api from './axios';

export const apiService = {
  // Auth endpoints
  async login(email, password) {
    const response = await api.post('/auth/login', { email, password });
    return response.data;
  },

  async signup(name, email, password) {
    const response = await api.post('/auth/register', { name, email, password });
    return response.data;
  },

  async getMe() {
    const response = await api.get('/auth/me');
    return response.data;
  },

  async updateProfile(profileData) {
    const response = await api.put('/auth/profile', profileData);
    return response.data;
  },

  async uploadAvatar(file) {
    const formData = new FormData();
    formData.append('avatar', file);
    const response = await api.post('/auth/profile/avatar', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  async removeAvatar() {
    const response = await api.delete('/auth/profile/avatar');
    return response.data;
  },

  // Course endpoints
  async getCourses(filters = {}) {
    const response = await api.get('/courses', { params: filters });
    return response.data;
  },

  async getCourseById(id) {
    const response = await api.get(`/courses/${id}`);
    return response.data;
  },

  async saveCourse(courseData) {
    if (courseData.id) {
      const response = await api.put(`/courses/${courseData.id}`, courseData);
      return response.data;
    } else {
      const response = await api.post('/courses', courseData);
      return response.data;
    }
  },

  async deleteCourse(id) {
    const response = await api.delete(`/courses/${id}`);
    return response.data;
  },

  // Lesson endpoints
  async addLesson(courseId, lessonData) {
    const response = await api.post(`/courses/${courseId}/lessons`, lessonData);
    return response.data;
  },

  async updateLesson(courseId, lessonId, lessonData) {
    const response = await api.put(`/courses/${courseId}/lessons/${lessonId}`, lessonData);
    return response.data;
  },

  async deleteLesson(courseId, lessonId) {
    const response = await api.delete(`/courses/${courseId}/lessons/${lessonId}`);
    return response.data;
  },

  // Quiz endpoints
  async updateQuiz(courseId, quizData) {
    const response = await api.put(`/courses/${courseId}/quiz`, { quiz: quizData });
    return response.data;
  },

  // Enrollment endpoints
  async getMyEnrollments() {
    const response = await api.get('/enrollments');
    return response.data;
  },

  async enrollInCourse(courseId) {
    const response = await api.post(`/enrollments/enroll/${courseId}`);
    return response.data;
  },

  async toggleLessonCompletion(courseId, lessonId) {
    const response = await api.post(`/enrollments/course/${courseId}/lesson/${lessonId}`);
    return response.data;
  },

  async submitQuizScore(courseId, score) {
    const response = await api.post(`/enrollments/course/${courseId}/quiz`, { score });
    return response.data;
  },

  // Community endpoints
  async getPosts() {
    const response = await api.get('/posts');
    return response.data;
  },

  async getPostById(id) {
    const response = await api.get(`/posts/${id}`);
    return response.data;
  },

  async createPost(title, content) {
    const response = await api.post('/posts', { title, content });
    return response.data;
  },

  async likePost(id) {
    const response = await api.post(`/posts/${id}/like`);
    return response.data;
  },

  async addComment(postId, content) {
    const response = await api.post(`/posts/${postId}/comments`, { content });
    return response.data;
  },

  // Admin User management
  async getAllUsers(filters = {}) {
    const response = await api.get('/auth/users', { params: filters });
    return response.data;
  },

  async updateUserRole(id, role) {
    const response = await api.put(`/auth/users/${id}/role`, { role });
    return response.data;
  },

  async toggleUserStatus(id) {
    const response = await api.put(`/auth/users/${id}/status`);
    return response.data;
  },

  async deleteUser(id) {
    const response = await api.delete(`/auth/users/${id}`);
    return response.data;
  }
};

export default apiService;
