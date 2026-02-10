import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import '../styles/landing.css';
import { useNavigate } from 'react-router-dom';
import publicService from '../api/publicService';
import sphereImage from './Sphere.png';

const LandingPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [topUniversities, setTopUniversities] = useState([]);
  const [topCourses, setTopCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedModal, setSelectedModal] = useState(null);

  useEffect(() => {
    fetchTopData();
  }, []);

  const fetchTopData = async () => {
    try {
      setLoading(true);
      // Fetch top 3 courses and universities from public endpoints
      const [coursesData, universitiesData] = await Promise.all([
        publicService.getTopCourses(3),
        publicService.getTopUniversities(3)
      ]);

      if (coursesData && Array.isArray(coursesData) && coursesData.length > 0) {
        setTopCourses(coursesData);
      } else {
        // Fallback placeholder data
        setTopCourses([
          { course_id: 1, course_name: 'Advanced Web Development', rating: 4.9, university_name: 'Tech University' },
          { course_id: 2, course_name: 'Data Science Fundamentals', rating: 4.8, university_name: 'Data Institute' },
          { course_id: 3, course_name: 'Cloud Computing AWS', rating: 4.7, university_name: 'Cloud Academy' }
        ]);
      }

      if (universitiesData && Array.isArray(universitiesData) && universitiesData.length > 0) {
        setTopUniversities(universitiesData);
      } else {
        // Fallback placeholder data
        setTopUniversities([
          { university_id: 1, university_name: 'Tech University', course_count: 45 },
          { university_id: 2, university_name: 'Data Institute', course_count: 38 },
          { university_id: 3, university_name: 'Cloud Academy', course_count: 32 }
        ]);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
      // Use fallback placeholder data
      setTopCourses([
        { course_id: 1, course_name: 'Advanced Web Development', rating: 4.9, university_name: 'Tech University' },
        { course_id: 2, course_name: 'Data Science Fundamentals', rating: 4.8, university_name: 'Data Institute' },
        { course_id: 3, course_name: 'Cloud Computing AWS', rating: 4.7, university_name: 'Cloud Academy' }
      ]);
      setTopUniversities([
        { university_id: 1, university_name: 'Tech University', course_count: 45 },
        { university_id: 2, university_name: 'Data Institute', course_count: 38 },
        { university_id: 3, university_name: 'Cloud Academy', course_count: 32 }
      ]);
    } finally {
      setLoading(false);
    }
  };

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
            <img src={sphereImage} alt="Learning Hub Sphere" className="sphere-image" />
          </div>
        </div>
      </section>

      {/* Top Universities Section */}
      <section className="universities-section">
        <h2 className="section-title">Top Partner Universities</h2>
        {loading ? (
          <p className="loading-text">Loading top universities...</p>
        ) : (
          <div className="universities-grid">
            {topUniversities.length > 0 ? (
              topUniversities.map((uni) => (
                <div key={uni.university_id} className="university-card">
                  <div className="university-icon">🎓</div>
                  <h4>{uni.university_name}</h4>
                  <div className="university-stat">
                    <span className="stat-badge">{uni.course_count || 0} Courses</span>
                  </div>
                  <p className="university-description">
                    Leading institution offering world-class courses and professional certifications
                  </p>
                </div>
              ))
            ) : (
              <p className="no-data">No universities available yet</p>
            )}
          </div>
        )}
      </section>

      {/* Top Courses Section */}
      <section className="top-courses-section">
        <h2 className="section-title">Top Rated Courses</h2>
        {loading ? (
          <p className="loading-text">Loading top courses...</p>
        ) : (
          <div className="courses-grid">
            {topCourses.length > 0 ? (
              topCourses.map((course) => (
                <div key={course.course_id} className="course-card">
                  <div className="course-header">
                    <div className="course-icon">📚</div>
                    <div className="rating-badge">⭐ {course.rating || 4.5}</div>
                  </div>
                  <h4>{course.course_name}</h4>
                  <p className="course-university">{course.university_name || 'LearnSphere'}</p>
                  <button onClick={handleSignInClick} className="course-btn">
                    View Course
                  </button>
                </div>
              ))
            ) : (
              <p className="no-data">No courses available yet</p>
            )}
          </div>
        )}
      </section>

      {/* Features Section */}
      <section className="features-section">
        <h2 className="section-title">Why Choose LearnSphere?</h2>
        <div className="features-grid">
          <div className="feature-card">
            <div className="feature-icon">👨‍🎓</div>
            <h3>For Students</h3>
            <p>
              Explore diverse courses from top universities, learn at your own pace, and gain valuable industry-recognized skills.
            </p>
            <p className="disclaimer-text">
              For more information, please read our <button className="terms-link" onClick={() => setSelectedModal('student')}>terms and conditions</button>
            </p>
          </div>

          <div className="feature-card">
            <div className="feature-icon">👨‍🏫</div>
            <h3>For Instructors</h3>
            <p>
              Create compelling courses, structure content with modules, collaborate with universities, and track student progress effectively.
            </p>
            <p className="disclaimer-text">
              For Contributing as Instructor, please read our <button className="terms-link" onClick={() => setSelectedModal('instructor')}>terms and conditions</button>
            </p>
          </div>

          <div className="feature-card">
            <div className="feature-icon">🏫</div>
            <h3>For Universities</h3>
            <p>
              Expand your reach globally by offering professional courses. Empower your faculty to teach internationally and build a strong digital presence in online education.
            </p>
            <p className="disclaimer-text">
              For Contributing as University, please read our <button className="terms-link" onClick={() => setSelectedModal('university')}>terms and conditions</button>
            </p>
          </div>

          <div className="feature-card">
            <div className="feature-icon">📊</div>
            <h3>For Analysts</h3>
            <p>
              Access comprehensive analytics, generate valuable reports, identify trends, and drive data-driven improvements across the platform.
            </p>
            <p className="disclaimer-text">
              For Contributing as Analyst, please read our <button className="terms-link" onClick={() => setSelectedModal('analyst')}>terms and conditions</button>
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
        <p>Join thousands of students learning on LearnSphere today</p>
        <div className="cta-buttons">
          <button onClick={handleSignInClick} className="cta-button primary">Sign In</button>
          <a href="#features" className="cta-button secondary">Learn More</a>
        </div>
      </section>

      {/* Terms & Conditions Modal - Universities */}
      {selectedModal === 'university' && (
        <div className="modal-overlay" onClick={() => setSelectedModal(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Partner with LearnSphere - For Universities</h3>
              <button className="modal-close" onClick={() => setSelectedModal(null)}>×</button>
            </div>
            <div className="modal-body">
              <h4>Terms & Conditions for University Partnership</h4>
              <p>To establish a partnership with LearnSphere and expand your institution's global reach, please follow these guidelines:</p>
              
              <div className="requirement-section">
                <h5>📧 Required Information:</h5>
                <ul>
                  <li>Official university email address</li>
                  <li>Registered university name and location</li>
                  <li>Primary contact number</li>
                  <li>Official contact person's name and designation</li>
                </ul>
              </div>

              <div className="requirement-section">
                <h5>🔍 Documentation Required:</h5>
                <ul>
                  <li>Valid proof of university registration (ISO 9001 certification or accreditation)</li>
                  <li>Official university license/registration document</li>
                  <li>Tax identification number (TIN) or equivalent</li>
                  <li>Official university seal/letterhead sample</li>
                </ul>
              </div>

              <div className="requirement-section">
                <h5>✉️ Next Steps:</h5>
                <p>Please prepare all the above information and send it to: <strong>partners@learnsphere.com</strong></p>
                <p>Include "University Partnership" in the subject line. Our team will review your application and contact you within 5-7 business days via email or phone for further discussions.</p>
              </div>

              <div className="requirement-section info-box">
                <strong>Note:</strong> We verify all institution details before approval. This helps maintain the quality and credibility of our platform.
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn-close-modal" onClick={() => setSelectedModal(null)}>Close</button>
            </div>
          </div>
        </div>
      )}

      {/* Terms & Conditions Modal - Instructors */}
      {selectedModal === 'instructor' && (
        <div className="modal-overlay" onClick={() => setSelectedModal(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Join as an Instructor - Terms & Conditions</h3>
              <button className="modal-close" onClick={() => setSelectedModal(null)}>×</button>
            </div>
            <div className="modal-body">
              <h4>How to Apply as an Instructor on LearnSphere</h4>
              <p>We're excited to have you teach on our platform. To get started, please prepare the following:</p>
              
              <div className="requirement-section">
                <h5>📧 Personal Information:</h5>
                <ul>
                  <li>Full name and professional email address</li>
                  <li>Contact phone number</li>
                  <li>Country of residence</li>
                  <li>LinkedIn profile or portfolio link (optional)</li>
                </ul>
              </div>

              <div className="requirement-section">
                <h5>🎓 Educational & Professional Credentials:</h5>
                <ul>
                  <li>Highest degree obtained with institution name and graduation year</li>
                  <li>Relevant certifications in your field of expertise</li>
                  <li>Professional resume/CV highlighting teaching and industry experience</li>
                  <li>Scanned copies of degree certificates and certifications</li>
                </ul>
              </div>

              <div className="requirement-section">
                <h5>💼 Experience & Expertise:</h5>
                <ul>
                  <li>Minimum 3 years of professional experience in your subject area</li>
                  <li>Teaching experience (in any format)</li>
                  <li>Areas of specialization and courses you'd like to teach</li>
                </ul>
              </div>

              <div className="requirement-section">
                <h5>✉️ Application Process:</h5>
                <p>Send your application to: <strong>instructors@learnsphere.com</strong></p>
                <p>Include "Instructor Application" in the subject line with your name and subject area. Attach: Resume, Degree Certificates, and Professional Photo. Our team will review your profile and respond within 3-5 business days.</p>
              </div>

              <div className="requirement-section info-box">
                <strong>Approval typically includes:</strong> Quick interview call, course preview approval, and onboarding to our platform.
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn-close-modal" onClick={() => setSelectedModal(null)}>Close</button>
            </div>
          </div>
        </div>
      )}

      {/* Terms & Conditions Modal - Analysts */}
      {selectedModal === 'analyst' && (
        <div className="modal-overlay" onClick={() => setSelectedModal(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Join as an Analyst - Terms & Conditions</h3>
              <button className="modal-close" onClick={() => setSelectedModal(null)}>×</button>
            </div>
            <div className="modal-body">
              <h4>How to Apply as an Analyst on LearnSphere</h4>
              <p>LearnSphere is looking for data-driven professionals to join our analytics team. Here's what we need from you:</p>
              
              <div className="requirement-section">
                <h5>📧 Personal Details:</h5>
                <ul>
                  <li>Full name and professional email address</li>
                  <li>Professional phone number</li>
                  <li>Country of residence</li>
                  <li>GitHub/Portfolio profile (to showcase your work)</li>
                </ul>
              </div>

              <div className="requirement-section">
                <h5>📊 Skills & Expertise Required:</h5>
                <ul>
                  <li>Minimum 2+ years of analytics experience (education, business, data analytics, or related field)</li>
                  <li>Proficiency in analytics tools: Power BI, Tableau, Google Analytics, or similar</li>
                  <li>Programming knowledge: Python, SQL, or R (at least one)</li>
                  <li>Statistical analysis and data visualization expertise</li>
                </ul>
              </div>

              <div className="requirement-section">
                <h5>🔍 Documentation:</h5>
                <ul>
                  <li>Resume/CV with detailed analytics project experience</li>
                  <li>Degree certificates (Bachelor's minimum in Statistics, Data Science, Computer Science, or related field)</li>
                  <li>Professional certifications: Google Analytics, Tableau Public, Microsoft Certified Associate (preferred)</li>
                  <li>Portfolio: Link to 2-3 past analytics projects or case studies</li>
                  <li>Reference letters from previous employers or academic advisors</li>
                </ul>
              </div>

              <div className="requirement-section">
                <h5>✉️ Application Process:</h5>
                <p>Send your complete application to: <strong>careers@learnsphere.com</strong></p>
                <p>Subject: "Analytics Professional Application - [Your Name]"</p>
                <p>Include your resume, certifications, portfolio links, and a brief cover letter explaining why you'd like to join LearnSphere.</p>
              </div>

              <div className="requirement-section info-box">
                <strong>Next Steps:</strong> We'll review your profile, conduct a technical assessment if needed, and invite you for an interview within 5-7 days.
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn-close-modal" onClick={() => setSelectedModal(null)}>Close</button>
            </div>
          </div>
        </div>
      )}

      {/* Terms & Conditions Modal - Students */}
      {selectedModal === 'student' && (
        <div className="modal-overlay" onClick={() => setSelectedModal(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>LearnSphere - Student Terms & Conditions</h3>
              <button className="modal-close" onClick={() => setSelectedModal(null)}>×</button>
            </div>
            <div className="modal-body">
              <h4>Guidelines for Students</h4>
              <p>Welcome to LearnSphere! As a student, here are some key guidelines:</p>
              
              <div className="requirement-section">
                <h5>✅ What You Get:</h5>
                <ul>
                  <li>Access to hundreds of courses from top universities and experts</li>
                  <li>Self-paced learning with flexible schedules</li>
                  <li>Industry-recognized certificates upon completion</li>
                  <li>Lifetime access to course materials</li>
                  <li>Community support and peer learning</li>
                </ul>
              </div>

              <div className="requirement-section">
                <h5>📝 Requirements:</h5>
                <ul>
                  <li>Valid email address for registration</li>
                  <li>Engagement with course materials and assignments</li>
                  <li>Respect for academic integrity and honor codes</li>
                  <li>Adherence to community guidelines and classroom conduct</li>
                </ul>
              </div>

              <div className="requirement-section">
                <h5>🎓 Certification:</h5>
                <ul>
                  <li>Complete all course modules and assignments</li>
                  <li>Score minimum 70% on final assessment</li>
                  <li>Earn verified certificate upon successful completion</li>
                  <li>Share certifications on professional profiles</li>
                </ul>
              </div>

              <div className="requirement-section info-box">
                <strong>Support:</strong> Contact our support team at support@learnsphere.com for any questions or issues.
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn-close-modal" onClick={() => setSelectedModal(null)}>Close</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LandingPage;
