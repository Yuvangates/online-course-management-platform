import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import authService from '../api/authService';
import '../styles/auth.css';

const LoginPage = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [errorTimeout, setErrorTimeout] = useState(null);
    const navigate = useNavigate();
    const { login } = useAuth();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        // Clear any previous error timeout
        if (errorTimeout) {
            clearTimeout(errorTimeout);
            setErrorTimeout(null);
        }

        try {
            const response = await authService.login(email, password);
            console.log('Login response:', response);
            
            if (response.token && response.user) {
                console.log('Login successful, storing credentials');
                setError(''); // Clear any errors on successful login
                login(response.token, response.user);
                
                // Use setTimeout to ensure state is updated before navigation
                setTimeout(() => {
                    const redirectPath = response.user.role === 'Student' 
                        ? '/student/dashboard'
                        : response.user.role === 'Instructor'
                        ? '/instructor/dashboard'
                        : response.user.role === 'Admin'
                        ? '/admin/dashboard'
                        : response.user.role === 'Analyst'
                        ? '/analyst/dashboard'
                        : '/';
                    
                    console.log('Redirecting to:', redirectPath);
                    navigate(redirectPath);
                }, 100);
            } else {
                const errorMsg = 'Invalid response from server';
                setError(errorMsg);
                // Keep error visible for 5 seconds
                const timeout = setTimeout(() => setError(''), 5000);
                setErrorTimeout(timeout);
            }
        } catch (err) {
            console.error('Login error:', err);
            const errorMsg = err.response?.data?.error || 'Login failed. Please try again.';
            setError(errorMsg);
            // Keep error visible for 5 seconds
            const timeout = setTimeout(() => setError(''), 5000);
            setErrorTimeout(timeout);
        } finally {
            setLoading(false);
        }
    };

    return (
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
    );
};

export default LoginPage;