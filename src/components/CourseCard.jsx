import React from 'react';
import { Link } from 'react-router-dom';

const CourseCard = ({ course }) => {
  return (
    <div className="card h-100 shadow-sm border-0">
      <img
        src={course.thumbnail || 'https://via.placeholder.com/400x200?text=Course'}
        className="card-img-top"
        alt={course.title}
        style={{ height: '180px', objectFit: 'cover' }}
      />
      <div className="card-body d-flex flex-column">
        <span className="badge bg-primary mb-2" style={{ width: 'fit-content' }}>
          {course.category}
        </span>
        <h5 className="card-title fw-semibold">{course.title}</h5>
        <p className="card-text text-muted small flex-grow-1">
          {course.description?.substring(0, 100)}...
        </p>
        <div className="d-flex justify-content-between align-items-center mt-2">
          <small className="text-muted">👨‍🏫 {course.instructor?.name}</small>
          <span className="fw-bold text-success">
            {course.price === 0 ? 'Free' : `$${course.price}`}
          </span>
        </div>
        <Link to={`/courses/${course._id}`} className="btn btn-outline-primary mt-3 btn-sm">
          View Course →
        </Link>
      </div>
    </div>
  );
};

export default CourseCard;
