// Starting point of application
const express = require('express');
const http = require('http');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const app = express();
const router = require('./router');
const mongoose = require('mongoose');

// DB Setup
mongoose.connect('mongodb://localhost:auth/auth');

// App Setup -- express setup. //

// middleware
app.use(morgan('combined')); // logging framework
app.use(bodyParser.json({ type: '*/*' }));

// hook up our router
router(app);


// Server Setup -- communicate with world. //
const port = process.env.PORT || 3090;
const server = http.createServer(app);
server.listen(port);
console.log("Server listening on localhost:"+port);
