/* Arbonsi server file */

const express = require('express');
let app = express();
const pug = require('pug');
app.set('view engine', 'pug');
app.use(express.static(__dirname + '/'));
const bodyParser = require('body-parser'); // Add the body-parser tool has been added
app.use(bodyParser.json());              // Add support for JSON encoded bodies
app.use(bodyParser.urlencoded({ extended: true })); // Add support for URL encoded bodies


//Create Database Connection
const pgp = require('pg-promise')();

/* 
	NOTES
		- Change the password in dbConfig to your current postgres password (it's under Lab_Website 3). The password has to be DISPOSABLE, don't commit personal passwords

		- At the moment our server can't handle authentication, so student 1 and employer 1 are defaults for respective profiles
*/

const dbConfig = {
	host: 'localhost',
	port: 53945,
	database: 'arbonsi_db',
	user: 'postgres',
	password: '123456'
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

/* sign in page */
app.post('/login',function(req,res){
	var username = req.body.username;
  var password = req.body.password;
	//console.log(username)
	//console.log(password)
	query = "select usertype,userid from login_info where username='" + username +"' and password = '" +password +"' ;"
	db.any(query)
		.then(function(rows) {
			if(rows.length == 1){
				//if info inerted was match with the database record
				var usertype = rows[0].usertype;
				var userid = rows[0].userid;
				//usertype = 1 represent as student, then user_id is student_table's key [student_id]
				//usertype = 2 represent as employer, then user_id is employer's key [employer]
				console.log(rows[0])
				if(usertype == '1' ){
					query_student = "SELECT * FROM students WHERE student_id="+userid+";"
					query_jobs = "SELECT * FROM job INNER JOIN students ON job.id=ANY(students.accepted_jobs) WHERE students.student_id="+userid+";"

					db.task('get-everything', task => {
						return task.batch([
							task.any(query_student),
							task.any(query_jobs),
						]);
					})
						.then(data => {
							//console.log(data[1][0])
							res.render('pages/student_profile', {
								data_student: data[0][0],
								data_jobs: data[1]
							})
						})
				}else{
					query_employer = "SELECT * FROM employers WHERE employer_id="+userid+";"
					
					db.task('get-everything', task => {
						return task.batch([
							task.any(query_employer),							
						]);
					})
						.then(data => {
							res.render('pages/employer_profile', {
								query_employer: data[0][0],
							})
						})
				}
				/*res.render('pages/main',{
					mode: 0,
					jobs: ''
					})*/
			}else {
				//if the info don't match, then send massage to user 
				res.render('pages/signin',{
					//�����Լ�д
				})
				
			}
		})
		.catch(function(err){
			console.log(err)
			//TODO
		})
});

/* Main page */
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

/* Student profile page */
app.get('/student_profile', function (req, res) {
	query_student = "SELECT * FROM students WHERE id=1;"
	query_jobs = "SELECT * FROM job INNER JOIN students ON job.id=ANY(students.accepted_jobs) WHERE students.id=1;"

	db.task('get-everything', task => {
		return task.batch([
			task.any(query_student),
			task.any(query_jobs),
		]);
	})
		.then(data => {
			//console.log(data[1][0])
			res.render('pages/student_profile', {
				data_student: data[0][0],
				data_jobs: data[1]
			})
		})
});

/* Student profile update */
app.post('/student_profile/update', function(req, res){
	query = "UPDATE students SET student_name='" + req.body.form_name + "', school='" + req.body.form_school + "', student_email='" + req.body.form_email + "', about_me='" + req.body.form_bio + "' WHERE id=1;"

	db.any(query);

	res.redirect('/student_profile');
});

/* Accepting a job from the student's perspective 
Currently defaults to student 1 as the acceptor */
app.post('/main/accept', function (req, res) {
	//Updating array of accepted jobs for the student
	query = "UPDATE students SET accepted_jobs = array_append(accepted_jobs,'" + req.body.job_id + "') WHERE id='1'";
	db.any(query)
	res.redirect('/main')
});

app.get('/', function (req, res) {
	res.render('pages/start_page')
});

app.get('/signup_employer', function (req, res) {
	res.render('pages/signup_employer');
});

app.route('/signup_student')
	.get((req, res) => {
		res.render('pages/signup_student');
	})
	.post((req, res) => {
		query = "INSERT INTO students(student_name, school, student_email) VALUES('" + req.body.full_name + "','" + req.body.school + "','" + req.body.email + "') ON CONFLICT DO NOTHING;";
		db.any(query)
		res.redirect('/main');
	});


app.post('/signup_student', function (req, res) {
	res.render('pages/signup_student');
});



app.get('/employer_profile', function (req, res) {
	res.render('pages/employer_profile')
});

app.listen(3000);
console.log('Listening to 3000');
