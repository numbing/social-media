const express = require("express");
const mongoose = require('mongoose');

const users = require('./routes/api/users');
const profile = require('./routes/api/profile');
const posts = require('./routes/api/posts');

// DB config

const db = require('./config/key').mongoURI;

//connect to mongoDB
mongoose
    .connect(db)
    .then(() => console.log("MongoDB Connected "))
    .catch(err => console.log("something is wrong with mongoos", err));

const app = express();

app.get('/', (req, res) => res.send("hello"));
//use Routes

app.use('/api/users' , users);
app.use('/api/profile' , profile);
app.use('/api/posts', posts);

const port = process.env.PORT || 5000;

app.listen(port, () => console.log(`server is running on port${port}`));
