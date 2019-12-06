/* Arbonsi server file */

const express = require('express');
let app = express();
const pug = require('pug');
const bodyParser = require('body-parser'); // Add the body-parser tool has been added
app.use(bodyParser.json());              // Add support for JSON encoded bodies
app.use(bodyParser.urlencoded({ extended: true })); // Add support for URL encoded bodies

/* Tracks user types. 0 -- logged out, 1 -- student, 2 -- employer */
var state = 0;
var userId = 0;

//Create Database Connection
const pgp = require('pg-promise')();

/* Switch between these dbConfigs when deploying locally or on Heroku */
const dbConfig = process.env.DATABASE_URL; //Heroku deployment

//Local deployment
// const dbConfig = {
// 	host: 'localhost',
// 	port: 5432,
// 	database: 'arbonsi_db',
// 	user: 'postgres',
// 	password: 'J74?vW'
// };


var db = pgp(dbConfig);

app.set('view engine', 'pug');
app.use(express.static(__dirname + '/'));

app.get('/', function (req, res) {
	res.render('pages/start_page', {
		state: state
	})
});

/* Main page request */
app.get('/main', function (req, res) {

	query = "SELECT * FROM jobListing_preview;"

	db.any(query)
		.then(function (rows) {
			res.render('pages/main', {
				mode: 0,
				jobs: rows,
				state: state,
				forms: { tag0: 0, tag1: 0, tag2: 0, diff: 0, name: '' }
			})
		})
		.catch(function (err) {
			// Displays error message in case an error
			res.render('pages/main', {
				mode: 0,
				jobs: '',
				state: state,
				forms: { tag0: 0, tag1: 0, tag2: 0, diff: 0, name: '' }
			})
		})
});

/* Main page */
app.get('/main/view', function (req, res) {
	var job_id = req.query.job_id;
	console.log(job_id)

	query = "SELECT id, title, difficulty, deadline, description,payment,tags,about_employer,company,employer_email,employer_name FROM job INNER JOIN employers ON job.id=ANY(employers.created_jobs) WHERE id=" + job_id + ";"

	db.any(query)
		.then(function (rows) {
			res.render('pages/main', {
				mode: 1,
				my_title: "Main Page",
				focusedJob: rows,
				state: state,
				forms: { tag0: 0, tag1: 0, tag2: 0, diff: 0, name: '' }
			})
		})
		.catch(function (err) {
			res.render('pages/main', {
				mode: 1,
				title: 'Main Page',
				focusedJob: '',
				state: state,
				forms: { tag0: 0, tag1: 0, tag2: 0, diff: 0, name: '' }
			})
		})
});

/* Accepting a job from the student's perspective */
app.post('/main/accept', function (req, res) {
	//Updating array of accepted jobs for the student
	query = "UPDATE students SET accepted_jobs = array_append(accepted_jobs,'" + req.body.job_id + "') WHERE id='" + userId + "'";
	db.any(query)
	res.redirect('/main')
});

/* Generates a new query based on search parameters, reloads the main page */
app.post('/main/search', function (req, res) {

	query = "SELECT * FROM job WHERE TRUE";
	forms = { tag0: 0, tag1: 0, tag2: 0, diff: req.body.form_diff, name: req.body.form_job_name };

	//Checking individual filter/search conditions
	if (req.body.form_tag_0 == 'true') {
		query = query + " AND 'C#'=ANY(tags)";
		forms.tag0 = 1
	}

	if (req.body.form_tag_1 == 'true') {
		query = query + " AND 'JavaScript'=ANY(tags)";
		forms.tag1 = 1
	}

	if (req.body.form_tag_2 == 'true') {
		query = query + " AND 'LaTeX'=ANY(tags)";
		forms.tag2 = 1
	}

	if (parseInt(req.body.form_diff) > 0) //Pass if not 0
		query = query + " AND '" + req.body.form_diff + "'<= difficulty";
	if (req.body.form_job_name != '')
		query = query + " AND title ~* '" + req.body.form_job_name + "'";
	query = query + ";"

	db.any(query)
		.then(function (rows) {
			res.render('pages/main', {
				mode: 0,
				jobs: rows,
				state: state,
				forms: forms //To set he old search parameters on reload for consistency
			})
		})
		.catch(function (err) {
			// Displays error message in case an error
			res.render('pages/main', {
				mode: 0,
				jobs: '',
				state: state,
				forms: forms
			})
		})
});

