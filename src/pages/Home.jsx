import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import CourseCard from '../components/CourseCard';
import { getAllCourses } from '../services/api';

const Home = () => {
  const [courses, setCourses] = useState([]);

  useEffect(() => {
    getAllCourses()
      .then((res) => setCourses(res.data.slice(0, 6)))
      .catch((err) => console.error(err));
  }, []);

  return (
    <>
      {/* Hero Section */}
      <div className="text-white py-5" style={{background: '#0a0a0a'}}>
        <div className="container text-center py-5">
          <h1 className="display-4 fw-bold mb-3">Knowledge is Power Start Learning Today</h1>
          <p className="lead text-secondary mb-4">
            Learn in-demand skills and build the career you deserve..
          </p>
          <div className="d-flex justify-content-center gap-3">
           <Link to="/courses" className="btn btn-lg px-4 fw-semibold" style={{background: '#FF6B00', color: 'white', border: 'none'}}>Browse Courses</Link>
            <Link to="/register" className="btn btn-outline-light btn-lg px-4">Get Started Free</Link>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="text-white py-4" style={{background: '#FF6B00'}}>
        <div className="container">
          <div className="row text-center">
            {[
              { num: '10,000+', label: 'Students' },
              { num: '500+', label: 'Courses' },
              { num: '100+', label: 'Instructors' },
              { num: '95%', label: 'Satisfaction Rate' },
            ].map((stat, i) => (
              <div className="col-6 col-md-3 py-2" key={i}>
                <h3 className="fw-bold mb-0">{stat.num}</h3>
                <small>{stat.label}</small>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Featured Courses */}
      <div className="container py-5">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h2 className="fw-bold">Featured Courses</h2>
          <Link to="/courses" className="btn fw-semibold" style={{color: '#0a0a0a', border: '2px solid #FF6B00', background: 'transparent'}}>View All →</Link>
        </div>
        {courses.length > 0 ? (
          <div className="row row-cols-1 row-cols-md-3 g-4">
            {courses.map((course) => (
              <div className="col" key={course._id}>
                <CourseCard course={course} />
              </div>
            ))}
          </div>
        ) : (
          <p className="text-muted text-center py-4">No courses available yet. Be the first instructor to create one!</p>
        )}
      </div>

      {/* CTA Section */}
      <div className="bg-light py-5">
        <div className="container text-center">
          <h2 className="fw-bold mb-3">Are You an Instructor?</h2>
          <p className="text-muted mb-4">Share your knowledge and earn. Create courses and reach thousands of students.</p>
          <Link to="/register" className="btn btn-success btn-lg px-5">Start Teaching Today</Link>
        </div>
      </div>
    </>
  );
};

export default Home;
