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
    const query = 'SELECT * FROM store'; 
    mysqlConnection.query(query, (error, results, fields) => {
        if (error) {
            return res.status(500).send('Error in database operation');
        }
        res.json(results);
    });
});


app.get('/products', (req, res) => {
    mysqlConnection.query('SELECT * FROM product', (err, results, fields) => {
      if (err) {
        res.status(500).send('Error retrieving data from database');
        return;
      }
      res.json(results);
    });
  });


const managerSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    _id: {
        type: String,
        required: true,
        unique: true
    },
    salary: {
        type: Number,
        required: true
    },
    // Add more fields as necessary
});

const Manager = mongoose.model('Manager', managerSchema);


app.get('/managers', async (req, res) => {
    try {
        const managers = await Manager.find({});
        res.json(managers);
    } catch (error) {
        res.status(500).send('Error in database operation');
    }
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

