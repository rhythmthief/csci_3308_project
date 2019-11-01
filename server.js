/* 
	TESTING CODE, EXPECT COMMENTS AT A LATER DATE
*/

const express = require('express');
let app = express();
const pug = require('pug');
app.set('view engine', 'pug');
app.use(express.static(__dirname + '/'));

const scripts_node = require('./resources/js/scripts_node.js');
console.log (scripts_node.generateJobs(5))

/* Database section */
//TBD

/* Declaring renderers
Query passes are to be restored later */
app.get('/signin', function (req, res) {
	res.render('pages/signin');
});

app.get('/main', function (req, res) {
	res.render('pages/main', {
		jobs: scripts_node.generateJobs(10)
	});
});

app.get('/', function (req, res) {
	res.render('pages/start_page')
});

app.get('/signupemployee', function (req, res) {
	res.render('pages/signupemployee');
});

app.get('/signupstudent', function (req, res) {
	res.render('pages/signupstudent');
});

app.listen(3000);
console.log('Listening to 3000');
