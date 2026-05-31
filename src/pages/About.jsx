import React from 'react';

const About = () => {
  return (
    <div className="container py-5">
      <div className="row justify-content-center">
        <div className="col-md-8 text-center">
          <h1 className="fw-bold mb-4">About LearnHub 🎓</h1>
          <p className="lead text-muted mb-4">
            LearnHub is a modern Learning Management System built with the MERN stack,
            designed to connect passionate instructors with eager students worldwide.
          </p>
          <hr />
          <div className="row text-start mt-4">
            <div className="col-md-4 mb-4">
              <div className="card border-0 shadow-sm p-3 h-100">
                <h5>🎯 Our Mission</h5>
                <p className="text-muted small">To make quality education accessible to everyone, everywhere.</p>
              </div>
            </div>
            <div className="col-md-4 mb-4">
              <div className="card border-0 shadow-sm p-3 h-100">
                <h5>👨‍💻 Technology</h5>
                <p className="text-muted small">Built with React, Node.js, Express, and MongoDB — the modern MERN stack.</p>
              </div>
            </div>
            <div className="col-md-4 mb-4">
              <div className="card border-0 shadow-sm p-3 h-100">
                <h5>🔐 Secure</h5>
                <p className="text-muted small">JWT-based authentication with role-based access control for all users.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;
