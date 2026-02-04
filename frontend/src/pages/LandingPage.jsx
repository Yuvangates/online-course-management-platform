import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/landing.css';

const LandingPage = () => {
  return (
    <div className="landing-container">
      {/* Navbar */}
      <nav className="landing-navbar">
        <div className="navbar-brand">EduPlatform</div>
        <Link to="/login" className="nav-login-btn">Sign In</Link>
      </nav>

      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-content">
          <h1 className="hero-title">Welcome to EduPlatform</h1>
          <p className="hero-subtitle">
            Transform Education Through Innovative Online Learning
          </p>
          <p className="hero-description">
            Connect with expert instructors, access comprehensive courses, and achieve your learning goals
            in a flexible, supportive environment.
          </p>
          <Link to="/login" className="cta-button">Get Started Now</Link>
        </div>
        <div className="hero-image">
          <div className="placeholder-image">
            <span>📚 Learning Hub</span>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features-section">
        <h2 className="section-title">Why Choose EduPlatform?</h2>
        <div className="features-grid">
          <div className="feature-card">
            <div className="feature-icon">👨‍🎓</div>
            <h3>For Students</h3>
            <p>
              Explore diverse courses, learn at your own pace, track your progress, and gain valuable
              skills from industry experts.
            </p>
          </div>

          <div className="feature-card">
            <div className="feature-icon">👨‍🏫</div>
            <h3>For Instructors</h3>
            <p>
              Create and manage courses, structure content into modules, engage students, and track
              learning outcomes effectively.
            </p>
          </div>

          <div className="feature-card">
            <div className="feature-icon">👨‍💼</div>
            <h3>For Admins</h3>
            <p>
              Manage users, oversee courses, maintain platform integrity, and ensure smooth operations
              across all universities.
            </p>
          </div>

          <div className="feature-card">
            <div className="feature-icon">📊</div>
            <h3>For Analysts</h3>
            <p>
              Access detailed analytics, generate reports, track performance metrics, and make
              data-driven platform improvements.
            </p>
          </div>
        </div>
      </section>

      {/* Statistics Section */}
      <section className="stats-section">
        <div className="stats-container">
          <div className="stat-item">
            <h3 className="stat-number">5000+</h3>
            <p className="stat-label">Active Students</p>
          </div>
          <div className="stat-item">
            <h3 className="stat-number">500+</h3>
            <p className="stat-label">Expert Courses</p>
          </div>
          <div className="stat-item">
            <h3 className="stat-number">50+</h3>
            <p className="stat-label">Partner Universities</p>
          </div>
          <div className="stat-item">
            <h3 className="stat-number">95%</h3>
            <p className="stat-label">Completion Rate</p>
          </div>
        </div>
      </section>

      {/* Course Categories */}
      <section className="categories-section">
        <h2 className="section-title">Popular Course Categories</h2>
        <div className="categories-grid">
          <div className="category-card">
            <div className="category-icon">💻</div>
            <h4>Technology</h4>
            <p>Web Development, AI, Cloud Computing</p>
          </div>
          <div className="category-card">
            <div className="category-icon">📊</div>
            <h4>Data Science</h4>
            <p>Machine Learning, Analytics, Big Data</p>
          </div>
          <div className="category-card">
            <div className="category-icon">🎨</div>
            <h4>Design</h4>
            <p>UI/UX, Graphics, Animation</p>
          </div>
          <div className="category-card">
            <div className="category-icon">📈</div>
            <h4>Business</h4>
            <p>Management, Marketing, Finance</p>
          </div>
        </div>
      </section>

      {/* Call to Action Section */}
      <section className="cta-section">
        <h2>Ready to Begin Your Learning Journey?</h2>
        <p>Join thousands of students already learning on EduPlatform</p>
        <div className="cta-buttons">
          <Link to="/login" className="cta-button primary">Sign In</Link>
          <a href="#contact" className="cta-button secondary">Learn More</a>
        </div>
      </section>

      {/* Footer */}
      <footer className="landing-footer">
        <div className="footer-content">
          <div className="footer-section">
            <h4>EduPlatform</h4>
            <p>Transforming online education globally</p>
          </div>
          <div className="footer-section">
            <h4>Quick Links</h4>
            <ul>
              <li><a href="#about">About Us</a></li>
              <li><a href="#courses">Courses</a></li>
              <li><a href="#contact">Contact</a></li>
            </ul>
          </div>
          <div className="footer-section">
            <h4>Legal</h4>
            <ul>
              <li><a href="#privacy">Privacy Policy</a></li>
              <li><a href="#terms">Terms of Service</a></li>
            </ul>
          </div>
        </div>
        <div className="footer-bottom">
          <p>&copy; 2024 EduPlatform. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
