const fs = require('fs');
const path = require('path');
const pool = require('./config/db');

const seedDatabase = async () => {
    try {
        // Read the SQL file
        const sqlPath = path.join(__dirname, 'db', 'insertData.sql');
        const sql = fs.readFileSync(sqlPath, 'utf8');

        console.log('Seeding database...');
        
        // Execute the SQL
        await pool.query(sql);
        
        console.log('Database seeded successfully!');
    } catch (err) {
        console.error('Error seeding database:', err);
    } finally {
        await pool.end();
    }
};

seedDatabase();