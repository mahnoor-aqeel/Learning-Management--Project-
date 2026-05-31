import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getMyCourses } from '../services/api';
import { useAuth } from '../context/AuthContext';

const StudentDashboard = () => {
  const { user } = useAuth();
  const [enrollments, setEnrollments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getMyCourses()
      .then((res) => setEnrollments(res.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="container py-5">
      <div className="row mb-4">
        <div className="col">
          <h2 className="fw-bold">Student Dashboard 🎓</h2>
          <p className="text-muted">Welcome back, {user?.name}!</p>
        </div>
        <div className="col-auto">
          <Link to="/courses" className="btn btn-primary">Browse More Courses</Link>
        </div>
      </div>

      {/* Stats */}
      <div className="row mb-4 g-3">
        <div className="col-md-4">
          <div className="card border-0 shadow-sm p-4 text-center bg-primary text-white">
            <h2 className="fw-bold">{enrollments.length}</h2>
            <p className="mb-0">Enrolled Courses</p>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card border-0 shadow-sm p-4 text-center bg-success text-white">
            <h2 className="fw-bold">
              {enrollments.filter((e) => e.progress === 100).length}
            </h2>
            <p className="mb-0">Completed</p>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card border-0 shadow-sm p-4 text-center bg-warning text-white">
            <h2 className="fw-bold">
              {enrollments.filter((e) => e.progress > 0 && e.progress < 100).length}
            </h2>
            <p className="mb-0">In Progress</p>
          </div>
        </div>
      </div>

      {/* My Courses */}
      <h4 className="fw-bold mb-3">My Courses</h4>
      {loading ? (
        <div className="text-center py-4"><div className="spinner-border" /></div>
      ) : enrollments.length > 0 ? (
        <div className="row g-3">
          {enrollments.map((enrollment) => (
            <div className="col-md-4" key={enrollment._id}>
              <div className="card border-0 shadow-sm h-100">
                <div className="card-body">
                  <span className="badge bg-primary mb-2">{enrollment.course?.category}</span>
                  <h5 className="fw-semibold">{enrollment.course?.title}</h5>
                  <p className="text-muted small">👨‍🏫 {enrollment.course?.instructor?.name}</p>
                  <div className="mt-2">
                    <div className="d-flex justify-content-between mb-1">
                      <small>Progress</small>
                      <small>{enrollment.progress}%</small>
                    </div>
                    <div className="progress" style={{ height: '8px' }}>
                      <div
                        className="progress-bar bg-success"
                        style={{ width: `${enrollment.progress}%` }}
                      />
                    </div>
                  </div>
                  <Link
                    to={`/courses/${enrollment.course?._id}`}
                    className="btn btn-outline-primary btn-sm w-100 mt-3"
                  >
                    Continue Learning →
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-5 bg-light rounded">
          <h5 className="text-muted">You haven't enrolled in any courses yet.</h5>
          <Link to="/courses" className="btn btn-primary mt-2">Explore Courses</Link>
        </div>
      )}

      {/* Profile Section */}
      <div className="card border-0 shadow-sm mt-5 p-4">
        <h5 className="fw-bold mb-3">👤 My Profile</h5>
        <div className="row">
          <div className="col-md-6">
            <p><strong>Name:</strong> {user?.name}</p>
            <p><strong>Email:</strong> {user?.email}</p>
            <p><strong>Role:</strong> <span className="badge bg-info">{user?.role}</span></p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentDashboard;
