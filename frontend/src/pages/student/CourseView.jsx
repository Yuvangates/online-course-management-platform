import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import Navbar from '../../components/Sidebar';
import courseService from '../../api/courseService';
import '../../styles/student/course-view.css';

export const CourseView = () => {
    const { id } = useParams();
    const courseId = parseInt(id, 10);
    const [course, setCourse] = useState(null);
    const [modules, setModules] = useState([]);
    const [instructors, setInstructors] = useState([]);
    const [moduleContents, setModuleContents] = useState({});
    const [moduleDetails, setModuleDetails] = useState({});
    const [expandedModules, setExpandedModules] = useState({});
    const [enrolledIds, setEnrolledIds] = useState([]);
    const [loading, setLoading] = useState(true);
    const [loadingContent, setLoadingContent] = useState({});
    const [error, setError] = useState('');
    const [enrolling, setEnrolling] = useState(false);
    const [universities, setUniversities] = useState([]);
    const [ratingData, setRatingData] = useState(null);
    const [reviews, setReviews] = useState([]);
    const [studentProgress, setStudentProgress] = useState(0);
    const [completedContent, setCompletedContent] = useState([]);
    const [showReviewForm, setShowReviewForm] = useState(false);
    const [reviewText, setReviewText] = useState('');
    const [reviewRating, setReviewRating] = useState(5);
    const [hasExistingReview, setHasExistingReview] = useState(false);
    const [showPaymentModal, setShowPaymentModal] = useState(false);

    const isEnrolled = enrolledIds.includes(courseId);
    const isProgressComplete = studentProgress >= 100;
    const textbook = course?.textbook || course?.textbook_title || course?.textbook_name || course?.TextBook || '';
    const textbookAuthor = course?.textbook_author || course?.textbookAuthor || '';
    const textbookIsbn = course?.textbook_isbn || course?.textbookIsbn || '';
    const studentCount = course?.student_count || course?.studentCount || course?.enrolled_count || course?.enrollment_count || 0;

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                // Refactored to use a single, more efficient endpoint for all course details
                const [detailsRes, enrolledRes] = await Promise.all([
                    courseService.getCourseDetails(courseId),
                    courseService.getEnrolledCourses()
                ]);
                setCourse(detailsRes.course);
                setModules(detailsRes.modules || []);
                setInstructors(detailsRes.instructors || []);
                const enrolledIds = (enrolledRes.enrollments || []).map(e => Number(e.course_id));
                setEnrolledIds(enrolledIds);

                // Fetch universities and rating
                const [univRes, ratingRes, reviewsRes] = await Promise.all([
                    courseService.getCourseUniversities(courseId),
                    courseService.getCourseRating(courseId),
                    courseService.getCourseReviews(courseId)
                ]);

                setUniversities(univRes.universities || []);
                setRatingData(ratingRes);
                const reviewsList = reviewsRes.reviews || [];
                setReviews(reviewsList);

                // Check if current student has already reviewed by checking their enrollment record
                const studentEnrollment = enrolledRes.enrollments?.find(e => Number(e.course_id) === courseId);
                const hasReview = studentEnrollment?.Review ? true : false;
                setHasExistingReview(hasReview);

                // If enrolled, fetch progress and module details
                if (enrolledIds.includes(courseId)) {
                    const progressRes = await courseService.getStudentProgress(courseId);
                    setStudentProgress(progressRes.progress || 0);
                    setCompletedContent(progressRes.completedContent || []);
                }

                // Fetch module details (duration, etc.)
                if (detailsRes.modules && detailsRes.modules.length > 0) {
                    const moduleDeets = {};
                    detailsRes.modules.forEach(mod => {
                        moduleDeets[mod.module_number] = mod;
                    });
                    setModuleDetails(moduleDeets);
                }
            } catch (err) {
                console.error('Error loading course:', err);
                setError('Failed to load course details');
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [courseId]);

    const handleEnroll = async () => {
        if (!course) return;
        setShowPaymentModal(true);
    };

    const confirmPayment = async () => {
        try {
            setEnrolling(true);
            await courseService.enrollCourse(course.course_id);
            setEnrolledIds([...enrolledIds, Number(course.course_id)]);
            setShowPaymentModal(false);
            // Reset progress after enrollment
            setStudentProgress(0);
            setCompletedContent([]);
        } catch (err) {
            console.error('Enrollment error:', err);
            setError('Failed to enroll in course');
            setShowPaymentModal(false);
        } finally {
            setEnrolling(false);
        }
    };

    const toggleModule = async (moduleNumber) => {
        setExpandedModules(prev => ({
            ...prev,
            [moduleNumber]: !prev[moduleNumber]
        }));

        // Load content if not already loaded
        if (!moduleContents[moduleNumber] && !loadingContent[moduleNumber]) {
            try {
                setLoadingContent(prev => ({
                    ...prev,
                    [moduleNumber]: true
                }));
                const contentRes = await courseService.getModuleContent(courseId, moduleNumber);
                console.debug('Module content API response for', courseId, moduleNumber, contentRes);
                const content = (contentRes && contentRes.content) || (Array.isArray(contentRes) ? contentRes : []);
                setModuleContents(prev => ({
                    ...prev,
                    [moduleNumber]: content
                }));
            } catch (err) {
                console.error('Error loading module content:', err);
                if (err.response) {
                    console.error('Response data:', err.response.data);
                    setError(err.response.data?.error || 'Failed to load module content');
                } else {
                    setError(err.message || 'Failed to load module content');
                }
                setModuleContents(prev => ({
                    ...prev,
                    [moduleNumber]: []
                }));
            } finally {
                setLoadingContent(prev => ({
                    ...prev,
                    [moduleNumber]: false
                }));
            }
        }
    };

    const handleMarkComplete = async (moduleNumber, contentId) => {
        if (isContentCompleted(moduleNumber, contentId)) return;
        try {
            await courseService.markContentComplete(courseId, moduleNumber, contentId);
            const progressRes = await courseService.getStudentProgress(courseId);
            setStudentProgress(progressRes.progress || 0);
            setCompletedContent(progressRes.completedContent || []);
        } catch (err) {
            console.error('Error marking content complete:', err);
        }
    };

    const isContentCompleted = (moduleNumber, contentId) => {
        if (!completedContent || !Array.isArray(completedContent)) return false;
        return completedContent.some(c => c.module_number === moduleNumber && c.content_id === contentId);
    };

    if (loading) return (
        <>
            <Navbar role="Student" />
            <div className="student-container">
                <div className="loading">
                    <div className="spinner"></div>
                    <p>Loading course details...</p>
                </div>
            </div>
        </>
    );

    if (!course) return (
        <>
            <Navbar role="Student" />
            <div className="student-container">
                <div className="course-not-found">
                    <h2>Course Not Found</h2>
                    <p>This course is no longer available.</p>
                    <Link to="/student/search" className="btn primary">Back to Search</Link>
                </div>
            </div>
        </>
    );

    return (
        <>
            <Navbar role="Student" />
            <div className="student-container">
                {/* COURSE TITLE CARD */}
                <div className="course-title-card">
                    <div
                        className="course-header"
                        style={course.image_url ? { backgroundImage: `url(${course.image_url})` } : {}}
                    >
                        <div className="course-header-content">
                            {universities.length > 0 && (
                                <div className="university-name">
                                    <span>🏛️</span> {universities[0].name}
                                </div>
                            )}
                            <h1>{course.name}</h1>
                            <div className="course-meta-row">
                                <span className="course-meta-item">⏱ {course.duration} weeks</span>
                                {modules.length > 0 && (
                                    <span className="course-meta-item">📚 {modules.length} modules</span>
                                )}
                                {ratingData && ratingData.average_rating && (
                                    <span className="course-meta-item">
                                        ⭐ {parseFloat(ratingData.average_rating).toFixed(1)} ({ratingData.total_ratings})
                                    </span>
                                )}
                            </div>
                            {instructors.length > 0 && (
                                <p className="course-instructor">
                                    Instructor(s): {instructors.map(i => i.name).join(', ')}
                                </p>
                            )}
                            {isEnrolled && textbook && (
                                <div className="course-textbook">
                                    <strong>Textbook:</strong> {textbook}
                                    {textbookAuthor ? ` by ${textbookAuthor}` : ''}
                                    {textbookIsbn ? ` (ISBN: ${textbookIsbn})` : ''}
                                </div>
                            )}
                        </div>
                        {!isEnrolled && (
                            <div className="course-header-fee">
                                <span className="fee-label">Course fee</span>
                                <span className="fee-value">₹{course.Fees || course.fees || 'Free'}</span>
                                <span className="fee-subtext">One-time enrollment</span>
                            </div>
                        )}
                    </div>
                    <div className="course-about-card">
                        <h3>About This Course</h3>
                        <p>{course.description}</p>
                    </div>
                </div>

                {/* COURSE ACTIONS */}
                {!isEnrolled && (
                    <div className="course-actions">
                        <Link to="/student/search" className="btn outline">Back to Courses</Link>
                        <button
                            className="btn primary"
                            onClick={handleEnroll}
                            disabled={enrolling}
                        >
                            {enrolling ? 'Processing...' : 'Enroll in This Course'}
                        </button>
                    </div>
                )}

                {/* PAYMENT MODAL */}
                {showPaymentModal && (
                    <div className="payment-modal-overlay">
                        <div className="payment-modal">
                            <button className="modal-close-btn" onClick={() => setShowPaymentModal(false)}>✕</button>
                            <h2>Complete Your Enrollment</h2>
                            <div className="payment-course-details">
                                <h3>{course.name}</h3>
                                <p>{course.description}</p>
                                <div className="payment-details-grid">
                                    <div className="detail-row">
                                        <span className="label">Duration:</span>
                                        <span className="value">{course.duration} weeks</span>
                                    </div>
                                    {instructors.length > 0 && (
                                        <div className="detail-row">
                                            <span className="label">Instructor(s):</span>
                                            <span className="value">{instructors.map(i => i.name).join(', ')}</span>
                                        </div>
                                    )}
                                    {universities.length > 0 && (
                                        <div className="detail-row">
                                            <span className="label">University:</span>
                                            <span className="value">{universities[0].name}</span>
                                        </div>
                                    )}
                                </div>
                            </div>
                            <div className="payment-divider"></div>
                            <div className="payment-summary">
                                <div className="summary-row">
                                    <span>Course Fee</span>
                                    <span className="amount">${course.Fees || course.fees || 0}</span>
                                </div>
                                <div className="summary-row total">
                                    <span>Total</span>
                                    <span className="amount">${course.Fees || course.fees || 0}</span>
                                </div>
                            </div>
                            <div className="payment-actions">
                                <button
                                    className="btn outline"
                                    onClick={() => setShowPaymentModal(false)}
                                >
                                    Cancel
                                </button>
                                <button
                                    className="btn primary"
                                    onClick={confirmPayment}
                                    disabled={enrolling}
                                >
                                    {enrolling ? 'Processing...' : 'Pay Now'}
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {/* PROGRESS BAR - ONLY VISIBLE IF ENROLLED */}
                {isEnrolled && (
                    <div className="progress-section">
                        <h3>Your Progress</h3>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', width: '100%' }}>
                            <div style={{ flex: 1, height: '6px', background: '#eee', borderRadius: '3px', overflow: 'hidden' }}>
                                <div
                                    style={{
                                        width: `${Math.min(studentProgress, 100)}%`,
                                        height: '100%',
                                        background: isProgressComplete ? '#28a745' : '#ffc107'
                                    }}
                                ></div>
                            </div>
                            <span
                                style={{
                                    fontSize: '0.85em',
                                    color: isProgressComplete ? '#666' : '#ff9800',
                                    fontWeight: isProgressComplete ? 'normal' : '600'
                                }}
                            >
                                {Math.round(studentProgress)}%
                            </span>
                        </div>
                    </div>
                )}

                {/* MODULES SECTION - VISIBLE TO ALL (ENROLLED & NON-ENROLLED) */}
                <>
                    <div className="modules-divider">
                        <h2>Course Modules & Content</h2>
                        {!isEnrolled && (
                            <p className="section-subtitle">Enroll to access module content</p>
                        )}
                        {isEnrolled && (
                            <p className="section-subtitle">You are enrolled in this course. Explore the modules below.</p>
                        )}
                    </div>

                    {modules.length > 0 ? (
                        <div className="modules-list">
                            {modules.map((module) => (
                                <div key={module.module_number} className="module-card">
                                    <div
                                        className="module-header"
                                        onClick={() => toggleModule(module.module_number)}
                                        role="button"
                                        tabIndex={0}
                                        onKeyPress={(e) => e.key === 'Enter' && toggleModule(module.module_number)}
                                    >
                                        <div className="module-title-section">
                                            <span className="module-toggle">
                                                {expandedModules[module.module_number] ? '▼' : '▶'}
                                            </span>
                                            <h4>Module {module.module_number}: {module.name}</h4>
                                            {module.duration_weeks && (
                                                <span className="module-duration">({module.duration_weeks} weeks)</span>
                                            )}
                                        </div>
                                    </div>

                                    {/* MODULE CONTENT - EXPANDABLE - FIXED className */}
                                    <div className={`module-content ${expandedModules[module.module_number] ? 'expanded' : ''}`}>
                                        <div className="module-content-inner">
                                            {!isEnrolled ? (
                                                <div className="enrollment-required">
                                                    <p>🔒 Enroll to access the course content</p>
                                                </div>
                                            ) : loadingContent[module.module_number] ? (
                                                <div className="content-loading">
                                                    <div className="spinner-small"></div>
                                                    <p>Loading content...</p>
                                                </div>
                                            ) : moduleContents[module.module_number] && moduleContents[module.module_number].length > 0 ? (
                                                <div className="table-responsive">
                                                    <table className="student-module-table">
                                                        <thead>
                                                            <tr>
                                                                <th>Name</th>
                                                                <th>Type</th>
                                                                <th>URL</th>
                                                                <th>Mark Complete</th>
                                                            </tr>
                                                        </thead>
                                                        <tbody>
                                                    {(moduleContents[module.module_number] || []).map((content) => {
                                                        const isCompleted = isContentCompleted(module.module_number, content.content_id);
                                                        return (
                                                            <tr key={content.content_id} className={isCompleted ? 'completed-row' : ''}>
                                                                <td><strong>{content.title}</strong></td>
                                                                <td><span className="badge">{content.content_type || content.type}</span></td>
                                                                <td>
                                                                    {content.url ? (
                                                                        <a href={content.url} target="_blank" rel="noopener noreferrer" className="btn outline small">
                                                                            Open
                                                                        </a>
                                                                    ) : <span className="muted">-</span>}
                                                                </td>
                                                                <td>
                                                                    <div className="checkbox-wrapper">
                                                                        <input
                                                                            type="checkbox"
                                                                            checked={isCompleted}
                                                                            onChange={() => handleMarkComplete(module.module_number, content.content_id)}
                                                                            className="completion-checkbox"
                                                                            title="Mark as complete"
                                                                        />
                                                                    </div>
                                                                </td>
                                                            </tr>
                                                        );
                                                    })}
                                                        </tbody>
                                                    </table>
                                                </div>
                                            ) : (
                                                <div className="empty-content">
                                                    <p>No content available for this module yet.</p>
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="empty-modules">
                            <p>📚 No modules available for this course yet.</p>
                            <p className="text-secondary">The instructor will add course content soon.</p>
                        </div>
                    )}
                </>

                {/* REVIEWS SECTION */}
                {isEnrolled && (
                    <div className="reviews-section">
                        <h3>Course Reviews</h3>

                        {ratingData && ratingData.average_rating && (
                            <div className="rating-summary">
                                <div className="rating-score">
                                    {parseFloat(ratingData.average_rating).toFixed(1)}
                                </div>
                                <div className="rating-details">
                                    <div className="rating-stars">
                                        {'★'.repeat(Math.round(parseFloat(ratingData.average_rating)))}
                                    </div>
                                    <div className="rating-count">{ratingData.total_ratings} ratings</div>
                                </div>
                            </div>
                        )}

                        {/* REVIEW FORM - ONLY IF PROGRESS IS 100% AND NO EXISTING REVIEW */}
                        {isProgressComplete && !hasExistingReview && !showReviewForm && (
                            <div className="write-review-prompt">
                                <p>🎉 You've completed this course! Share your feedback.</p>
                                <button className="btn primary" onClick={() => setShowReviewForm(true)}>
                                    Write a Review
                                </button>
                            </div>
                        )}

                        {hasExistingReview && isProgressComplete && (
                            <div className="review-submitted-message">
                                <p>✓ Thank you for your review! Your feedback has been submitted.</p>
                            </div>
                        )}

                        {showReviewForm && (
                            <div className="review-form">
                                <h4>Share Your Review</h4>
                                <div className="form-group">
                                    <label>Rating</label>
                                    <select
                                        value={reviewRating}
                                        onChange={(e) => setReviewRating(parseInt(e.target.value))}
                                        className="form-select"
                                    >
                                        <option value={5}>⭐⭐⭐⭐⭐ Excellent</option>
                                        <option value={4}>⭐⭐⭐⭐ Good</option>
                                        <option value={3}>⭐⭐⭐ Average</option>
                                        <option value={2}>⭐⭐ Poor</option>
                                        <option value={1}>⭐ Very Poor</option>
                                    </select>
                                </div>
                                <div className="form-group">
                                    <label>Your Review</label>
                                    <textarea
                                        value={reviewText}
                                        onChange={(e) => setReviewText(e.target.value)}
                                        placeholder="Share your thoughts about this course..."
                                        className="form-textarea"
                                        rows="4"
                                    />
                                </div>
                                <div className="review-actions">
                                    <button className="btn primary" onClick={async () => {
                                        try {
                                            await courseService.submitReview(courseId, { review: reviewText, rating: reviewRating });
                                            setHasExistingReview(true);
                                            setShowReviewForm(false);
                                            setReviewText('');
                                            // Refresh reviews
                                            const reviewsRes = await courseService.getCourseReviews(courseId);
                                            setReviews(reviewsRes.reviews || []);
                                        } catch (err) {
                                            console.error('Error submitting review:', err);
                                            setError('Failed to submit review');
                                        }
                                    }}>Submit Review</button>
                                    <button className="btn outline" onClick={() => setShowReviewForm(false)}>Cancel</button>
                                </div>
                            </div>
                        )}

                        {/* EXISTING REVIEWS */}
                        {reviews.length > 0 && (
                            <div className="reviews-list">
                                <h4>Student Reviews ({reviews.length})</h4>
                                {reviews.map((review, idx) => {
                                    const ratingValue = Number(review.rating || 0);
                                    const ratingPercent = Math.min(Math.max((ratingValue / 5) * 100, 0), 100);
                                    const reviewerName = review.student_name || 'Student';
                                    const reviewerInitial = reviewerName.trim().charAt(0).toUpperCase();
                                    const reviewTextValue = review.review || review.Review || '';

                                    return (
                                        <div key={idx} className="review-card">
                                            <div className="review-avatar">{reviewerInitial}</div>
                                            <div className="review-body">
                                                <div className="review-header">
                                                    <span className="reviewer-name">{reviewerName}</span>
                                                    <div className="review-stars" aria-label={`Rating: ${ratingValue} out of 5`}>
                                                        <span className="review-stars-fill" style={{ width: `${ratingPercent}%` }}></span>
                                                    </div>
                                                </div>
                                                <p className="review-text">{reviewTextValue || 'No review text provided.'}</p>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </div>
                )}

                {error && (
                    <div className="alert error">
                        <p>{error}</p>
                    </div>
                )}
            </div>
        </>
    );
};