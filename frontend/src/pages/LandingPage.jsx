import React from 'react';
import { useAuth } from '../context/AuthContext';
import '../styles/landing.css';
import { useNavigate } from 'react-router-dom';

const LandingPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleSignInClick = () => {
  if (user) {
    switch (user.role) {
      case 'Student':
        navigate('/student/dashboard');
        break;
      case 'Instructor':
        navigate('/instructor/dashboard');
        break;
      case 'Admin':
        navigate('/admin/dashboard');
        break;
      case 'Analyst':
        navigate('/analyst/dashboard');
        break;
      default:
        navigate('/login'); // Fallback for unknown roles
    }
  } else {
    navigate('/login');
  }
};


  return (
    <div className="landing-container">
      {/* Navbar */}
      <nav className="landing-navbar">
        <div className="navbar-brand">LearnSphere</div>
          <button onClick={handleSignInClick} className="btn primary">Sign In</button>
      </nav>

      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-content">
          <h1 className="hero-title">Welcome to LearnSphere</h1>
          <p className="hero-subtitle">
            Transform Education Through Innovative Online Learning
          </p>
          <p className="hero-description">
            Connect with expert instructors, access comprehensive courses, and achieve your learning goals
            in a flexible, supportive environment.
          </p>
          <button onClick={handleSignInClick} className="cta-button">Get Started Now</button>
        </div>
        <div className="hero-image">
          <div className="placeholder-image">
            <span>📚 Learning Hub</span>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features-section">
        <h2 className="section-title">Why Choose LearnSphere?</h2>
        <div className="features-grid">
          <div className="feature-card">
            <div className="feature-icon">👨‍🎓</div>
            <h3>For Students</h3>
            <p>
              Explore diverse courses, learn at your own pace, and gain valuable skills.
            </p>
          </div>

          <div className="feature-card">
            <div className="feature-icon">👨‍🏫</div>
            <h3>For Instructors</h3>
            <p>
              Create courses, structure content with modules, and track student outcomes.
            </p>
          </div>

          <div className="feature-card">
            <div className="feature-icon">👨‍💼</div>
            <h3>For Admins</h3>
            <p>
              Manage users, oversee courses, and ensure smooth platform operations.
            </p>
          </div>

          <div className="feature-card">
            <div className="feature-icon">📊</div>
            <h3>For Analysts</h3>
            <p>
              Access detailed analytics, generate reports, and drive improvements.
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
        <p>Join thousands of students already learning on LearnSphere</p>
        <div className="cta-buttons">
          <button onClick={handleSignInClick} className="cta-button primary">Sign In</button>
          <a href="#contact" className="cta-button secondary">Learn More</a>
        </div>
      </section>

    </div>
  );
};

export default LandingPage;
