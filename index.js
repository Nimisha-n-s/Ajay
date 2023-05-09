const fs = require('fs'); // provides an API for working with the file system
const http = require('http'); // provides a way to create HTTP servers
const express = require('express'); // provides a web application framework for Node.js
const path = require('path'); // provides a set of utilities for working with file and directory paths
const colors = require('colors')
const app = express(); // Creating an instance of the Express application
const { log } = require('@ajayos/nodelogger')
const bodyParser = require('body-parser');
const { v4: uuidv4 } = require('uuid');
const { setDB, getDB, deleteDB } = require('@ajayos/nodedb');




const server = http.createServer(app); // Creating an HTTP server using the Express app
// Start a server listening on port 1122 and log a message when the server starts
server.listen(3000, log('Server started at port 3000 => http://127.0.0.1:3000'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.get('/', function (req, res) {
    res.sendFile(path.join(__dirname, '/Public', '/index.html'))
 });

app.get('/home', function (req, res) {
   res.sendFile(path.join(__dirname, '/Public', '/home.html'))
});
app.get('/login', function(req, res) {
    res.sendFile(path.join(__dirname, '/Public', '/login.html'))
})
app.get('/admin', function (req, res) {
    res.sendFile(path.join(__dirname, '/Public', '/admin.html'))
});
app.get('/editnews', function (req, res) {
    res.sendFile(path.join(__dirname, '/Public', '/editnews.html'))
});
app.get('/addnews', function (req, res) {
    res.sendFile(path.join(__dirname, '/Public', '/addnews.html'))
});


app.post('/getnews', async function (req, res) {
    res.set('Content-Type', 'application/json');
    const blogData = [
        {
          imgSrc: 'images/slider/bangcok.jpg',
          author: 'ERROR',
          date: 'Today',
          title: 'Lorem ipsum dolor consectetur',
          content: 'Lorem ipsum dolor sit amet consectetur, adipisicing elit. Ut natus, deserunt deleniti sapiente omnis ab quas mollitia! Cumque, maxime at.',
        }
      ];
    var data = await getDB('Newss');

    if (data) {
        var mm = []
        for (var i = 0; i < data.length; i++) {
            mm.push(data[i].data)
        }
        res.json({ status: 'ok', data: mm, id: data[0].id});
    } else {
        res.json({ status: 'no', data: blogData})
    }
    //res.json(blogData)
});
app.post('/getnewsbyid', async function (req, res) {
    res.set('Content-Type', 'application/json');
   var data = await getDB('Newss', req.body.id);
    if (data) {
        var datad = { author: data.author, date: data.date, title: data.title, content: data.content, imgSrc: data.imgSrc, id: data.id}
        res.json({ status: 'ok', data: datad});
    } else {
        var data = { author: ' ', date: '', title: '', content: '', imgSrc: '', id: req.body.id };
        res.json({ status: 'no', data: data})
    }
});


// create table for insert news
app.post('/createnews', async function (req, res) {
    const { imgSrc, author, date, title, content } = req.body;
    const uniqueId = uuidv4();
    await setDB('Newss', uniqueId, { imgSrc, author, date, title, content, id: uniqueId });
    res.json({ status: 'ok', message: 'News Created' })
});
app.post('/editnews', async function (req, res) {
    const { id, imgSrc, author, date, title, content } = req.body;
    await setDB('Newss', id, { imgSrc, author, date, title, content, id });
    res.json({ status: 'ok', message: 'News Updated' })
})
app.post('/deletenews', async function (req, res) {
    const { id } = req.body;
    await deleteDB('Newss', id);
    res.json({ status: 'ok', message: 'News Deleted' })
})
app.post('/login', async function (req, res) {
    const { username, password } = req.body;
    if (username && password) {
        var db = await getDB('Auth', username);
        if(db && db.password == password) {
            res.json({ status: 'ok', message: 'Login Success' })
        } else {
            res.json({ status: 'error', message: 'Login Failed' })
        }
    } else {
        res.json({ status: 'error', message: 'Login Failed' })
    }
});
app.use(express.static(path.join(__dirname, '/Public'))); // Serving static files in Express
app.get('*', function (req, res) {
    res.status(404).send('404 - PAGE NOT FOUND')
})
app.get('/kkkk', function (req, res) {
    res.send("hello");
})