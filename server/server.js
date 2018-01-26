const express = require("express");
const path = require("path");
const app = express();
const bodyParser = require('body-parser');
const port = process.env.PORT || 8000;
const cors = require('cors')
const fileUpload = require('express-fileupload');
app.use(bodyParser.json({ extended: true }));
app.use(bodyParser.urlencoded({ extended: true }));

app.use(fileUpload());
app.use(cors());
app.set('view engine', 'ejs');

var routes_setter = require('./config/routes.js');
routes_setter(app);

app.use(function(req,res) {
  res.send('404')
})

app.listen(port, function() {
  console.log('Listening on', port);
});
