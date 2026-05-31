import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { getAllUsers, deleteUser, getAnalytics, getAllCourses, deleteCourse } from '../services/api';

const AdminDashboard = () => {
  const [analytics, setAnalytics] = useState({});
  const [users, setUsers] = useState([]);
  const [courses, setCourses] = useState([]);
  const [activeTab, setActiveTab] = useState('analytics');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [analyticsRes, usersRes, coursesRes] = await Promise.all([
          getAnalytics(),
          getAllUsers(),
          getAllCourses(),
        ]);
        setAnalytics(analyticsRes.data);
        setUsers(usersRes.data);
        setCourses(coursesRes.data);
      } catch (err) {
        toast.error('Failed to load dashboard data');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleDeleteUser = async (id) => {
    if (!window.confirm('Delete this user?')) return;
    try {
      await deleteUser(id);
      setUsers(users.filter((u) => u._id !== id));
      toast.success('User deleted');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to delete user');
    }
  };

  const handleDeleteCourse = async (id) => {
    if (!window.confirm('Delete this course?')) return;
    try {
      await deleteCourse(id);
      setCourses(courses.filter((c) => c._id !== id));
      toast.success('Course deleted');
    } catch (err) {
      toast.error('Failed to delete course');
    }
  };

  if (loading) return <div className="text-center mt-5"><div className="spinner-border" /></div>;

  const ROLE_BADGE = { admin: 'danger', instructor: 'warning', student: 'info' };

  return (
    <div className="container py-5">
      <h2 className="fw-bold mb-4">Admin Dashboard 🛡️</h2>

      {/* Tab navigation */}
      <ul className="nav nav-tabs mb-4">
        {['analytics', 'users', 'courses'].map((tab) => (
          <li className="nav-item" key={tab}>
            <button
              className={`nav-link text-capitalize ${activeTab === tab ? 'active fw-semibold' : ''}`}
              onClick={() => setActiveTab(tab)}
            >
              {tab === 'analytics' ? '📊 Analytics' : tab === 'users' ? '👥 Users' : '📚 Courses'}
            </button>
          </li>
        ))}
      </ul>

      {/* Analytics Tab */}
      {activeTab === 'analytics' && (
        <div className="row g-4">
          {[
            { label: 'Total Users', value: analytics.totalUsers, color: 'primary' },
            { label: 'Students', value: analytics.totalStudents, color: 'info' },
            { label: 'Instructors', value: analytics.totalInstructors, color: 'warning' },
            { label: 'Total Courses', value: analytics.totalCourses, color: 'success' },
            { label: 'Total Enrollments', value: analytics.totalEnrollments, color: 'dark' },
          ].map((stat) => (
            <div className="col-md-4 col-6" key={stat.label}>
              <div className={`card border-0 shadow-sm p-4 text-center bg-${stat.color} text-white`}>
                <h2 className="fw-bold">{stat.value || 0}</h2>
                <p className="mb-0">{stat.label}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Users Tab */}
      {activeTab === 'users' && (
        <div className="table-responsive">
          <table className="table table-hover align-middle">
            <thead className="table-dark">
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Role</th>
                <th>Joined</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr key={u._id}>
                  <td className="fw-semibold">{u.name}</td>
                  <td>{u.email}</td>
                  <td>
                    <span className={`badge bg-${ROLE_BADGE[u.role] || 'secondary'}`}>{u.role}</span>
                  </td>
                  <td>{new Date(u.createdAt).toLocaleDateString()}</td>
                  <td>
                    {u.role !== 'admin' && (
                      <button className="btn btn-outline-danger btn-sm" onClick={() => handleDeleteUser(u._id)}>
                        Delete
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {users.length === 0 && <p className="text-center text-muted py-4">No users found.</p>}
        </div>
      )}

      {/* Courses Tab */}
      {activeTab === 'courses' && (
        <div className="table-responsive">
          <table className="table table-hover align-middle">
            <thead className="table-dark">
              <tr>
                <th>Title</th>
                <th>Category</th>
                <th>Instructor</th>
                <th>Price</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {courses.map((c) => (
                <tr key={c._id}>
                  <td className="fw-semibold">{c.title}</td>
                  <td>{c.category}</td>
                  <td>{c.instructor?.name}</td>
                  <td>{c.price === 0 ? 'Free' : `$${c.price}`}</td>
                  <td>
                    <span className={`badge ${c.isPublished ? 'bg-success' : 'bg-secondary'}`}>
                      {c.isPublished ? 'Published' : 'Draft'}
                    </span>
                  </td>
                  <td>
                    <button className="btn btn-outline-danger btn-sm" onClick={() => handleDeleteCourse(c._id)}>
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {courses.length === 0 && <p className="text-center text-muted py-4">No courses found.</p>}
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
