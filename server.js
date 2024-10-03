const express = require('express');
const mysql = require('mysql');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 5004;

// Middleware to parse incoming JSON requests
app.use(bodyParser.json());
app.use(cors()); // Enable CORS for cross-origin requests

// MySQL database connection
const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'autozaries'
});

// Connect to the database
connection.connect((err) => {
  if (err) {
    console.error('Error connecting to the database:', err);
    return;
  }
  console.log('Connected to MySQL database');
});

// Serve static files from the 'public' directory
app.use(express.static(path.join(__dirname)));

// Serve the homepage.html on the root URL
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'homepage.html'));  // Serve the HTML file
});

// Handle user registration (POST /registration)
app.post('/registration', (req, res) => {
  const { email, password } = req.body;

  // Trim whitespace
  const trimmedEmail = email.trim().toLowerCase();
  const trimmedPassword = password.trim();

  if (!trimmedEmail || !trimmedPassword) {
    return res.status(400).json({ message: 'Missing required fields' });
  }

  // Check if the user already exists
  const checkUserQuery = 'SELECT * FROM users WHERE email = ?';
  connection.query(checkUserQuery, [trimmedEmail], (err, result) => {
    if (err) {
      console.error('Database query error:', err);
      return res.status(500).json({ message: 'Database query error' });
    }

    if (result.length > 0) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Insert new user into the database with plain password
    const insertUserQuery = 'INSERT INTO users (email, password) VALUES (?, ?)';
    connection.query(insertUserQuery, [trimmedEmail, trimmedPassword], (err, result) => {
      if (err) {
        console.error('Error registering user:', err);
        return res.status(500).json({ message: 'Error registering user' });
      }
      console.log('User registered:', trimmedEmail); // Debug log
      return res.status(200).json({ message: 'User registered successfully' });
    });
  });
});

// Handle login (POST /login)
app.post('/login', (req, res) => {
  const { email, password } = req.body;

  // Trim whitespace
  const trimmedEmail = email.trim().toLowerCase();
  const trimmedPassword = password.trim();

  if (!trimmedEmail || !trimmedPassword) {
    return res.status(400).json({ message: 'Email and password are required.' });
  }

  console.log(`Attempting login with Email: ${trimmedEmail}`); // Debug log

  // Check if the user exists
  const loginQuery = 'SELECT * FROM users WHERE email = ? AND password = ?';
  connection.query(loginQuery, [trimmedEmail, trimmedPassword], (err, result) => {
    if (err) {
      console.error('Database query error:', err);
      return res.status(500).json({ message: 'Database query error' });
    }

    console.log('Query Result:', result);  // Log query result for debugging

    if (result.length === 0) {
      console.log('Login failed: Invalid email or password'); // Debug log
      return res.status(400).json({ message: 'Invalid email or password' });
    }

    console.log('Login successful for:', trimmedEmail); // Debug log
    return res.status(200).json({ message: 'Login successful' });
  });
});

// Fallback route for undefined endpoints
app.use((req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});