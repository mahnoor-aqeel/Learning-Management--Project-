import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { getInstructorCourses, createCourse, deleteCourse, addLesson, updateCourse } from '../services/api';
import { useAuth } from '../context/AuthContext';

const CATEGORIES = ['Programming', 'Design', 'Business', 'Marketing', 'Data Science', 'Other'];

const InstructorDashboard = () => {
  const { user } = useAuth();
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ title: '', description: '', category: 'Programming', price: 0, thumbnail: '', isPublished: false });
  const [lessonForm, setLessonForm] = useState({ title: '', content: '', duration: '' });
  const [addingLessonTo, setAddingLessonTo] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const fetchCourses = () => {
    getInstructorCourses()
      .then((res) => setCourses(res.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchCourses(); }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await createCourse(form);
      toast.success('Course created successfully!');
      setShowForm(false);
      setForm({ title: '', description: '', category: 'Programming', price: 0, thumbnail: '', isPublished: false });
      fetchCourses();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to create course');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this course?')) return;
    try {
      await deleteCourse(id);
      toast.success('Course deleted');
      fetchCourses();
    } catch (err) {
      toast.error('Failed to delete course');
    }
  };

  const handleTogglePublish = async (course) => {
    try {
      await updateCourse(course._id, { isPublished: !course.isPublished });
      toast.success(`Course ${!course.isPublished ? 'published' : 'unpublished'}!`);
      fetchCourses();
    } catch (err) {
      toast.error('Failed to update course');
    }
  };

  const handleAddLesson = async (e) => {
    e.preventDefault();
    try {
      await addLesson(addingLessonTo, lessonForm);
      toast.success('Lesson added!');
      setAddingLessonTo(null);
      setLessonForm({ title: '', content: '', duration: '' });
      fetchCourses();
    } catch (err) {
      toast.error('Failed to add lesson');
    }
  };

  return (
    <div className="container py-5">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2 className="fw-bold">Instructor Dashboard 👨‍🏫</h2>
          <p className="text-muted">Welcome, {user?.name}!</p>
        </div>
        <button className="btn btn-primary" onClick={() => setShowForm(!showForm)}>
          {showForm ? '✕ Cancel' : '+ Create Course'}
        </button>
      </div>

      {/* Stats */}
      <div className="row mb-4 g-3">
        <div className="col-md-4">
          <div className="card border-0 shadow-sm p-4 text-center bg-primary text-white">
            <h2 className="fw-bold">{courses.length}</h2>
            <p className="mb-0">Total Courses</p>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card border-0 shadow-sm p-4 text-center bg-success text-white">
            <h2 className="fw-bold">{courses.filter((c) => c.isPublished).length}</h2>
            <p className="mb-0">Published</p>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card border-0 shadow-sm p-4 text-center bg-secondary text-white">
            <h2 className="fw-bold">{courses.reduce((acc, c) => acc + (c.lessons?.length || 0), 0)}</h2>
            <p className="mb-0">Total Lessons</p>
          </div>
        </div>
      </div>

      {/* Create Course Form */}
      {showForm && (
        <div className="card border-0 shadow-sm p-4 mb-4">
          <h5 className="fw-bold mb-3">Create New Course</h5>
          <form onSubmit={handleSubmit}>
            <div className="row g-3">
              <div className="col-md-6">
                <label className="form-label">Course Title*</label>
                <input className="form-control" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} required />
              </div>
              <div className="col-md-3">
                <label className="form-label">Category*</label>
                <select className="form-select" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })}>
                  {CATEGORIES.map((c) => <option key={c}>{c}</option>)}
                </select>
              </div>
              <div className="col-md-3">
                <label className="form-label">Price ($)</label>
                <input type="number" className="form-control" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} min="0" />
              </div>
              <div className="col-12">
                <label className="form-label">Description*</label>
                <textarea className="form-control" rows="3" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} required />
              </div>
              <div className="col-12">
                <label className="form-label">Thumbnail URL</label>
                <input className="form-control" placeholder="https://..." value={form.thumbnail} onChange={(e) => setForm({ ...form, thumbnail: e.target.value })} />
              </div>
              <div className="col-12">
                <div className="form-check">
                  <input type="checkbox" className="form-check-input" checked={form.isPublished} onChange={(e) => setForm({ ...form, isPublished: e.target.checked })} />
                  <label className="form-check-label">Publish immediately</label>
                </div>
              </div>
            </div>
            <button type="submit" className="btn btn-success mt-3" disabled={submitting}>
              {submitting ? 'Creating...' : 'Create Course'}
            </button>
          </form>
        </div>
      )}

      {/* Courses List */}
      <h4 className="fw-bold mb-3">My Courses</h4>
      {loading ? (
        <div className="text-center py-4"><div className="spinner-border" /></div>
      ) : courses.length > 0 ? (
        courses.map((course) => (
          <div key={course._id} className="card border-0 shadow-sm mb-3">
            <div className="card-body">
              <div className="d-flex justify-content-between align-items-start">
                <div>
                  <h5 className="fw-bold">{course.title}</h5>
                  <p className="text-muted small mb-1">{course.category} • {course.lessons?.length || 0} lessons • {course.price === 0 ? 'Free' : `$${course.price}`}</p>
                  <span className={`badge ${course.isPublished ? 'bg-success' : 'bg-secondary'}`}>
                    {course.isPublished ? 'Published' : 'Draft'}
                  </span>
                </div>
                <div className="d-flex gap-2 flex-wrap">
                  <button className="btn btn-outline-primary btn-sm" onClick={() => setAddingLessonTo(course._id)}>+ Lesson</button>
                  <button className="btn btn-outline-warning btn-sm" onClick={() => handleTogglePublish(course)}>
                    {course.isPublished ? 'Unpublish' : 'Publish'}
                  </button>
                  <button className="btn btn-outline-danger btn-sm" onClick={() => handleDelete(course._id)}>Delete</button>
                </div>
              </div>

              {/* Add Lesson Form */}
              {addingLessonTo === course._id && (
                <form onSubmit={handleAddLesson} className="mt-3 p-3 bg-light rounded">
                  <h6 className="fw-semibold">Add Lesson</h6>
                  <div className="row g-2">
                    <div className="col-md-6">
                      <input className="form-control form-control-sm" placeholder="Lesson Title*" value={lessonForm.title} onChange={(e) => setLessonForm({ ...lessonForm, title: e.target.value })} required />
                    </div>
                    <div className="col-md-3">
                      <input className="form-control form-control-sm" placeholder="Duration (e.g. 15 min)" value={lessonForm.duration} onChange={(e) => setLessonForm({ ...lessonForm, duration: e.target.value })} />
                    </div>
                    <div className="col-md-3 d-flex gap-2">
                      <button type="submit" className="btn btn-success btn-sm">Add</button>
                      <button type="button" className="btn btn-outline-secondary btn-sm" onClick={() => setAddingLessonTo(null)}>Cancel</button>
                    </div>
                    <div className="col-12">
                      <textarea className="form-control form-control-sm" rows="2" placeholder="Lesson content..." value={lessonForm.content} onChange={(e) => setLessonForm({ ...lessonForm, content: e.target.value })} />
                    </div>
                  </div>
                </form>
              )}
            </div>
          </div>
        ))
      ) : (
        <div className="text-center py-5 bg-light rounded">
          <h5 className="text-muted">No courses yet. Create your first course!</h5>
        </div>
      )}
    </div>
  );
};

export default InstructorDashboard;
