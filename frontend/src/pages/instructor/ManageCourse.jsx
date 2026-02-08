import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Navbar from '../../components/Navbar';
import instructorService from '../../api/instructorService';
import courseService from '../../api/courseService';
import '../../styles/instructor/instructor-manage-course.css';

const CONTENT_TYPES = ['Video', 'Note', 'assignment'];

const ManageCourse = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const courseId = parseInt(id, 10);
  const [course, setCourse] = useState(null);
  const [modules, setModules] = useState([]);
  const [contentByModule, setContentByModule] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [expandedModule, setExpandedModule] = useState(null);
  const [editingModule, setEditingModule] = useState(null);
  const [editingContent, setEditingContent] = useState(null);
  const [addModule, setAddModule] = useState(false);
  const [addContentFor, setAddContentFor] = useState(null);
  const [isEditMode, setIsEditMode] = useState(false);

  const [formModule, setFormModule] = useState({ module_number: '', name: '', duration_weeks: '' });
  const [formContent, setFormContent] = useState({ content_id: '', title: '', content_type: 'Note', url: '' });

  // Timer for success messages
  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => setMessage(''), 3000);
      return () => clearTimeout(timer);
    }
  }, [message]);

  // Timer for error messages
  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => setError(''), 3000); // Set to 3 seconds
      return () => clearTimeout(timer);
    }
  }, [error]);

  useEffect(() => {
    const fetch = async () => {
      if (isNaN(courseId)) return;
      try {
        setLoading(true);
        // Fetch assigned courses to get enriched data (counts, university, co-instructors)
        const [assignedRes, modulesRes] = await Promise.all([
          instructorService.getAssignedCourses(),
          instructorService.getCourseModules(courseId),
        ]);
        
        const foundCourse = (assignedRes.courses || []).find(c => c.course_id === courseId);
        // Fallback to basic fetch if not found (though it should be if assigned)
        const courseData = foundCourse || (await courseService.getCourseById(courseId));
        
        const courseObj = courseData.course || courseData;
        setCourse(courseObj);
        setModules(modulesRes.modules || []);
      } catch (err) {
        console.error('Error loading course:', err);
        setError(err.response?.data?.error || 'Unable to load course details. Please try again later.');
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, [courseId]);

  const loadContent = async (moduleNumber, forceRefresh = false) => {
    // If content exists and we are not forcing a refresh, do nothing.
    if (contentByModule[moduleNumber] && !forceRefresh) {
      return;
    }

    // To show a loading indicator, set the content for this module to undefined.
    // This is useful for forced refreshes.
    setContentByModule((prev) => ({ ...prev, [moduleNumber]: undefined }));

    try {
      // Fetch the content from the API
      const res = await instructorService.getModuleContent(courseId, moduleNumber);
      const list = res.content || res || [];
      // After fetching, update the state with the new content.
      setContentByModule((prev) => ({ ...prev, [moduleNumber]: Array.isArray(list) ? list : [] }));
    } catch (err) {
      console.error(`Failed to load content for module ${moduleNumber}`, err);
      // If fetch fails, set content to an empty array to stop the loading indicator.
      setContentByModule((prev) => ({ ...prev, [moduleNumber]: [] }));
    }
  };

  const refreshModules = async () => {
    try {
      const res = await instructorService.getCourseModules(courseId);
      setModules(res.modules || []);
    } catch (err) {
      console.error('Failed to refresh modules:', err);
    }
  };

  const handleAddModule = async (e) => {
    e.preventDefault();
    const num = parseInt(formModule.module_number, 10);
    if (!num || num < 1 || !formModule.name.trim()) {
      setError('Module number (positive) and name are required.');
      return;
    }
    try {
      await instructorService.createModule(courseId, {
        module_number: num,
        name: formModule.name.trim(),
        duration_weeks: formModule.duration_weeks ? parseInt(formModule.duration_weeks, 10) : null,
      });
      setFormModule({ module_number: '', name: '', duration_weeks: '' });
      setAddModule(false);
      await refreshModules();
      setMessage('Module added.');
    } catch (err) {
      console.error('Error adding module:', err);
      setError(err.response?.data?.error || 'Could not add the module. Please ensure the module number is unique.');
    }
  };

  const handleUpdateModule = async (e) => {
    e.preventDefault();
    if (!editingModule || !formModule.name.trim()) return;
    try {
      await instructorService.updateModule(courseId, editingModule.module_number, {
        name: formModule.name.trim(),
        duration_weeks: formModule.duration_weeks ? parseInt(formModule.duration_weeks, 10) : null,
      });
      setEditingModule(null);
      setFormModule({ module_number: '', name: '', duration_weeks: '' });
      await refreshModules();
      setMessage('Module updated.');
    } catch (err) {
      console.error('Error updating module:', err);
      setError(err.response?.data?.error || 'Could not update the module details. Please try again.');
    }
  };

  const handleDeleteModule = async (moduleNumber) => {
    if (window.confirm(`Are you sure you want to delete module ${moduleNumber}? This will also delete all its content.`)) {
      try {
        const res = await instructorService.deleteModule(courseId, moduleNumber);
        setModules(res.modules || []);
        setContentByModule({}); // Clear all cached content
        setExpandedModule(null); // Collapse all modules
        setMessage('Module deleted.');
      } catch (err) {
        console.error('Error deleting module:', err);
        setError(err.response?.data?.error || 'Could not delete the module.');
      }
    }
  };

  const handleSwap = async (num1, num2) => {
    try {
      const res = await instructorService.swapModules(courseId, num1, num2);
      setModules(res.modules || []);
      setContentByModule({});
      setExpandedModule(null);
      setMessage('Order updated');
    } catch (err) {
      console.error('Error swapping modules:', err);
      setError(err.response?.data?.error || 'Could not reorder modules. Please try again.');
    }
  };

  const handleAddContent = async (e) => {
    e.preventDefault();
    const cid = parseInt(formContent.content_id, 10);
    if (!cid || cid < 1 || !formContent.title.trim()) {
      setError('Content ID (positive) and title are required.');
      return;
    }
    if (!addContentFor) return;
    try {
      await instructorService.createContent(courseId, addContentFor, {
        content_id: cid,
        title: formContent.title.trim(),
        content_type: formContent.content_type,
        url: formContent.url.trim() || null,
      });
      setFormContent({ content_id: '', title: '', content_type: 'Note', url: '' });
      setAddContentFor(null);
      await loadContent(addContentFor, true); // Force refresh
      setMessage('Content added.');
    } catch (err) {
      console.error('Error adding content:', err);
      setError(err.response?.data?.error || 'Could not add content. Please ensure the content ID is unique.');
    }
  };

  const handleUpdateContent = async (e) => {
    e.preventDefault();
    if (!editingContent) return;
    try {
      await instructorService.updateContent(courseId, editingContent.module_number, editingContent.content_id, {
        title: formContent.title.trim(),
        content_type: formContent.content_type,
        url: formContent.url.trim() || null,
      });
      setEditingContent(null);
      setFormContent({ content_id: '', title: '', content_type: 'Note', url: '' });
      await loadContent(editingContent.module_number, true); // Force refresh
      setMessage('Content updated.');
    } catch (err) {
      console.error('Error updating content:', err);
      setError(err.response?.data?.error || 'Could not update content details. Please try again.');
    }
  };

  const handleDeleteContent = async (moduleNumber, contentId) => {
    if (window.confirm(`Are you sure you want to delete this content item?`)) {
      try {
        const res = await instructorService.deleteContent(courseId, moduleNumber, contentId);
        setContentByModule(prev => ({ ...prev, [moduleNumber]: res.content || [] }));
        setMessage('Content deleted.');
      } catch (err) {
        console.error('Error deleting content:', err);
        setError(err.response?.data?.error || 'Could not delete the content item.');
      }
    }
  };

  const handleContentSwap = async (moduleNumber, contentId1, contentId2) => {
    try {
      // The backend now returns the updated content list after swapping.
      const res = await instructorService.swapContent(courseId, moduleNumber, contentId1, contentId2);
      // Update the state directly with the new list, avoiding a second API call.
      setContentByModule((prev) => ({ ...prev, [moduleNumber]: res.content || [] }));
      setMessage('Content order updated.');
    } catch (err) {
      console.error('Error swapping content:', err);
      setError(err.response?.data?.error || 'Could not reorder content. Please try again.');
    }
  };

  const toggleModule = (mod) => {
    const next = expandedModule?.module_number === mod.module_number ? null : mod;
    setExpandedModule(next);
    if (next) loadContent(next.module_number);
  };

  return (
    <>
      <Navbar role="Instructor" />
      <div className="instructor-container">
        <div
          className="course-header"
          style={course?.image_url ? { backgroundImage: `url(${course.image_url})` } : {}}
        >
          <div className="course-header-content">
            {course?.university_name && (
              <div className="university-name">
                <span>🏛️</span> {course.university_name}
              </div>
            )}
            <h1>{course?.name || 'Manage Course'}</h1>
            
            <div className="course-meta-row">
              <span className="course-meta-item">⏱ {course?.duration || 0} weeks</span>
              <span className="course-meta-item">👥 {course?.student_count || 0} students</span>
              <span className="course-meta-item">📚 {course?.module_count || 0} modules</span>
            </div>
            {course?.other_instructors && (
              <div className="co-instructors">
                <strong>Co-instructors:</strong> {course.other_instructors}
              </div>
            )}
            {course?.textbook_isbn && (
              <div className="course-textbook">
                <strong>Textbook:</strong> {course.textbook_name} <em>by {course.textbook_author || 'N/A'}</em> (ISBN: {course.textbook_isbn})
              </div>
            )}
            <div className="course-actions">
              <button type="button" className="btn-instructor outline" onClick={() => setIsEditMode(!isEditMode)}>
                {isEditMode ? '👁 Switch to Preview' : '✎ Switch to Edit'}
              </button>
            </div>
          </div>
        </div>

        {error && (
          <div className="alert-popup error">
            <span>{error}</span>
            <button onClick={() => setError('')} className="alert-close-btn">&times;</button>
          </div>
        )}
        {message && (
          <div className="alert-popup success">
            <span>{message}</span>
            <button onClick={() => setMessage('')} className="alert-close-btn">&times;</button>
          </div>
        )}

        {loading ? (
          <div className="empty">Loading...</div>
        ) : (
          <>
            {isEditMode && (
              <div className="management-controls">
                {isEditMode && !addModule && !editingModule && (
                  <div className="top-level-actions">
                    <button type="button" className="btn-instructor primary" onClick={() => setAddModule(true)}>+ Add module</button>
                  </div>
                )}

                {isEditMode && addModule && (
                  <div className="module-management-section">
                      <div className="card edit-form-card">
                        <h3>New module</h3>
                        <form onSubmit={handleAddModule}>
                          <div className="edit-form-row">
                            <div className="form-group" style={{ flex: '0 0 100px' }}>
                              <label className="form-label">Number</label>
                              <input type="number" min={1} className="form-input" value={formModule.module_number} onChange={(e) => setFormModule((f) => ({ ...f, module_number: e.target.value }))} required />
                            </div>
                            <div className="form-group" style={{ flex: 2 }}>
                              <label className="form-label">Name</label>
                              <input type="text" className="form-input" value={formModule.name} onChange={(e) => setFormModule((f) => ({ ...f, name: e.target.value }))} required />
                            </div>
                            <div className="form-group" style={{ flex: 1 }}>
                              <label className="form-label">Weeks</label>
                              <input type="number" min={0} className="form-input" value={formModule.duration_weeks} onChange={(e) => setFormModule((f) => ({ ...f, duration_weeks: e.target.value }))} />
                            </div>
                          </div>
                          <div className="edit-form-actions">
                            <button type="submit" className="btn-instructor primary">Save module</button>
                            <button type="button" className="btn-instructor secondary" onClick={() => { setAddModule(false); setFormModule({ module_number: '', name: '', duration_weeks: '' }); }}>Cancel</button>
                          </div>
                        </form>
                      </div>
                  </div>
                )}

                {isEditMode && editingModule && (
                  <div className="module-management-section">
                    <div className="card edit-form-card">
                        <h3>Edit module</h3>
                        <form onSubmit={handleUpdateModule}>
                          <div className="edit-form-row">
                            <div className="form-group" style={{ flex: 2 }}>
                              <label className="form-label">Name</label>
                              <input type="text" className="form-input" value={formModule.name} onChange={(e) => setFormModule((f) => ({ ...f, name: e.target.value }))} required />
                            </div>
                            <div className="form-group" style={{ flex: 1 }}>
                              <label className="form-label">Weeks</label>
                              <input type="number" min={0} className="form-input" value={formModule.duration_weeks} onChange={(e) => setFormModule((f) => ({ ...f, duration_weeks: e.target.value }))} />
                            </div>
                          </div>
                          <div className="edit-form-actions">
                            <button type="submit" className="btn-instructor primary">Update</button>
                            <button type="button" className="btn-instructor secondary" onClick={() => { setEditingModule(null); setFormModule({ module_number: '', name: '', duration_weeks: '' }); }}>Cancel</button>
                          </div>
                        </form>
                      </div>
                  </div>
                )}
              </div>
            )}

            <div className="modules-list">
              {modules.length === 0 ? (
                <div className="empty-modules">No modules yet.</div>
              ) : (
                modules.map((mod, idx) => (
                  <div key={`${mod.course_id}-${mod.module_number}`} className="module-card">
                    <div className="module-header" onClick={() => toggleModule(mod)}>
                      <div className="module-title-section">
                        <span className="module-toggle">
                          {expandedModule?.module_number === mod.module_number ? '▼' : '▶'}
                        </span>
                        <div>
                          <h4>Module {mod.module_number}: {mod.name}</h4>
                          {mod.duration_weeks ? <span className="module-duration">({mod.duration_weeks} {mod.duration_weeks === 1 ? 'week' : 'weeks'})</span> : null}
                        </div>
                      </div>
                      {isEditMode && (
                        <div className="module-actions" onClick={(e) => e.stopPropagation()}>
                          <button type="button" className="btn-instructor secondary small" disabled={idx === 0} onClick={() => handleSwap(mod.module_number, modules[idx - 1].module_number)}>↑</button>
                          <button type="button" className="btn-instructor secondary small" disabled={idx === modules.length - 1} onClick={() => handleSwap(mod.module_number, modules[idx + 1].module_number)}>↓</button>
                          <button type="button" className="btn-instructor outline small" onClick={() => { setEditingModule(mod); setFormModule({ name: mod.name, duration_weeks: mod.duration_weeks ?? '' }); }}>Edit</button>
                          <button type="button" className="btn-instructor danger small" onClick={() => handleDeleteModule(mod.module_number)}>Delete</button>
                        </div>
                      )}
                    </div>

                    <div className={`module-content ${expandedModule?.module_number === mod.module_number ? 'expanded' : ''}`}>
                      <div className="module-content-inner">
                        {expandedModule?.module_number === mod.module_number && (
                          <>
                            {isEditMode && (
                              <div className="content-management-section">
                                {addContentFor === mod.module_number ? (
                                  <div className="card edit-form-card">
                                    <form onSubmit={handleAddContent}>
                                      <div className="edit-form-row">
                                        <div className="form-group" style={{ flex: '0 0 80px' }}>
                                          <label className="form-label">ID</label>
                                          <input type="number" min={1} className="form-input" value={formContent.content_id} onChange={(e) => setFormContent((f) => ({ ...f, content_id: e.target.value }))} required />
                                        </div>
                                        <div className="form-group" style={{ flex: 2 }}>
                                          <label className="form-label">Title</label>
                                          <input type="text" className="form-input" value={formContent.title} onChange={(e) => setFormContent((f) => ({ ...f, title: e.target.value }))} required />
                                        </div>
                                        <div className="form-group" style={{ flex: 1 }}>
                                          <label className="form-label">Type</label>
                                          <select className="form-input" value={formContent.content_type} onChange={(e) => setFormContent((f) => ({ ...f, content_type: e.target.value }))}>
                                            {CONTENT_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
                                          </select>
                                        </div>
                                      </div>
                                      <div className="form-group" style={{ marginTop: '1rem' }}>
                                        <label className="form-label">URL</label>
                                        <input type="text" className="form-input" value={formContent.url} onChange={(e) => setFormContent((f) => ({ ...f, url: e.target.value }))} />
                                      </div>
                                      <div className="edit-form-actions">
                                        <button type="submit" className="btn-instructor primary">Add content</button>
                                        <button type="button" className="btn-instructor secondary" onClick={() => { setAddContentFor(null); setFormContent({ content_id: '', title: '', content_type: 'Note', url: '' }); }}>Cancel</button>
                                      </div>
                                    </form>
                                  </div>
                                ) : (
                                  <button type="button" className="btn-instructor outline small" onClick={() => { setAddContentFor(mod.module_number); setEditingContent(null); }}>+ Add content</button>
                                )}

                                {editingContent?.module_number === mod.module_number && (
                                  <div className="card edit-form-card">
                                    <form onSubmit={handleUpdateContent}>
                                      <div className="edit-form-row">
                                        <div className="form-group" style={{ flex: 2 }}>
                                          <label className="form-label">Title</label>
                                          <input type="text" className="form-input" value={formContent.title} onChange={(e) => setFormContent((f) => ({ ...f, title: e.target.value }))} required />
                                        </div>
                                        <div className="form-group" style={{ flex: 1 }}>
                                          <label className="form-label">Type</label>
                                          <select className="form-input" value={formContent.content_type} onChange={(e) => setFormContent((f) => ({ ...f, content_type: e.target.value }))}>
                                            {CONTENT_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
                                          </select>
                                        </div>
                                      </div>
                                      <div className="form-group" style={{ marginTop: '1rem' }}>
                                        <label className="form-label">URL</label>
                                        <input type="text" className="form-input" value={formContent.url} onChange={(e) => setFormContent((f) => ({ ...f, url: e.target.value }))} />
                                      </div>
                                      <div className="edit-form-actions">
                                        <button type="submit" className="btn-instructor primary">Update content</button>
                                        <button type="button" className="btn-instructor secondary" onClick={() => { setEditingContent(null); setFormContent({ title: '', content_type: 'Note', url: '' }); }}>Cancel</button>
                                      </div>
                                    </form>
                                  </div>
                                )}
                              </div>
                            )}

                            <div className="content-list">
                              {contentByModule[mod.module_number] === undefined && expandedModule?.module_number === mod.module_number ? (
                                <div className="muted">Loading content...</div>
                              ) : (contentByModule[mod.module_number] || []).length === 0 ? (
                                <div className="muted">No content yet.</div>
                              ) : (
                                (contentByModule[mod.module_number] || []).map((c, c_idx, arr) => (
                                  <div key={c.content_id} className="content-item">
                                    <div className="content-item-title">
                                      <strong>{c.title}</strong>
                                      <span className="badge">{c.content_type}</span>
                                    </div>
                                    {isEditMode ? (
                                      <div className="content-item-actions">
                                        <button type="button" className="btn-instructor secondary small" title="Move Up" disabled={c_idx === 0} onClick={() => handleContentSwap(mod.module_number, c.content_id, arr[c_idx - 1].content_id)}>↑</button>
                                        <button type="button" className="btn-instructor secondary small" title="Move Down" disabled={c_idx === arr.length - 1} onClick={() => handleContentSwap(mod.module_number, c.content_id, arr[c_idx + 1].content_id)}>↓</button>
                                        <button type="button" className="btn-instructor outline small" onClick={() => { setEditingContent(c); setAddContentFor(null); setFormContent({ title: c.title, content_type: c.content_type, url: c.url || '' }); }}>Edit</button>
                                        <button type="button" className="btn-instructor danger small" onClick={() => handleDeleteContent(mod.module_number, c.content_id)}>Delete</button>
                                      </div>
                                    ) : (
                                      c.url && <a href={c.url} target="_blank" rel="noreferrer" className="btn-instructor outline small">Open</a>
                                    )}
                                  </div>
                                ))
                              )}
                            </div>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </>
        )}
      </div>
    </>
  );
};

export default ManageCourse;
