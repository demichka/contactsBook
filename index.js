const express = require('express');
const sass = require('node-sass');

const app = express();


sass.render({
    file: 'css/main.scss'
  }, function(err, result) { 'css/main.css'});


app.use(express.static('public'));
app.listen(3003,() => console.log('Welcome to ContactsBook on the port 3003'));