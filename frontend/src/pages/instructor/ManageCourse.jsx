import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Navbar from '../../components/Navbar';
import instructorService from '../../api/instructorService';
import courseService from '../../api/courseService';
import '../../styles/student/student-common.css';

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

  const [formModule, setFormModule] = useState({ module_number: '', name: '', duration_weeks: '' });
  const [formContent, setFormContent] = useState({ content_id: '', title: '', content_type: 'Note', url: '' });

  useEffect(() => {
    const fetch = async () => {
      if (isNaN(courseId)) return;
      try {
        setLoading(true);
        const [courseRes, modulesRes] = await Promise.all([
          courseService.getCourseById(courseId),
          instructorService.getCourseModules(courseId),
        ]);
        setCourse(courseRes.course || courseRes);
        setModules(modulesRes.modules || []);
      } catch (err) {
        setError(err.response?.data?.error || 'Failed to load course');
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
      setError(err.response?.data?.error || 'Failed to add module');
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
      setError(err.response?.data?.error || 'Failed to update module');
    }
  };

  const handleSwap = async (num1, num2) => {
    try {
      await instructorService.swapModules(courseId, num1, num2);
      await refreshModules();
      setContentByModule({});
      setExpandedModule(null);
      showMsg('Order updated.');
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to reorder');
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
      setError(err.response?.data?.error || 'Failed to add content');
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
      setError(err.response?.data?.error || 'Failed to update content');
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
      <div className="student-container">
        <div className="section-header">
          <div>
            <button type="button" className="btn outline" onClick={() => navigate('/instructor/dashboard')} style={{ marginBottom: '1rem' }}>
              ← Back to dashboard
            </button>
            <h1>{course?.name || 'Manage course'}</h1>
            <p className="muted">Add or edit modules (number, name, duration) and content. Reorder with up/down.</p>
          </div>
        </div>

        {error && <div className="alert error" style={{ marginBottom: '1rem' }}>{error}</div>}
        {message && <div className="alert success" style={{ marginBottom: '1rem' }}>{message}</div>}

        {loading ? (
          <div className="empty">Loading...</div>
        ) : (
          <>
            <h2>Modules</h2>
            {!addModule ? (
              <button type="button" className="btn primary" onClick={() => setAddModule(true)} style={{ marginBottom: '1rem' }}>
                + Add module
              </button>
            ) : (
              <div className="card" style={{ marginBottom: '1.5rem' }}>
                <h3 style={{ marginBottom: '1rem' }}>New module</h3>
                <form onSubmit={handleAddModule}>
                  <div className="form-group">
                    <label className="form-label">Module number</label>
                    <input
                      type="number"
                      min={1}
                      className="form-input"
                      value={formModule.module_number}
                      onChange={(e) => setFormModule((f) => ({ ...f, module_number: e.target.value }))}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Name</label>
                    <input
                      type="text"
                      className="form-input"
                      value={formModule.name}
                      onChange={(e) => setFormModule((f) => ({ ...f, name: e.target.value }))}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Duration (weeks)</label>
                    <input
                      type="number"
                      min={0}
                      className="form-input"
                      value={formModule.duration_weeks}
                      onChange={(e) => setFormModule((f) => ({ ...f, duration_weeks: e.target.value }))}
                    />
                  </div>
                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <button type="submit" className="btn primary">Save module</button>
                    <button type="button" className="btn secondary" onClick={() => { setAddModule(false); setFormModule({ module_number: '', name: '', duration_weeks: '' }); }}>Cancel</button>
                  </div>
                </form>
              </div>
            )}

            {editingModule && (
              <div className="card" style={{ marginBottom: '1.5rem' }}>
                <h3>Edit module</h3>
                <form onSubmit={handleUpdateModule}>
                  <div className="form-group">
                    <label className="form-label">Name</label>
                    <input
                      type="text"
                      className="form-input"
                      value={formModule.name}
                      onChange={(e) => setFormModule((f) => ({ ...f, name: e.target.value }))}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Duration (weeks)</label>
                    <input
                      type="number"
                      min={0}
                      className="form-input"
                      value={formModule.duration_weeks}
                      onChange={(e) => setFormModule((f) => ({ ...f, duration_weeks: e.target.value }))}
                    />
                  </div>
                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <button type="submit" className="btn primary">Update</button>
                    <button type="button" className="btn secondary" onClick={() => { setEditingModule(null); setFormModule({ module_number: '', name: '', duration_weeks: '' }); }}>Cancel</button>
                  </div>
                </form>
              </div>
            )}

            {modules.length === 0 ? (
              <div className="empty">No modules yet. Add one above.</div>
            ) : (
              <ul style={{ listStyle: 'none', padding: 0 }}>
                {modules.map((mod, idx) => (
                  <li key={`${mod.course_id}-${mod.module_number}`} className="card" style={{ marginBottom: '1rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.5rem' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flex: 1 }}>
                        <span className="muted">#{mod.module_number}</span>
                        <strong>{mod.name}</strong>
                        {mod.duration_weeks != null && <span className="muted">{mod.duration_weeks} weeks</span>}
                      </div>
                      <div style={{ display: 'flex', gap: '0.5rem' }}>
                        <button type="button" className="btn secondary" disabled={idx === 0} onClick={() => idx > 0 && handleSwap(mod.module_number, modules[idx - 1].module_number)}>↑</button>
                        <button type="button" className="btn secondary" disabled={idx === modules.length - 1} onClick={() => idx < modules.length - 1 && handleSwap(mod.module_number, modules[idx + 1].module_number)}>↓</button>
                        <button type="button" className="btn outline" onClick={() => { setEditingModule(mod); setFormModule({ name: mod.name, duration_weeks: mod.duration_weeks ?? '' }); }}>Edit</button>
                        <button type="button" className="btn primary" onClick={() => { toggleModule(mod); }}>{expandedModule?.module_number === mod.module_number ? 'Hide content' : 'Content'}</button>
                      </div>
                    </div>

                    {expandedModule?.module_number === mod.module_number && (
                      <div style={{ marginTop: '1.5rem', paddingTop: '1rem', borderTop: '1px solid var(--border-light)' }}>
                        <h4>Content (all details)</h4>
                        {addContentFor === mod.module_number ? (
                          <div className="card flat" style={{ marginTop: '0.5rem' }}>
                            <form onSubmit={handleAddContent}>
                              <div className="form-group">
                                <label className="form-label">Content ID</label>
                                <input type="number" min={1} className="form-input" value={formContent.content_id} onChange={(e) => setFormContent((f) => ({ ...f, content_id: e.target.value }))} required />
                              </div>
                              <div className="form-group">
                                <label className="form-label">Title</label>
                                <input type="text" className="form-input" value={formContent.title} onChange={(e) => setFormContent((f) => ({ ...f, title: e.target.value }))} required />
                              </div>
                              <div className="form-group">
                                <label className="form-label">Type</label>
                                <select className="form-input" value={formContent.content_type} onChange={(e) => setFormContent((f) => ({ ...f, content_type: e.target.value }))}>
                                  {CONTENT_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
                                </select>
                              </div>
                              <div className="form-group">
                                <label className="form-label">URL</label>
                                <input type="text" className="form-input" value={formContent.url} onChange={(e) => setFormContent((f) => ({ ...f, url: e.target.value }))} />
                              </div>
                              <div style={{ display: 'flex', gap: '0.5rem' }}>
                                <button type="submit" className="btn primary">Add content</button>
                                <button type="button" className="btn secondary" onClick={() => { setAddContentFor(null); setFormContent({ content_id: '', title: '', content_type: 'Note', url: '' }); }}>Cancel</button>
                              </div>
                            </form>
                          </div>
                        ) : (
                          <button type="button" className="btn outline" style={{ marginTop: '0.5rem' }} onClick={() => { setAddContentFor(mod.module_number); setEditingContent(null); }}>+ Add content</button>
                        )}

                        {editingContent?.module_number === mod.module_number ? (
                          <div className="card flat" style={{ marginTop: '0.5rem' }}>
                            <form onSubmit={handleUpdateContent}>
                              <div className="form-group">
                                <label className="form-label">Title</label>
                                <input type="text" className="form-input" value={formContent.title} onChange={(e) => setFormContent((f) => ({ ...f, title: e.target.value }))} required />
                              </div>
                              <div className="form-group">
                                <label className="form-label">Type</label>
                                <select className="form-input" value={formContent.content_type} onChange={(e) => setFormContent((f) => ({ ...f, content_type: e.target.value }))}>
                                  {CONTENT_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
                                </select>
                              </div>
                              <div className="form-group">
                                <label className="form-label">URL</label>
                                <input type="text" className="form-input" value={formContent.url} onChange={(e) => setFormContent((f) => ({ ...f, url: e.target.value }))} />
                              </div>
                              <div style={{ display: 'flex', gap: '0.5rem' }}>
                                <button type="submit" className="btn primary">Update content</button>
                                <button type="button" className="btn secondary" onClick={() => { setEditingContent(null); setFormContent({ title: '', content_type: 'Note', url: '' }); }}>Cancel</button>
                              </div>
                            </form>
                          </div>
                        ) : (
                          <ul style={{ listStyle: 'none', padding: 0, marginTop: '0.5rem' }}>
                            {contentByModule[mod.module_number] === undefined ? (
                              <li className="muted">Loading content...</li>
                            ) : (contentByModule[mod.module_number] || []).length === 0 ? (
                              <li className="muted">No content yet.</li>
                            ) : (
                              (contentByModule[mod.module_number] || []).map((c) => (
                                <li key={c.content_id} className="card flat" style={{ marginBottom: '0.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                  <div>
                                    <strong>{c.title}</strong>
                                    <span className="muted" style={{ marginLeft: '0.5rem' }}>(ID: {c.content_id}, {c.content_type})</span>
                                    {c.url && <div className="muted" style={{ fontSize: '0.85rem' }}>{c.url}</div>}
                                  </div>
                                  <button type="button" className="btn outline" onClick={() => { setEditingContent(c); setAddContentFor(null); setFormContent({ title: c.title, content_type: c.content_type, url: c.url || '' }); }}>Edit</button>
                                </li>
                              ))
                            )}
                          </ul>
                        )}
                      </div>
                    )}
                  </li>
                ))}
              </ul>
            )}
          </>
        )}
      </div>
    </>
  );
};

export default ManageCourse;
