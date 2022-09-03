require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const app = express();
const bodyParser = require('body-parser');

// Basic Configuration
const port = process.env.PORT || 3000;

app.use(cors());

app.use('/public', express.static(`${process.cwd()}/public`));

app.get('/', function(req, res) {
  res.sendFile(process.cwd() + '/views/index.html');
});

app.use(bodyParser.urlencoded({ extended: false }));

// Your first API endpoint
app.get('/api/hello', function(req, res) {
  res.json({ greeting: 'hello API' });
});

app.post('/api/shorturl', (req,res)=>{
  let url = req.body.url;
  const regex = '/^https:/';
  console.log(url);
  if(url.toString().match(regex) === null){
    return res.json({error:'invalid url'});
  }
  return res.json({ original_url: url, short_url: 1});
})
app.listen(port, function() {
  console.log(`Listening on port ${port}`);
});
