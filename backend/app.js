const express = require('express');

const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const routes = require('./routes/routes');

const app = express();

const url = "mongodb://127.0.0.1:27017/endo"

mongoose.set('useUnifiedTopology', true);
mongoose.connect(url, {useNewUrlParser: true})
  .then(() => {
    console.log("Connected to db");
  })
  .catch(() => {
    console.log("Connection lost");
  });

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: false
}));



app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept');
  res.setHeader('Access-Control-Allow-Methods',
    'GET, POST, PATCH, PUT, DELETE, OPTIONS');


  next();
});

app.use("/endo/database", routes);

//app.get("/*", (req,res)=> res.sendFile(path.join(__dirname)));


module.exports = app;
