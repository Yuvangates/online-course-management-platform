const express = require('express');
const router = express.Router();
const queries = require('../db/queries');

// GET /api/admin/dashboard - Get admin dashboard
router.get('/dashboard', async (req, res) => {
    try {
        // Will require auth middleware
        res.status(501).json({ message: 'Dashboard endpoint coming after auth' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// GET /api/admin/users - Get all users
router.get('/users', async (req, res) => {
    try {
        // Will require auth middleware and admin role check
        res.status(501).json({ message: 'Users endpoint coming after auth' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// GET /api/admin/students - Get all students
router.get('/students', async (req, res) => {
    try {
        const students = await queries.getAllStudents();
        res.status(200).json(students);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// GET /api/admin/instructors - Get all instructors
router.get('/instructors', async (req, res) => {
    try {
        const instructors = await queries.getAllInstructors();
        res.status(200).json(instructors);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// POST /api/admin/users/:id/delete - Delete a user
router.post('/users/:id/delete', async (req, res) => {
    try {
        // Will require auth middleware and admin role check
        res.status(501).json({ message: 'Delete user endpoint coming after auth' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
