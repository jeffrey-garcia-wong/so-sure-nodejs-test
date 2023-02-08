// Loads the configuration from config.env to process.env
require('dotenv').config({ path: './config.env' });

const express = require("express");
const http = require('http');
const dbo = require('./db/conn');

const app = express();
app.use(express.json());
app.use(require('./routes/api'));

const PORT = 1234;
app.set('port', PORT);

dbo.connectDB((err) => {
    if (err) {
      console.error(err);
      process.exit(1);
    }

    const server = http.createServer(app);
    server.listen(PORT, () => {
      console.log(`Server is running on port: ${PORT}`);
    });
});