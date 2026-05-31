import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { getCourseById, enrollInCourse } from '../services/api';
import { useAuth } from '../context/AuthContext';

const CourseDetail = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [enrolling, setEnrolling] = useState(false);

  useEffect(() => {
    getCourseById(id)
      .then((res) => setCourse(res.data))
      .catch(() => toast.error('Course not found'))
      .finally(() => setLoading(false));
  }, [id]);

  const handleEnroll = async () => {
    if (!user) return navigate('/login');
    setEnrolling(true);
    try {
      await enrollInCourse(id);
      toast.success('Enrolled successfully! 🎉');
      navigate('/student/dashboard');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Enrollment failed');
    } finally {
      setEnrolling(false);
    }
  };

  if (loading) return <div className="text-center mt-5"><div className="spinner-border" /></div>;
  if (!course) return <div className="text-center mt-5"><h4>Course not found</h4></div>;

  return (
    <div className="container py-5">
      <div className="row">
        <div className="col-md-8">
          <span className="badge bg-primary mb-2">{course.category}</span>
          <h2 className="fw-bold mb-2">{course.title}</h2>
          <p className="text-muted mb-3">
            👨‍🏫 Instructor: <strong>{course.instructor?.name}</strong>
          </p>
          <p className="lead">{course.description}</p>

          {/* Lessons */}
          {course.lessons?.length > 0 && (
            <div className="mt-4">
              <h5 className="fw-bold mb-3">📋 Course Content ({course.lessons.length} lessons)</h5>
              <div className="list-group">
                {course.lessons.map((lesson, i) => (
                  <div key={i} className="list-group-item d-flex justify-content-between align-items-center">
                    <span>📄 {lesson.title}</span>
                    {lesson.duration && <small className="text-muted">{lesson.duration}</small>}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Enrollment Card */}
        <div className="col-md-4">
          <div className="card shadow border-0 p-4 sticky-top" style={{ top: '20px' }}>
            <img
              src={course.thumbnail || 'https://via.placeholder.com/400x200?text=Course'}
              alt={course.title}
              className="img-fluid rounded mb-3"
            />
            <h4 className="fw-bold text-success mb-3">
              {course.price === 0 ? '🆓 Free' : `💰 $${course.price}`}
            </h4>
            {user?.role === 'student' ? (
              <button className="btn btn-primary btn-lg w-100 fw-semibold"style={{background: '#FF6B00', color: 'white', border: 'none'}} onClick={handleEnroll} onClick={handleEnroll} disabled={enrolling}>
                {enrolling ? 'Enrolling...' : 'Enroll Now'}
              </button>
            ) : !user ? (
              <button className="btn btn-primary btn-lg w-100" onClick={() => navigate('/login')}>
                Login to Enroll
              </button>
            ) : (
              <p className="text-muted text-center">Only students can enroll.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseDetail;
