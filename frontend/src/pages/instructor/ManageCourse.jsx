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
        
        setCourse(courseData.course || courseData);
        setModules(modulesRes.modules || []);
      } catch (err) {
        console.error('Error loading course:', err);
        setError('Unable to load course details. Please try again later.');
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, [courseId]);

  const loadContent = async (moduleNumber) => {
    if (contentByModule[moduleNumber]) return;
    try {
      const res = await instructorService.getModuleContent(courseId, moduleNumber);
      const list = res.content || res || [];
      setContentByModule((prev) => ({ ...prev, [moduleNumber]: Array.isArray(list) ? list : [] }));
    } catch {
      setContentByModule((prev) => ({ ...prev, [moduleNumber]: [] }));
    }
  };

  const refreshModules = async () => {
    try {
      const res = await instructorService.getCourseModules(courseId);
      setModules(res.modules || []);
    } catch {}
  };

  const showMsg = (msg) => {
    setMessage(msg);
    setTimeout(() => setMessage(null), 3000);
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
      showMsg('Module added.');
    } catch (err) {
      console.error('Error adding module:', err);
      setError('Could not add the module. Please ensure the module number is unique.');
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
      showMsg('Module updated.');
    } catch (err) {
      console.error('Error updating module:', err);
      setError('Could not update the module details. Please try again.');
    }
  };

  const handleSwap = async (num1, num2) => {
    try {
      await instructorService.swapModules(courseId, num1, num2);
      await refreshModules();
      setContentByModule({});
      setExpandedModule(null);
      showMsg('Order updated');
    } catch (err) {
      console.error('Error swapping modules:', err);
      setError('Could not reorder modules. Please try again.');
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
      setContentByModule((prev) => ({ ...prev, [addContentFor]: undefined }));
      await loadContent(addContentFor);
      showMsg('Content added.');
    } catch (err) {
      console.error('Error adding content:', err);
      setError('Could not add content. Please ensure the content ID is unique.');
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
      setContentByModule((prev) => ({ ...prev, [editingContent.module_number]: undefined }));
      await loadContent(editingContent.module_number);
      showMsg('Content updated.');
    } catch (err) {
      console.error('Error updating content:', err);
      setError('Could not update content details. Please try again.');
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
        <div className="course-header">
          <div className="course-header-content">
            {course?.university_name && (
              <div style={{ fontSize: '0.9rem', color: 'rgba(255,255,255,0.8)', marginBottom: '0.5rem', fontWeight: '500', display: 'flex', alignItems: 'center', gap: '6px' }}>
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
              <div style={{ fontSize: '0.9rem', color: 'rgba(255,255,255,0.8)', marginBottom: '1rem', fontStyle: 'italic' }}>
                <span style={{ fontWeight: '600' }}>Co-instructors:</span> {course.other_instructors}
              </div>
            )}
            <div style={{ marginTop: '1.5rem', display: 'flex', gap: '10px' }}>
              <button type="button" className="btn outline" onClick={() => setIsEditMode(!isEditMode)} style={{ borderColor: 'white', color: 'black' }}>
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
          <div className="modules-list">
            {isEditMode && (
              <div style={{ marginBottom: '2rem' }}>
                {!addModule ? (
                  <button type="button" className="btn primary" onClick={() => setAddModule(true)} style={{ marginBottom: '1.5rem' }}>
                    + Add module
                  </button>
                ) : (
                  <div className="card edit-form-card" style={{ marginBottom: '1.5rem' }}>
                    <h3 style={{ marginBottom: '1rem' }}>New module</h3>
                    <form onSubmit={handleAddModule}>
                      <div className="edit-form-row">
                        <div className="form-group" style={{ flex: '0 0 100px' }}>
                          <label className="form-label">Number</label>
                          <input
                            type="number"
                            min={1}
                            className="form-input"
                            value={formModule.module_number}
                            onChange={(e) => setFormModule((f) => ({ ...f, module_number: e.target.value }))}
                            required
                          />
                        </div>
                        <div className="form-group" style={{ flex: 2 }}>
                          <label className="form-label">Name</label>
                          <input
                            type="text"
                            className="form-input"
                            value={formModule.name}
                            onChange={(e) => setFormModule((f) => ({ ...f, name: e.target.value }))}
                            required
                          />
                        </div>
                        <div className="form-group" style={{ flex: 1 }}>
                          <label className="form-label">Weeks</label>
                          <input
                            type="number"
                            min={0}
                            className="form-input"
                            value={formModule.duration_weeks}
                            onChange={(e) => setFormModule((f) => ({ ...f, duration_weeks: e.target.value }))}
                          />
                        </div>
                      </div>
                      <div style={{ display: 'flex', gap: '0.5rem', marginTop: '1rem' }}>
                        <button type="submit" className="btn primary">Save module</button>
                        <button type="button" className="btn secondary" onClick={() => { setAddModule(false); setFormModule({ module_number: '', name: '', duration_weeks: '' }); }}>Cancel</button>
                      </div>
                    </form>
                  </div>
                )}

                {editingModule && (
                  <div className="card edit-form-card" style={{ marginBottom: '1.5rem' }}>
                    <h3>Edit module</h3>
                    <form onSubmit={handleUpdateModule}>
                      <div className="edit-form-row">
                        <div className="form-group" style={{ flex: 2 }}>
                          <label className="form-label">Name</label>
                          <input
                            type="text"
                            className="form-input"
                            value={formModule.name}
                            onChange={(e) => setFormModule((f) => ({ ...f, name: e.target.value }))}
                            required
                          />
                        </div>
                        <div className="form-group" style={{ flex: 1 }}>
                          <label className="form-label">Weeks</label>
                          <input
                            type="number"
                            min={0}
                            className="form-input"
                            value={formModule.duration_weeks}
                            onChange={(e) => setFormModule((f) => ({ ...f, duration_weeks: e.target.value }))}
                          />
                        </div>
                      </div>
                      <div style={{ display: 'flex', gap: '0.5rem', marginTop: '1rem' }}>
                        <button type="submit" className="btn primary">Update</button>
                        <button type="button" className="btn secondary" onClick={() => { setEditingModule(null); setFormModule({ module_number: '', name: '', duration_weeks: '' }); }}>Cancel</button>
                      </div>
                    </form>
                  </div>
                )}
              </div>
            )}

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
                        <h4 style={{ display: 'inline', marginRight: '10px' }}>Module {mod.module_number}: {mod.name}</h4>
                        {mod.duration_weeks ? <span className="module-duration" style={{ fontSize: '0.85em', color: '#666' }}>({mod.duration_weeks} {mod.duration_weeks === 1 ? 'week' : 'weeks'})</span> : null}
                      </div>
                    </div>
                    {isEditMode && (
                      <div onClick={(e) => e.stopPropagation()} style={{ display: 'flex', gap: '5px' }}>
                        <button type="button" className="btn secondary small" disabled={idx === 0} onClick={() => handleSwap(mod.module_number, modules[idx - 1].module_number)}>↑</button>
                        <button type="button" className="btn secondary small" disabled={idx === modules.length - 1} onClick={() => handleSwap(mod.module_number, modules[idx + 1].module_number)}>↓</button>
                        <button type="button" className="btn outline small" onClick={() => { setEditingModule(mod); setFormModule({ name: mod.name, duration_weeks: mod.duration_weeks ?? '' }); }}>Edit</button>
                      </div>
                    )}
                  </div>

                  {expandedModule?.module_number === mod.module_number && (
                    <div className="module-content">
                      {isEditMode && (
                        <div style={{ marginBottom: '1rem' }}>
                          {addContentFor === mod.module_number ? (
                            <div className="card edit-form-card" style={{ marginTop: '0.5rem' }}>
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
                                <div style={{ display: 'flex', gap: '0.5rem', marginTop: '1rem' }}>
                                  <button type="submit" className="btn primary">Add content</button>
                                  <button type="button" className="btn secondary" onClick={() => { setAddContentFor(null); setFormContent({ content_id: '', title: '', content_type: 'Note', url: '' }); }}>Cancel</button>
                                </div>
                              </form>
                            </div>
                          ) : (
                            <button type="button" className="btn outline small" onClick={() => { setAddContentFor(mod.module_number); setEditingContent(null); }}>+ Add content</button>
                          )}

                          {editingContent?.module_number === mod.module_number && (
                            <div className="card edit-form-card" style={{ marginTop: '0.5rem' }}>
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
                                <div style={{ display: 'flex', gap: '0.5rem', marginTop: '1rem' }}>
                                  <button type="submit" className="btn primary">Update content</button>
                                  <button type="button" className="btn secondary" onClick={() => { setEditingContent(null); setFormContent({ title: '', content_type: 'Note', url: '' }); }}>Cancel</button>
                                </div>
                              </form>
                            </div>
                          )}
                        </div>
                      )}

                      <div className="content-list">
                        {contentByModule[mod.module_number] === undefined ? (
                          <div className="muted">Loading content...</div>
                        ) : (contentByModule[mod.module_number] || []).length === 0 ? (
                          <div className="muted">No content yet.</div>
                        ) : (
                          (contentByModule[mod.module_number] || []).map((c) => (
                            <div key={c.content_id} className="content-item" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                <strong>{c.title}</strong>
                                <span className="badge" style={{ fontSize: '0.8em', background: '#eee', padding: '2px 6px', borderRadius: '4px' }}>{c.content_type}</span>
                              </div>
                              {isEditMode ? (
                                <button type="button" className="btn outline small" onClick={() => { setEditingContent(c); setAddContentFor(null); setFormContent({ title: c.title, content_type: c.content_type, url: c.url || '' }); }}>Edit</button>
                              ) : (
                                c.url && <a href={c.url} target="_blank" rel="noreferrer" className="btn outline small">Open</a>
                              )}
                            </div>
                          ))
                        )}
                      </div>
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </>
  );
};

export default ManageCourse;
