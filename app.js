//load express
const express = require('express');
const app = express();
//load mysql (shundb)
const mysql = require('mysql');
//connection mysql
const connection = mysql.createConnection({
    host: 'us-cdbr-east-05.cleardb.net',
    user: 'b98b2809c9bb57',
    password: '1ae6227f',
    database: 'heroku_02b79c26b7117bd'
});
//server start
app.listen(3000, () => {
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