/* Sign in get */
app.get('/signin', function (req, res) {
	res.render('pages/signin', {
		err: false,
		state: state
	});
});

/* Sign in post to verify login info */
app.post('/signin', function (req, res) {
	var username = req.body.username;
	var password = req.body.password;

	query = "select usertype,userid from login_info where username='" + username + "' and password = '" + password + "' ;"

	db.any(query)
		.then(function (rows) {
			//Checks if there was a match in the database
			if (rows.length == 1) {
				state = rows[0].usertype;
				userId = rows[0].userid;
				res.redirect('/profile');

			} else {
				//if the info don't match, then send massage to user 
				res.render('pages/signin', {
					err: true,
					state: state
				})
			}
		})
		.catch(function (err) {
			console.log(err)
		})
});


/* Redirects to one of the profile types from here */
app.get('/profile', function (req, res) {

	if (state != 0) {
		if (state == 1)
			res.redirect('/student_profile');
		else
			res.redirect('/employer_profile');
	}
	else
		res.redirect('/');
})

/* Student profile page */
app.get('/student_profile', function (req, res) {
	query_student = "SELECT * FROM students WHERE id='" + userId + "';";
	query_jobs = "SELECT job.id,job.title,job.deadline,job.difficulty,job.brief_description  FROM job INNER JOIN students ON job.id=ANY(students.accepted_jobs) WHERE students.id='" + userId + "';";

	/* Checks to make sure the student is signed in */
	if (state == 1) {
		db.task('get-everything', task => {
			return task.batch([
				task.any(query_student),
				task.any(query_jobs),
			]);
		})
			.then(data => {
				console.log(data[1])
				res.render('pages/student_profile', {
					data_student: data[0][0],
					data_jobs: data[1],
					state: state
				})
			})
	}
	else
		res.redirect('/');
});

/* Student profile update */
app.post('/student_profile/update', function (req, res) {
	query0 = "UPDATE students SET student_name='" + req.body.form_name + "', school='" + req.body.form_school + "', student_email='" + req.body.form_email + "', about_me='" + req.body.form_bio + "' WHERE id='" + userId + "';";
	query1 = "UPDATE login_info SET username='" + req.body.form_email + "' WHERE usertype='1' AND userid='" + userId + "';";

	db.any(query0);
	db.any(query1);

	res.redirect('/student_profile');
});

app.route('/signup_student')
	.get((req, res) => {
		res.render('pages/signup_student', {
			state: state
		});
	})
	.post((req, res) => {
		//Inserts student profile info

		query_check = "select count(*) from login_info where username='" + req.body.email + "';"

		db.any(query_check)
			.then(function (rows) {
				//Making sure there is no user under this name
				if (rows[0].count == 0) {

					query0 = "INSERT INTO students(student_name, school, student_email) VALUES('" + req.body.full_name + "','" + req.body.school + "','" + req.body.email + "') ON CONFLICT DO NOTHING;";

					//Inserts login info
					query1 = "INSERT INTO login_info(username, password, usertype, userid) SELECT '" + req.body.email + "','" + req.body.password + "','1', id FROM students ORDER BY id DESC LIMIT 1;";

					//Retrieves the new user id within the db
					query2 = "SELECT id FROM students ORDER BY id DESC LIMIT 1;"

					db.task('get-everything', task => {
						return task.batch([
							task.any(query0),
							task.any(query1),
							task.any(query2),
						]);
					})
						//Technically useless, but I want to make sure I'm not redirecting in vain
						.then(data => {
							state = 1;
							userId = data[2][0].id;
							res.redirect('/profile');
						})

						.catch(function (err) {
							res.redirect('/signup_student');
						})
				}
				else {
					res.redirect('/signup_student');
				}
			});
	});

