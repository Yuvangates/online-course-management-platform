import React, { useEffect, useState } from 'react';
import adminService from '../../api/adminService';

const TextBookManagement = () => {
    const [textbooks, setTextbooks] = useState([]);
    const [filteredTextbooks, setFilteredTextbooks] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [showForm, setShowForm] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [editingIsbn, setEditingIsbn] = useState(null);
    const [formData, setFormData] = useState({
        isbn: '',
        name: '',
        author: '',
    });

    useEffect(() => {
        fetchTextbooks();
    }, []);

    useEffect(() => {
        handleSearch();
    }, [searchQuery, textbooks]);

    const fetchTextbooks = async () => {
        setLoading(true);
        setError('');
        try {
            const response = await adminService.getAllTextbooks();
            setTextbooks(response);
            setFilteredTextbooks(response);
        } catch (err) {
            setError(err.response?.data?.error || 'Failed to fetch textbooks');
        } finally {
            setLoading(false);
        }
    };

    const handleSearch = () => {
        if (!searchQuery.trim()) {
            setFilteredTextbooks(textbooks);
            return;
        }

        const filtered = textbooks.filter(
            (textbook) =>
                textbook.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                textbook.author.toLowerCase().includes(searchQuery.toLowerCase()) ||
                textbook.isbn.toLowerCase().includes(searchQuery.toLowerCase())
        );
        setFilteredTextbooks(filtered);
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleCreateTextbook = async (e) => {
        e.preventDefault();
        try {
            setError('');
            if (!formData.isbn.trim() || !formData.name.trim() || !formData.author.trim()) {
                setError('ISBN, name, and author are required');
                return;
            }

            if (editingIsbn) {
                await adminService.updateTextbook(editingIsbn, {
                    name: formData.name,
                    author: formData.author,
                });
            } else {
                await adminService.createTextbook(formData);
            }

            setFormData({ isbn: '', name: '', author: '' });
            setShowForm(false);
            setEditingIsbn(null);
            await fetchTextbooks();
        } catch (err) {
            setError(err.response?.data?.error || 'Failed to save textbook');
        }
    };

    const handleEditTextbook = (textbook) => {
        setFormData({
            isbn: textbook.isbn,
            name: textbook.name,
            author: textbook.author,
        });
        setEditingIsbn(textbook.isbn);
        setShowForm(true);
    };

    const handleDeleteTextbook = async (isbn, textbookName) => {
        if (!window.confirm(`Are you sure you want to delete ${textbookName}?`)) {
            return;
        }

        try {
            await adminService.deleteTextbook(isbn);
            await fetchTextbooks();
        } catch (err) {
            setError(err.response?.data?.error || 'Failed to delete textbook');
        }
    };

    return (
        <div className="management-container">
            <div className="section-header-with-button">
                <h2>TextBook Management</h2>
                <button
                    className="btn-primary-large"
                    onClick={() => setShowForm(!showForm)}
                    disabled={loading}
                >
                    {showForm ? 'Cancel' : 'Add TextBook'}
                </button>
            </div>

            {!showForm && (
                <div className="search-box">
                    <input
                        type="text"
                        placeholder="Search textbooks by name, author, or ISBN..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="search-input"
                    />
                </div>
            )}

            {error && <div className="alert error">{error}</div>}

            {showForm && (
                <div className="form-container">
                    <h3>{editingIsbn ? 'Edit TextBook' : 'Create New TextBook'}</h3>
                    <form onSubmit={handleCreateTextbook}>
                        <div className="form-row">
                            <div className="form-group">
                                <label>ISBN *</label>
                                <input
                                    type="text"
                                    name="isbn"
                                    value={formData.isbn}
                                    onChange={handleInputChange}
                                    placeholder="ISBN"
                                    disabled={editingIsbn || loading}
                                />
                            </div>

                            <div className="form-group">
                                <label>TextBook Name *</label>
                                <input
                                    type="text"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleInputChange}
                                    placeholder="Textbook name"
                                    disabled={loading}
                                />
                            </div>
                        </div>

                        <div className="form-group">
                            <label>Author *</label>
                            <input
                                type="text"
                                name="author"
                                value={formData.author}
                                onChange={handleInputChange}
                                placeholder="Author name"
                                disabled={loading}
                            />
                        </div>

                        <div className="form-actions">
                            <button
                                type="submit"
                                className="btn-primary-large"
                                disabled={loading}
                            >
                                {loading ? 'Saving...' : editingIsbn ? 'Update TextBook' : 'Create TextBook'}
                            </button>
                        </div>
                    </form>
                </div>
            )}

            {loading && !showForm && <div className="loading">Loading textbooks...</div>}

            {!loading && filteredTextbooks.length === 0 ? (
                <div className="empty-state">
                    <p>{searchQuery ? 'No textbooks found' : 'Create your first textbook!'}</p>
                </div>
            ) : (
                <div className="cards-grid">
                    {filteredTextbooks.map(textbook => (
                        <div key={textbook.isbn} className="card">
                            <div className="card-header">
                                <h3>{textbook.name}</h3>
                            </div>
                            <div className="card-content">
                                <p><strong>ISBN:</strong> {textbook.isbn}</p>
                                <p><strong>Author:</strong> {textbook.author}</p>
                            </div>
                            <div className="card-actions">
                                <button
                                    className="btn-primary"
                                    onClick={() => handleEditTextbook(textbook)}
                                >
                                    Edit
                                </button>
                                <button
                                    className="btn-danger"
                                    onClick={() => handleDeleteTextbook(textbook.isbn, textbook.name)}
                                >
                                    Delete
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default TextBookManagement;
