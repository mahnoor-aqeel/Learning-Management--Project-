import axios from 'axios';

const API = axios.create({ baseURL: '/api' });

// Har request se pehle localStorage se token lo
API.interceptors.request.use((config) => {
  const user = localStorage.getItem('lmsUser');
  if (user) {
    const parsed = JSON.parse(user);
    config.headers.Authorization = `Bearer ${parsed.token}`;
  }
  return config;
});

// Auth
export const registerUser = (data) => API.post('/auth/register', data);
export const loginUser = (data) => API.post('/auth/login', data);
export const getMe = () => API.get('/auth/me');

// Courses
export const getAllCourses = (params) => API.get('/courses', { params });
export const getCourseById = (id) => API.get(`/courses/${id}`);
export const createCourse = (data) => API.post('/courses', data);
export const updateCourse = (id, data) => API.put(`/courses/${id}`, data);
export const deleteCourse = (id) => API.delete(`/courses/${id}`);
export const addLesson = (id, data) => API.post(`/courses/${id}/lessons`, data);
export const getInstructorCourses = () => API.get('/courses/instructor');

// Users (admin)
export const getAllUsers = () => API.get('/users');
export const deleteUser = (id) => API.delete(`/users/${id}`);
export const getAnalytics = () => API.get('/users/analytics');

// Enrollment
export const enrollInCourse = (courseId) => API.post('/enroll', { courseId });
export const getMyCourses = () => API.get('/enroll/my-courses');
export const updateProgress = (id, progress) => API.put(`/enroll/${id}/progress`, { progress });
