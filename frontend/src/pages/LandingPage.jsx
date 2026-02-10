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
          navigate('/login');
      }
    } else {
      navigate('/login');
    }
  };

  const handleRegisterClick = () => {
    if (user) {
      handleSignInClick();
      return;
    }
    navigate('/register');
  };


  return (
    <div className="landing-page">
      <div className="landing-shell">
        <nav className="landing-nav">
          <div className="brand">LearnSphere</div>
          <div className="nav-actions">
            <button className="nav-ghost" onClick={handleSignInClick}>Sign In</button>
            <button className="nav-solid" onClick={handleRegisterClick}>Join Free</button>
          </div>
        </nav>

        <header className="hero">
          <div className="hero-left">
            <h1>Learn with structure. Finish with confidence.</h1>
            <p className="hero-lede">
              LearnSphere is built for students: clear modules, honest progress, and grading that makes
              sense. Start today and keep your semester on track.
            </p>
            <div className="hero-actions">
              <button className="cta-primary" onClick={handleRegisterClick}>Start Learning</button>
              <button className="cta-secondary" onClick={handleSignInClick}>I have an account</button>
            </div>
            <div className="hero-metrics">
              <div>
                <strong>120+</strong>
                <span>Student-ready courses</span>
              </div>
              <div>
                <strong>24/7</strong>
                <span>Access anywhere</span>
              </div>
              <div>
                <strong>90%</strong>
                <span>Completion focus</span>
              </div>
            </div>
          </div>
          <div className="hero-right">
            <div className="hero-card">
              <h3>Weekly Learning Plan</h3>
              <p>Small lessons, clear goals, and visible progress.</p>
              <div className="hero-progress">
                <span>Progress</span>
                <div className="hero-bar">
                  <div className="hero-bar-fill"></div>
                </div>
                <strong>68%</strong>
              </div>
              <div className="hero-list">
                <div>✔ Track progress once</div>
                <div>✔ Clear module flow</div>
                <div>✔ Grades you can trust</div>
              </div>
            </div>
          </div>
        </header>

        <section className="value-section">
          <div className="section-head">
            <h2>Built for student success</h2>
            <p>Everything you need to stay consistent and finish strong.</p>
          </div>
          <div className="value-grid">
            <div className="value-card">
              <h3>Structured modules</h3>
              <p>Know exactly what to study next with clear weekly steps.</p>
            </div>
            <div className="value-card">
              <h3>Progress that updates</h3>
              <p>Complete content once and watch your progress move forward.</p>
            </div>
            <div className="value-card">
              <h3>Feedback that helps</h3>
              <p>Grades and reviews that show how to improve.</p>
            </div>
          </div>
        </section>

        <section className="steps-section">
          <div className="section-head">
            <h2>Start in three steps</h2>
          </div>
          <div className="steps-grid">
            <div className="step-card">
              <span>01</span>
              <h4>Create your account</h4>
              <p>Join in seconds and personalize your path.</p>
            </div>
            <div className="step-card">
              <span>02</span>
              <h4>Choose a course</h4>
              <p>Browse or search to find the right fit.</p>
            </div>
            <div className="step-card">
              <span>03</span>
              <h4>Track your progress</h4>
              <p>Finish modules and stay on schedule.</p>
            </div>
          </div>
        </section>

        <section className="cta-section">
          <div className="cta-card">
            <h2>Ready to begin?</h2>
            <p>Join students who are studying smarter with LearnSphere.</p>
            <div className="cta-actions">
              <button className="cta-primary" onClick={handleRegisterClick}>Join Free</button>
              <button className="cta-secondary" onClick={handleSignInClick}>Sign In</button>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default LandingPage;
