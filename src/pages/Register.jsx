import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { registerUser } from '../services/api';
import { useAuth } from '../context/AuthContext';

const Register = () => {
  const [form, setForm] = useState({ name: '', email: '', password: '', role: 'student' });
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.password.length < 6) {
      return toast.error('Password must be at least 6 characters');
    }
    setLoading(true);
    try {
      const { data } = await registerUser(form);
      login(data);
      toast.success(`Welcome to LearnHub, ${data.name}!`);
      if (data.role === 'instructor') navigate('/instructor/dashboard');
      else navigate('/student/dashboard');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container py-5">
      <div className="row justify-content-center">
        <div className="col-md-5">
          <div className="card shadow border-0 p-4">
            <h3 className="fw-bold text-center mb-4">Create Account 🚀</h3>
            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label className="form-label fw-semibold">Full Name</label>
                <input
                  type="text"
                  name="name"
                  className="form-control"
                  placeholder="Enter your name"
                  value={form.name}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="mb-3">
                <label className="form-label fw-semibold">Email Address</label>
                <input
                  type="email"
                  name="email"
                  className="form-control"
                  placeholder="you@example.com"
                  value={form.email}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="mb-3">
                <label className="form-label fw-semibold">Password</label>
                <input
                  type="password"
                  name="password"
                  className="form-control"
                  placeholder="Min 6 characters"
                  value={form.password}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="mb-4">
                <label className="form-label fw-semibold">I want to join as</label>
                <select name="role" className="form-select" value={form.role} onChange={handleChange}>
                  <option value="student">Student</option>
                  <option value="instructor">Instructor</option>
                </select>
              </div>
              <button type="submit" className="btn w-100 fw-semibold" style={{background: '#FF6B00', color: 'white', border: 'none'}} disabled={loading}>
                {loading ? <span className="spinner-border spinner-border-sm me-2" /> : null}
                {loading ? 'Creating Account...' : 'Create Account'}
              </button>
            </form>
            <p className="text-center mt-3 text-muted">
              Already have an account? <Link to="/login">Login here</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
