require("dotenv").config();
const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");

const app = express();
const port = process.env.PORT;

app.use(cors());
app.use(express.json());

const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

db.connect(err => {
  if (err) {
    console.error('Database connection failed: ' + err.stack);
    return;
  }
  console.log('Connected to database.');
});

// Register or log in a user
app.post('/login', (req, res) => {
  const { firebaseUid, email } = req.body;
  
  // Check if user exists
  const checkUserSql = 'SELECT id, username FROM users WHERE firebase_uid = ?';
  db.query(checkUserSql, [firebaseUid], (err, results) => {
    if (err) return res.status(500).send(err);

    if (results.length > 0) {
      // User exists, return user data
      return res.json(results[0]);
    } else {
      // User does not exist, register them
      const username = email.split('@')[0];
      const registerUserSql = 'INSERT INTO users (firebase_uid, email, username) VALUES (?, ?, ?)';
      db.query(registerUserSql, [firebaseUid, email, username], (err, results) => {
        if (err) return res.status(500).send(err);
        res.json({ id: results.insertId, username });
      });
    }
  });
});

// Get events for a user
app.get('/events', (req, res) => {
  const userId = req.query.userId;
  const sql = `
    SELECT 
      id,
      user_id,
      title,
      DATE_FORMAT(date, '%Y-%m-%d') as date,
      TIME_FORMAT(time, '%H:%i') as time,
      description,
      link
    FROM events 
    WHERE user_id = ?
    ORDER BY date ASC, time ASC`;
  
  db.query(sql, [userId], (err, results) => {
    if (err) {
      console.error('Error fetching events:', err);
      return res.status(500).send(err);
    }
    res.json(results);
  });
});

// Create a new event
app.post('/events', (req, res) => {
  const { userId, title, date, time, description, link } = req.body;
  
  // Validate required fields
  if (!userId || !title || !date || !time) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  const sql = `
    INSERT INTO events 
    (user_id, title, date, time, description, link) 
    VALUES (?, ?, ?, ?, ?, ?)`;

  db.query(sql, [userId, title, date, time, description, link], (err, results) => {
    if (err) {
      console.error('Error creating event:', err);
      return res.status(500).send(err);
    }
    
    // Return the created event ID
    res.json({ 
      id: results.insertId,
      message: 'Event created successfully' 
    });
  });
});

// Update an event
app.put('/events/:id', (req, res) => {
  const eventId = req.params.id;
  const { title, date, time, description, link } = req.body;

  // Validate required fields
  if (!title || !date || !time) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  const sql = `
    UPDATE events 
    SET 
      title = ?,
      date = ?,
      time = ?,
      description = ?,
      link = ?
    WHERE id = ?`;

  db.query(sql, [title, date, time, description, link, eventId], (err, results) => {
    if (err) {
      console.error('Error updating event:', err);
      return res.status(500).send(err);
    }

    if (results.affectedRows === 0) {
      return res.status(404).json({ error: 'Event not found' });
    }

    res.json({ 
      message: 'Event updated successfully',
      eventId: eventId 
    });
  });
});

// Delete an event
app.delete('/events/:id', (req, res) => {
  const eventId = req.params.id;

  const sql = 'DELETE FROM events WHERE id = ?';
  
  db.query(sql, [eventId], (err, results) => {
    if (err) {
      console.error('Error deleting event:', err);
      return res.status(500).send(err);
    }

    if (results.affectedRows === 0) {
      return res.status(404).json({ error: 'Event not found' });
    }

    res.json({ 
      message: 'Event deleted successfully',
      eventId: eventId 
    });
  });
});

// Get a specific event
app.get('/events/:id', (req, res) => {
  const eventId = req.params.id;
  
  const sql = `
    SELECT 
      id,
      user_id,
      title,
      DATE_FORMAT(date, '%Y-%m-%d') as date,
      TIME_FORMAT(time, '%H:%i') as time,
      description,
      link
    FROM events 
    WHERE id = ?`;

  db.query(sql, [eventId], (err, results) => {
    if (err) {
      console.error('Error fetching event:', err);
      return res.status(500).send(err);
    }

    if (results.length === 0) {
      return res.status(404).json({ error: 'Event not found' });
    }

    res.json(results[0]);
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ 
    error: 'Something went wrong!',
    message: err.message 
  });
});

// Handle 404 errors
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// Start the server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  db.end();
  process.exit(0);
});

process.on('SIGINT', () => {
  db.end();
  process.exit(0);
});
