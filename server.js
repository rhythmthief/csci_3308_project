/* 
	TESTING CODE, EXPECT COMMENTS AT A LATER DATE
*/

const express = require('express'); // Add the express framework has been added
let app = express();
const pug = require('pug');

// const pgp = require('pg-promise')(); //db connection

// const dbConfig = {
// 	host: 'localhost',
// 	port: 5432,
// 	database: 'db',
// 	user: 'postgres',
// 	password: '*****'
// };

// let db = pgp(dbConfig);

app.set('view engine', 'pug');
app.use(express.static(__dirname + '/'));

app.get('/main', function (req, res) {
	var query = ';';
	db.any(query)
		.then(function (rows) {
			res.render('pages/main', {
				my_title: "Home Page",
				data: rows,
				color: '',
				color_msg: ''
			})
		})
		.catch(function (err) {
			// display error message in case an error
			req.flash('error', err); //if this doesn't work for you replace with console.log
			res.render('pages/main', {
				title: 'Home Page',
				data: '',
				color: '',
				color_msg: ''
			})
		})
});

app.listen(3000);
console.log('Listening to 3000');
