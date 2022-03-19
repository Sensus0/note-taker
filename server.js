const fs = require('fs')
const path = require('path');
const express =require('express');
const PORT = 3001;
const app = express();
const uniqid = require('uniqid');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

app.get('/notes', (req, res) => {
    res.sendFile(path.join(__dirname, './public/notes.html'))
})

app.get('/api/notes', (req, res) => {
    console.log('in get route')
    fs.readFile('./db/db.json', (err, results) => {
        if (err) {
            throw err
        } else {
            res.send(results)
        }

    })
})

app.post('/api/notes', (req, res) => {
    console.log(req.body)
    var newNotes = req.body
    newNotes.id = uniqid();
    fs.readFile('./db/db.json', (err, results) => {
        if (err) {
            throw err
        } else {
            console.log('this is before', results)
            var oldList = JSON.parse(results)
            console.log('before the push', oldList)
            oldList.push(newNotes)
            console.log('after the push', oldList)
            fs.writeFile('./db/db.json', JSON.stringify(oldList), (err) => {
                if (err) {
                    throw err
                } else {
                    res.send(newNotes)
                }
            })
        } 
    })
})
// defeault route that brings page to index (home page)
app.get('*', (req, res) => {
    console.log('in the default route')
    res.sendFile(path.join(__dirname, './public/index.html'))
})

app.listen(PORT, () => {
    console.log('Server is running!', PORT)
})

