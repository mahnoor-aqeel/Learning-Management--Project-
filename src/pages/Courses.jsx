import React, { useEffect, useState } from 'react';
import CourseCard from '../components/CourseCard';
import { getAllCourses } from '../services/api';

const CATEGORIES = ['All', 'Programming', 'Design', 'Business', 'Marketing', 'Data Science', 'Other'];

const Courses = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');

  const fetchCourses = async () => {
    setLoading(true);
    try {
      const params = {};
      if (search) params.search = search;
      if (category !== 'All') params.category = category;
      const { data } = await getAllCourses(params);
      setCourses(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchCourses(); }, [category]);

  const handleSearch = (e) => {
    e.preventDefault();
    fetchCourses();
  };

  return (
    <div className="container py-5">
      <h2 className="fw-bold mb-4">Explore Courses 📚</h2>

      {/* Search & Filter */}
      <div className="row mb-4 g-3">
        <div className="col-md-6">
          <form onSubmit={handleSearch} className="d-flex gap-2">
            <input
              type="text"
              className="form-control"
              placeholder="Search courses..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <button type="submit" className="btn btn-primary px-4">Search</button>
          </form>
        </div>
        <div className="col-md-6">
          <div className="d-flex flex-wrap gap-2">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                className={`btn btn-sm ${category === cat ? 'btn-dark' : 'btn-outline-secondary'}`}
                onClick={() => setCategory(cat)}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Results */}
      {loading ? (
        <div className="text-center py-5">
          <div className="spinner-border text-primary" />
        </div>
      ) : courses.length > 0 ? (
        <>
          <p className="text-muted mb-3">{courses.length} course(s) found</p>
          <div className="row row-cols-1 row-cols-md-3 g-4">
            {courses.map((course) => (
              <div className="col" key={course._id}>
                <CourseCard course={course} />
              </div>
            ))}
          </div>
        </>
      ) : (
        <div className="text-center py-5">
          <h4 className="text-muted">No courses found 😕</h4>
          <p className="text-muted">Try a different search or category.</p>
        </div>
      )}
    </div>
  );
};

export default Courses;
