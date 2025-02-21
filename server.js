const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const session = require('express-session');
const app = express();

const DocumentRequest = require('./models/DocumentRequest');
const User = require('./models/User');
app.use(express.static('public'));

const documentRequestRoutes = require('./routes/documentRequestRoutes');
const announcementRoutes = require('./routes/announcementRoutes');

mongoose.connect('mongodb://127.0.0.1:27017/mydatabase')
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connection error:', err));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(session({
  secret: 'your-secret-key',
  resave: false,
  saveUninitialized: false,
}));

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use('/api', documentRequestRoutes);
const dashboardRoutes = require('./routes/dashboardRoutes');

app.use('/api/documents', documentRequestRoutes);
app.use('/api/announcements', announcementRoutes);

app.use('/', dashboardRoutes);

const userRoutes = require('./routes/userRoutes');
const adminRoutes = require('./routes/adminRoutes');
app.use('/', userRoutes);
app.use('/', adminRoutes);

// Initialize the router here
const router = express.Router();

// Define the approval route here



// Use the router after defining routes
app.use('/api', router);

app.get('/', (req, res) => {
  res.redirect('/login');  // or res.render('login') if you prefer
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
