const express = require('express');
const bodyParser = require('body-parser');
app = express();
require("dotenv").config();


const connectDB = require("./db/connect");
const router = require('./routes/app.route')
const cors = require('cors')


app.use(bodyParser.json());
app.use(express.json());
app.use(cors());
app.use('/api', router);


const PORT = process.env.PORT;
const start = () => {
  try {
    connectDB(process.env.DB_URL);
    console.log("Connected to database");
    app.listen(PORT, () => console.log(`App listening on port ${PORT}...`));
  } catch (error) {
    console.log("unable to connect to database");
  }
};


start();


