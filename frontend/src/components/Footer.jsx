import React from 'react';

const Footer = () => {
    const style = {
        textAlign: 'center',
        padding: '1.5rem',
        backgroundColor: '#333',
        color: '#fff',
        marginTop: 'auto', // Pushes footer to bottom if page is short
        position: 'relative',
        bottom: 0,
        width: '100%',
        boxSizing: 'border-box'
    };

    return (
        <footer style={style}>
            <p>&copy; 2026 Online Course Management Platform. All rights reserved.</p>
        </footer>
    );
};

export default Footer;