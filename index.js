require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const app = express();
const bodyParser = require('body-parser');
const dns = require('dns');
const urlparser = require('url');

// Basic Configuration
const port = process.env.PORT || 3000;
mongoose.connect('mongodb+srv://admin:admin@cluster.hzg7klu.mongodb.net/test?retryWrites=true&w=majority', { useNewUrlParser: true, useUnifiedTopology: true });

const urlSchema = new mongoose.Schema({url: String});
var Url = mongoose.model('Url',urlSchema);

app.use(cors());

app.use('/public', express.static(`${process.cwd()}/public`));

app.get('/', function(req, res) {
  res.sendFile(process.cwd() + '/views/index.html');
});

app.use(bodyParser.urlencoded({ extended: false }));

// Your first API endpoint
app.post('/api/shorturl', (req,res)=>{
  let urlBody = req.body.url;

  dns.lookup(urlparser.parse(urlBody).hostname,
            (err, address)=>{
              if(!address){
                res.json({error:'invalid url'});
              }else{
                let urlPost = new Url({url:urlBody});
                urlPost.save((err, data)=> {
                  res.json({original_url: data.url,                     short_url: data.id});
                });
              }
            });
});

app.get('/api/shorturl/:id', function(req, res) {
  let id = req.params.id;
  Url.findById(id, (err,data)=>{
    if(!data){
      res.json({error:'invalid url'});
    }else{
      res.redirect(data.url);
    }
  });
});

app.listen(port, function() {
  console.log(`Listening on port ${port}`);
});
