const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

const app = express();
const PORT = process.env.PORT || 8080;

const mongohost = process.env.MONGO_HOST || 'localhost'; // fixed typo
const mongoport = process.env.MONGO_PORT || '27017';

// ✅ Correct MongoDB connection string using template literals
const mongoURL = `mongodb://${mongohost}:${mongoport}/yourDatabaseName`;

// Connect to MongoDB
mongoose.connect(mongoURL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then(() => {
    console.log('Connected to MongoDB');
}).catch((err) => {
    console.error('MongoDB connection error:', err);
});

// Create a Mongoose model
const Email = mongoose.model('Email', {
    email: String,
});

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Routes
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
});

app.post('/add-email', async (req, res) => {
    const { email } = req.body;
    try {
        const newEmail = new Email({ email });
        await newEmail.save();
        res.redirect('/');
    } catch (error) {
        res.status(500).send('Error adding email');
    }
});

app.get('/emails', async (req, res) => {
    try {
        const emails = await Email.find({});
        res.json(emails);
    } catch (error) {
        res.status(500).send('Error fetching emails');
    }
});

app.get('/exit', (req, res) => {
    res.send('Server stopped');
    process.exit(0); // ⚠️ Not recommended for production
});

// Start server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
