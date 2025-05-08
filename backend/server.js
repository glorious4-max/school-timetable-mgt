const express = require('express');
const cors = require('cors');
const pool = require('./db');
const app = express();

// Debug middleware to log all requests
app.use((req, res, next) => {
    console.log(`${new Date().toISOString()} ${req.method} ${req.url}`);
    console.log('Headers:', req.headers);
    console.log('Body:', req.body);
    next();
});

// Middleware configuration
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Basic routes
app.get('/', (req, res) => {
    res.json({ message: 'Server is running' });
});

app.post('/test', (req, res) => {
    res.json({ message: 'POST request works', body: req.body });
});

app.post('/login', async (req, res) => {
    console.log('Login attempt received:', req.body);
    try {
        const { username, password } = req.body;
        
        if (!username || !password) {
            return res.status(400).json({ message: 'Username and password are required' });
        }

        const result = await pool.query('SELECT * FROM users WHERE username = $1', [username]);
        console.log('Database result:', result.rows);
        
        if (result.rows.length === 0) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        const user = result.rows[0];
        if (password !== user.password) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        res.json({
            token: 'dummy-token',
            user: {
                username: user.username,
                role: user.role
            }
        });
    } catch (err) {
        console.error('Login error:', err);
        res.status(500).json({ message: 'Internal server error' });
    }
});

// Dashboard Statistics
app.get('/api/stats', async (req, res) => {
    try {
        const stats = await pool.query(`
            SELECT 
                (SELECT COUNT(*) FROM teachers) as teacher_count,
                (SELECT COUNT(*) FROM classes) as class_count,
                (SELECT COUNT(DISTINCT subject) FROM teachers) as subject_count,
                (SELECT COUNT(*) FROM timetable) as schedule_count
        `);
        res.json(stats.rows[0]);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Teacher Management
app.get('/api/teachers', async (req, res) => {
    try {
        const teachers = await pool.query(`
            SELECT t.*, 
                   (SELECT COUNT(*) FROM timetable WHERE teacher_id = t.id) as assigned_classes
            FROM teachers t
        `);
        res.json(teachers.rows);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

app.get('/api/teachers/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const teacher = await pool.query('SELECT * FROM teachers WHERE id = $1', [id]);
        
        if (teacher.rows.length === 0) {
            return res.status(404).json({ message: 'Teacher not found' });
        }
        
        const schedule = await pool.query(`
            SELECT t.*, c.name as class_name 
            FROM timetable t
            JOIN classes c ON t.class_id = c.id
            WHERE t.teacher_id = $1
            ORDER BY t.day_of_week, t.start_time
        `, [id]);
        
        res.json({
            ...teacher.rows[0],
            schedule: schedule.rows
        });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

app.post('/api/teachers', async (req, res) => {
    try {
        const { name, email, subject } = req.body;
        const newTeacher = await pool.query(
            'INSERT INTO teachers (name, email, subject) VALUES ($1, $2, $3) RETURNING *',
            [name, email, subject]
        );
        res.status(201).json(newTeacher.rows[0]);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

app.put('/api/teachers/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { name, email, subject } = req.body;
        const updatedTeacher = await pool.query(
            'UPDATE teachers SET name = $1, email = $2, subject = $3 WHERE id = $4 RETURNING *',
            [name, email, subject, id]
        );
        
        if (updatedTeacher.rows.length === 0) {
            return res.status(404).json({ message: 'Teacher not found' });
        }
        
        res.json(updatedTeacher.rows[0]);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

app.delete('/api/teachers/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const result = await pool.query('DELETE FROM teachers WHERE id = $1 RETURNING *', [id]);
        
        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'Teacher not found' });
        }
        
        res.json({ message: 'Teacher deleted successfully' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Class Management
app.get('/api/classes', async (req, res) => {
    try {
        const classes = await pool.query(`
            SELECT c.*, 
                   (SELECT COUNT(*) FROM timetable WHERE class_id = c.id) as total_subjects
            FROM classes c
            ORDER BY c.grade, c.name
        `);
        res.json(classes.rows);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

app.get('/api/classes/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const classData = await pool.query('SELECT * FROM classes WHERE id = $1', [id]);
        
        if (classData.rows.length === 0) {
            return res.status(404).json({ message: 'Class not found' });
        }
        
        const schedule = await pool.query(`
            SELECT t.*, tea.name as teacher_name, tea.subject
            FROM timetable t
            JOIN teachers tea ON t.teacher_id = tea.id
            WHERE t.class_id = $1
            ORDER BY t.day_of_week, t.start_time
        `, [id]);
        
        res.json({
            ...classData.rows[0],
            schedule: schedule.rows
        });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Timetable Management
app.get('/api/timetable', async (req, res) => {
    try {
        const timetable = await pool.query(`
            SELECT t.*, 
                   c.name as class_name, 
                   c.grade,
                   tea.name as teacher_name,
                   tea.subject
            FROM timetable t
            JOIN classes c ON t.class_id = c.id
            JOIN teachers tea ON t.teacher_id = tea.id
            ORDER BY t.day_of_week, t.start_time
        `);
        res.json(timetable.rows);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

app.post('/api/timetable', async (req, res) => {
    try {
        const { class_id, teacher_id, subject, day_of_week, start_time, end_time } = req.body;
        
        // Check for schedule conflicts
        const conflicts = await pool.query(`
            SELECT * FROM timetable 
            WHERE class_id = $1 
            AND day_of_week = $2 
            AND ((start_time, end_time) OVERLAPS ($3::time, $4::time))
        `, [class_id, day_of_week, start_time, end_time]);
        
        if (conflicts.rows.length > 0) {
            return res.status(400).json({ message: 'Schedule conflict detected' });
        }
        
        const newEntry = await pool.query(
            `INSERT INTO timetable (class_id, teacher_id, subject, day_of_week, start_time, end_time)
             VALUES ($1, $2, $3, $4, $5, $6) 
             RETURNING *`,
            [class_id, teacher_id, subject, day_of_week, start_time, end_time]
        );
        
        res.status(201).json(newEntry.rows[0]);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

app.put('/api/timetable/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { class_id, teacher_id, subject, day_of_week, start_time, end_time } = req.body;
        
        const updatedEntry = await pool.query(
            `UPDATE timetable 
             SET class_id = $1, teacher_id = $2, subject = $3, 
                 day_of_week = $4, start_time = $5, end_time = $6
             WHERE id = $7 
             RETURNING *`,
            [class_id, teacher_id, subject, day_of_week, start_time, end_time, id]
        );
        
        if (updatedEntry.rows.length === 0) {
            return res.status(404).json({ message: 'Timetable entry not found' });
        }
        
        res.json(updatedEntry.rows[0]);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

app.delete('/api/timetable/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const result = await pool.query('DELETE FROM timetable WHERE id = $1 RETURNING *', [id]);
        
        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'Timetable entry not found' });
        }
        
        res.json({ message: 'Timetable entry deleted successfully' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

const PORT =5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});