/* EMPLOYER PROFILE */
app.get('/employer_profile', function (req, res) {
	query_employer = "SELECT * FROM employers WHERE employer_id='" + userId + "';";
	query_jobs = "SELECT * FROM job INNER JOIN employers ON job.id=ANY(employers.created_jobs) WHERE employers.employer_id='" + userId + "';";

	/* Checks to make sure the employer is signed in */
	if (state == 2) {
		db.task('get-everything', task => {
			return task.batch([
				task.any(query_employer),
				task.any(query_jobs),
			]);
		})
			.then(data => {
				res.render('pages/employer_profile', {
					data_employer: data[0][0],
					data_jobs: data[1],
					state: state
				})
			})
	}
	else
		res.redirect('/');
});

/* Updates employer profile */
app.post('/employer_profile/update', function (req, res) {
	query0 = "UPDATE employers SET employer_name='" + req.body.form_name + "', company='" + req.body.form_company + "', employer_email='" + req.body.form_email + "', about_employer='" + req.body.form_bio + "' WHERE employer_id='" + userId + "';";
	query1 = "UPDATE login_info SET username='" + req.body.form_email + "' WHERE usertype='2' AND userid='" + userId + "';";

	db.any(query0);
	db.any(query1);

	res.redirect('/employer_profile');
});

/* Adding a new job to the database */
app.post('/employer_profile/new_job', function (req, res) {

	// Generating tags
	temp = "{"
	if (req.body.job_tag_c == 'on')
		temp = temp + "C#,";
	if (req.body.job_tag_js == 'on')
		temp = temp + "JavaScript,";
	if (req.body.job_tag_latex == 'on')
		temp = temp + "LaTeX,";

	if (temp != "{")
		temp = temp.substring(0, temp.length - 1);
	temp = temp + "}"

	query0 = "INSERT INTO job(title, description, brief_description, difficulty, payment, deadline, creator, tags) VALUES ('" + req.body.job_title + "','" + req.body.job_desc + "','" + req.body.job_brief + "','" + req.body.rate + "','" + req.body.job_payment + "', '01-01-2077','" + userId + "','" + temp + "');"

	query1 = "SELECT id FROM job ORDER BY id DESC LIMIT 1;"

	db.task('get-everything', task => {
		return task.batch([
			task.any(query0),
			task.any(query1),
		]);
	})
		.then(data => {
			query2 = "UPDATE employers SET created_jobs = array_append(created_jobs,'" + data[1][0].id + "') WHERE employer_id='" + userId + "'";
			db.any(query2)
		})

	res.redirect('/profile');
});

/* employer signup page */
app.route('/signup_employer')
	.get((req, res) => {
		res.render('pages/signup_employer');
	})
	//Inserts employer profile info
	.post((req, res) => {

		query_check = "select count(*) from login_info where username='" + req.body.email + "';"

		db.any(query_check)
			.then(function (rows) {
				//Making sure there is no user under this name
				if (rows[0].count == 0) {

					query0 = "INSERT INTO employers(employer_name, company, employer_email) VALUES('" + req.body.firstname + "','" + req.body.company + "','" + req.body.email + "') ON CONFLICT DO NOTHING;";

					//Inserts login info
					query1 = "INSERT INTO login_info(username, password, usertype, userid) SELECT '" + req.body.email + "','" + req.body.password + "','2', employer_id FROM employers ORDER BY employer_id DESC LIMIT 1;";

					//Retrieves the new user id within the db
					query2 = "SELECT employer_id FROM employers ORDER BY employer_id DESC LIMIT 1;"

					db.task('get-everything', task => {
						return task.batch([
							task.any(query0),
							task.any(query1),
							task.any(query2),
						]);
					})
						//Technically useless, but I want to make sure I'm not redirecting in vain
						.then(data => {
							state = 2;
							userId = data[2][0].employer_id;

							res.redirect('/profile');
						})

						.catch(function (err) {
							res.redirect('/signup_employer');
						})
				}
				else {
					res.redirect('/signup_employer');
				}
			});
	});

/* Signing out */
app.get('/signout', function (req, res) {
	state = 0;
	res.redirect('/');
});

/* Switch between these settings when deploying locally or on Heroku */
app.listen(process.env.PORT); //Heroku
//app.listen(3000); //Local deployment
