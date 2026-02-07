import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import authService from '../api/authService';
import Navbar from '../components/Navbar';
import '../styles/auth.css';

const LoginPage = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const navigate = useNavigate();
    const { login } = useAuth();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const response = await authService.login(email, password);
            
            if (response.token && response.user) {
                login(response.token, response.user);
                
                const redirectPath = response.user.role === 'Student' 
                    ? '/student/dashboard'
                    : response.user.role === 'Instructor'
                    ? '/instructor/dashboard'
                    : response.user.role === 'Admin'
                    ? '/admin/dashboard'
                    : response.user.role === 'Analyst'
                    ? '/analyst/dashboard'
                    : '/';
                
                navigate(redirectPath);
            } else {
                setError('Invalid response from server');
            }
        } catch (err) {
            setError(err.response?.data?.error || 'Login failed. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            <Navbar />
            <div className="auth-container">
                <div className="auth-box">
                    <h2>Welcome Back</h2>
                    <p>Please sign in to your account</p>

                    {error && <div className="auth-error">{error}</div>}

                    <form onSubmit={handleSubmit}>
                        <div className="form-group">
                            <label>Email Address</label>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                disabled={loading}
                            />
                        </div>

                        <div className="form-group">
                            <label>Password</label>
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                disabled={loading}
                            />
                        </div>

                        <button type="submit" className="login-btn" disabled={loading}>
                            {loading ? 'Signing in...' : 'Sign In'}
                        </button>
                    </form>

                    <div className="auth-footer">
                        <p>Don't have an account? <Link to="/register" className="link">Sign Up Here</Link></p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LoginPage;
