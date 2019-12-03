/* Arbonsi server file */

const express = require('express');
let app = express();
const pug = require('pug');
app.set('view engine', 'pug');
app.use(express.static(__dirname + '/'));

//Create Database Connection
const pgp = require('pg-promise')();


/* 
	NOTES
	
		- Change the password in dbConfig to your current postgres password (it's under Lab_Website 3). The password has to be DISPOSABLE, don't commit personal passwords
*/

const dbConfig = {
	host: 'localhost',
	port: 5432,
	database: 'arbonsi_db',
	user: 'postgres',
	password: 'J74?vW'
};

let db = pgp(dbConfig);


//Serverside scripts
//const scripts_node = require('./resources/js/scripts_node.js');

/* Declaring renderers
Query passes are to be restored later */
app.get('/signin', function (req, res) {
	res.render('pages/signin');
});

/* Main page request */
app.get('/main', function (req, res) {

	query = "SELECT * FROM jobListing_preview;"

	db.any(query)
	.then(function (rows) {
		// console.log(rows)
		console.log("main")
		res.render('pages/main', {
			mode: 0,
			jobs: rows,
		})
	})
	.catch(function (err) {
		// Displays error message in case an error
		res.render('pages/main', {
			mode: 0,
			jobs: ''
		})
	})
});

app.get('/main/view', function (req, res) {
	var job_id = req.query.job_id;

	query = "SELECT * FROM jobListing_full WHERE id=" + job_id + ";"

	db.any(query)
	.then(function (rows) {
		// console.log(rows)
		console.log("main/view")
		res.render('pages/main', {
			mode: 1,
			my_title: "Main Page",
			focusedJob: rows,
		})
	})
	.catch(function (err) {
		// Displays error message in case an error
		res.render('pages/main', {
			mode: 1,
			title: 'Main Page',
			focusedJob: ''
		})
	})
});

app.get('/', function (req, res) {
	res.render('pages/start_page')
});

app.get('/signup_employer', function (req, res) {
	res.render('pages/signup_employer');
});

app.get('/signup_student', function (req, res) {
	res.render('pages/signup_student');
});

app.listen(3000);
console.log('Listening to 3000');
