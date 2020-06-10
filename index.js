const express = require('express');
const app = express();

const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const router = require('./router/api');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
dotenv.config();

app.use('/', router);

// Use Middlewares
app.use(cors());
app.use(bodyParser.json());
app.use(cookieParser());
app.use('/uploads', express.static('uploads'));

// Create connection to the database
mongoose.connect(
    process.env.DB_CONNECTION_STRING,
    { useNewUrlParser: true,
        useUnifiedTopology: true },
    () => { console.log('DB ready'); }
);

// PORT
const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log("Start listening at port: " + port);
});