/* 
	TESTING CODE, EXPECT COMMENTS AT A LATER DATE
*/

const express = require('express');
let app = express();
const pug = require('pug');
app.set('view engine', 'pug');
app.use(express.static(__dirname + '/'));

/* Database section */
//TBD

/* Declaring renderers
Query passes are to be restored later */
app.get('/signin', function (req, res) {
	res.render ('pages/signin')
});

app.get('/main', function (req, res) {
	res.render ('pages/main')
});

app.get('/', function(req,res){
	res.render('pages/start_page')
});

app.get('/signin', function(req,res){
	res.render('pages/signin')
});

app.get('/signupemployee', function(req,res){
	res.render('pages/signupemployee')
});

app.get('/signupstudent', function(req,res){
	res.render('pages/signupstudent')
});

app.listen(3000);
console.log('Listening to 3000');
