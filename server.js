const express = require('express');
const mysql = require('mysql');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const path = require('path');

// Set up Express
const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// MySQL Connection
const mysqlConnection = mysql.createConnection({
    host: 'localhost',
    user: 'your_username',
    database: 'proj2023'
});

mysqlConnection.connect(err => {
    if (err) {
        console.error('Error connecting to MySQL: ' + err.stack);
        return;
    }
    console.log('Connected to MySQL as ID ' + mysqlConnection.threadId);
});

// MongoDB Connection
mongoose.connect('mongodb://localhost/proj2023MongoDB')
    .then(() => console.log('MongoDB connected...'))
    .catch(err => console.error('MongoDB connection error:', err));

// Define Routes
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'index.html'));
});

app.get('/stores', (req, res) => {
    const query = 'SELECT * FROM store'; // Replace with your actual query
    mysqlConnection.query(query, (error, results, fields) => {
        if (error) {
            return res.status(500).send('Error in database operation');
        }
        res.json(results);
    });
});


app.get('/products', (req, res) => {
    // MySQL query to get products data
});

app.get('/managers', (req, res) => {
    // MongoDB query to get managers data
});

app.post('/updateStore', (req, res) => {
    // Code to update store information
});

app.delete('/deleteProduct/:id', (req, res) => {
    // Code to delete a product
});

app.post('/addManager', (req, res) => {
    // Code to add a new manager to MongoDB
});

// Error Handling
app.use((req, res, next) => {
    res.status(404).send("Sorry, can't find that!");
});

// Start the Server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

