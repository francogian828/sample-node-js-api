/*
Node.js is built on an event-driven, non-blocking I/O model, which allows it to 
handle a large number of concurrent requests efficiently. 
The non-blocking nature means that I/O operations (such as reading files, 
querying a database, etc.) don’t block the execution of other code.

Express.js is a minimal and flexible Node.js web application framework that 
provides a robust set of features to build web servers.
*/

// server.js
const express = require('express');
const mongoose = require('mongoose');

// Initialize Express
const app = express();

// Middleware to parse JSON
app.use(express.json());

// Connect to MongoDB
mongoose.connect('mongodb+srv://francogiandecastro:Franco123@nodetest.8czs1.mongodb.net/sample_database')
.then(() => console.log('MongoDB connected'))
.catch(err => console.error('MongoDB connection error:', err));

// Define Mongoose schema and model for users
const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    age: { type: Number, min: 18, required: true },
    email: { type: String, required: true, match: /.+\@.+\..+/ }
});

const User = mongoose.model('User', userSchema);

// CRUD Operations

// Create User (POST)
app.post('/users', async (req, res) => {
    try {
        const user = new User(req.body);
        await user.save();
        res.status(201).send(user);
    } catch (error) {
        res.status(400).send({ error: 'Invalid data' });
    }
});

// Read all Users (GET)
app.get('/users', async (request, result) => {
    try {
        const users = await User.find();
        result.send(users);
    } catch (error) {
        result.status(500).send({ error: 'Failed to fetch users' });
    }
});

// Read a single User by ID (GET)
app.get('/users/:id', async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) return res.status(404).send({ error: 'User not found' });
        res.send(user);
    } catch (error) {
        res.status(500).send({ error: 'Failed to fetch user' });
    }
});

// Update User (PUT)
app.put('/users/:id', async (req, res) => {
    try {
        const user = await User.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
        if (!user) return res.status(404).send({ error: 'User not found' });
        res.send(user);
    } catch (error) {
        res.status(400).send({ error: 'Failed to update user' });
    }
});

// Delete User (DELETE)
app.delete('/users/:id', async (req, res) => {
    try {
        const user = await User.findByIdAndDelete(req.params.id);
        if (!user) return res.status(404).send({ error: 'User not found' });
        res.send({ message: 'User deleted successfully' });
    } catch (error) {
        res.status(500).send({ error: 'Failed to delete user' });
    }
});

// Start the server
app.listen(3000, () => {
    console.log('Server is running on http://localhost:3000');
});
