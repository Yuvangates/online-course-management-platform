import React, { useState } from 'react';
import '../styles/auth.css'; // Import the specific CSS for this page

const LoginPage = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log("Login Attempt:", { email, password });
        alert(`Login attempt for: ${email}`);
        // Later, we will send this data to the Backend API here
    };

    return (
        <div className="auth-container">
            <div className="auth-box">
                <h2>Welcome Back</h2>
                <p>Please sign in to your account</p>

                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label>Email Address</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="admin@university.edu"
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label>Password</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="••••••••"
                            required
                        />
                    </div>

                    <button type="submit" className="login-btn">Sign In</button>
                </form>

                <div className="auth-footer">
                    <p>Don't have an account? <span className="link">Contact Admin</span></p>
                </div>
            </div>
        </div>
    );
};

export default LoginPage;