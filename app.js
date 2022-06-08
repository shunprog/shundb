//load express
const express = require('express');
const app = express();
//load mysql (shundb)
const mysql = require('mysql');
//load env 
require('dotenv').config()
//connection mysql
const connection = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME
});
//Connection status to DB
connection.connect(function(err) {   
    if (err) throw err;
    console.log("Connected!");
  });
//server start
app.listen(process.env.PORT || 3000, () => {
    console.log("Server running");
});

app.use(express.static('public'));
//receivable sent value from form
app.use(express.urlencoded({extended: false}));

//render top
app.get('/', (req, res) => {
    res.render('top.ejs');
});

//render listPage
app.get('/index', (req, res) => {
    connection.query(
        'SELECT * FROM mydata',
        (error, results) => {
            console.log(results);
            res.render('index.ejs', {items: results});
        }
    );
});

//render dataAddPage
app.get('/new', (req, res) => {
    res.render('new.ejs');
});

//post newData
app.post('/create', (req, res) => {
    connection.query(
        'INSERT INTO mydata(name) VALUES(?)',
        [req.body.itemName],
        (error, results) => {
        res.redirect('/index');   
    });
});

//delete SelectData
app.post('/delete/:id', (req, res) => {
    connection.query(
        'DELETE FROM mydata WHERE id=?',
        [req.params.id],
        (error, results) => {
            res.redirect('/index');
        }
    );
});

//render editData page
app.get('/edit/:id', (req, res) => {
    connection.query(
        'SELECT * FROM mydata WHERE id=?',
        [req.params.id],
        (error, results) => {
            res.render('edit.ejs', {item: results[0]});
        }
    );
});

//post update data
app.post('/update/:id', (req, res) => {
    connection.query(
        'UPDATE mydata SET name=? WHERE id=?',
        [req.body.itemName, req.params.id],
        (error, results) => {
            res.redirect('/index');
        });
});

process.env.HEROKUURL;

