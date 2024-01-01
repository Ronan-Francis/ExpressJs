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
    const query = 'SELECT * FROM product'; // Replace with your actual query
    mysqlConnection.query(query, (error, results, fields) => {
        if (error) {
            return res.status(500).send('Error in database operation');
        }
        res.json(results);
    });
});


const Manager = require('./models/manager'); // Assuming you have a Manager model

app.get('/managers', (req, res) => {
    Manager.find({}, (error, managers) => {
        if (error) {
            return res.status(500).send('Error in database operation');
        }
        res.json(managers);
    });
});


app.post('/updateStore', (req, res) => {
    const { storeId, newInfo } = req.body; // Extract data from request body
    // SQL query to update store information
    // Implement the update logic here
});


app.delete('/deleteProduct/:id', (req, res) => {
    const productId = req.params.id;
    const query = 'DELETE FROM product WHERE id = ?';
    mysqlConnection.query(query, [productId], (error, results, fields) => {
        if (error) {
            return res.status(500).send('Error in database operation');
        }
        res.send('Product deleted successfully');
    });
});


app.post('/addManager', (req, res) => {
    const newManager = new Manager(req.body); // Assuming you have a Manager model
    newManager.save((error, manager) => {
        if (error) {
            return res.status(500).send('Error in database operation');
        }
        res.json(manager);
    });
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

