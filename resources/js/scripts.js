/* Collection of scripts used across the website */

/* 
### Reference ###
Notes: 
jobData -- array, used to pass data from the database to the webpage
	0: ID			(integer)
	1: Title 		(string)
	2: Description	(string)
	3: Brief desc.	(string)
	4: Difficulty 	(integer)
	5: Payment		(integer)
	6: Deadline		(string)
	7: Tags
	
	Employer name
	Employer affiliation
	Employer description
	Employer email

	Student name
	Student skills
	Student "about me"
	Student institution
	Student email

	Job Listing (preview)
		ID, Title, Difficulty, Deadline, Brief desc.

	Job Listing (full)
		ID, Title, Description, Difficulty, payment, deadline, employer name, employer affiliation, employer email, tags

	Employer Profile
		E. name, E. affiliation, E. description, E. email

	Student Profile
		S. name, S skills, S. "about me," S. institution, S. email

	Draft a database

	Server setup, rewrite queries
*/

/*
### Notes ###
	Add employer name
	Employer affiliation
	Tags
*/


var pg = require('pg');



var jobCounter = 0; //Tentative global counter, will probably be deprecated in the future in favor of database IDs
var displayedJobs = []; //Keeps track of the displayed jobs by their IDs
var jobBox = document.getElementById("jobsBox"); //Reference to the jobsBox element
var focusBox = document.getElementById("focusBox");

/* Main Page grid system columns
0 -- left column, normal view
1 -- middle column, normal view
2 -- alternative middle column, focused view */
var colList = [document.getElementById("col0"), document.getElementById("col1"), document.getElementById("col2")];

/* Populates the main page with jobs. 
count -- takes the number of jobs to load */
function populatePage(count) {
	/* !!! There will have to be an algorithm to determine which jobs to display on load */
	id = -1;

	for (var i = 0; i < count; i++)
		generateJob(id);
}

/* Adds a new job to the web page
id -- takes an id of the job */
function generateJob(id) {
	jobData = fetchJob(-1); //Passing -1 for now
	displayedJobs.push(jobData[0]); //Pushes job ID into the array
	displayJob(jobData);
}

/* Displays a job on the page
jobData -- takes an array with job info */
function displayJob(jobData) {

	//Throw everything into a single line
	//Use cards: title, brief description, deadline
	//Title | Difficulty | Deadline | Description

	//profile redirect
	//If you're not logged in, can't click on jobs
	//profile page
	//tags

	/* Creates an element to store job data */
	jobBox.innerHTML =
		jobBox.innerHTML +
		"<div class=\"p-2 bd-highlight\"> <button type=\"button\" class=\"btn btn-link btn-block\" data-toggle=\"tooltip\" data-placement=\"right\" title=\"Learn more\" onclick=\"focusJob(" +
		jobData[0] +
		")\"><div class=\"card bg-light text-dark\"><div class=\"card-body\"><table><tr><th>" +
		jobData[1] +
		"</th><td style=\"padding-left:20px; padding-right:20px\">|</td><td>" +
		jobData[6] +
		"</td><td style=\"padding-left:20px; padding-right:20px\">|</td><td>Difficulty: " +
		jobData[4] +
		"</td><td style=\"padding-left:20px; padding-right:20px\">|</td><td>" +
		jobData[3] +
		"</td></tr></table></div></div></button></div>";
}

/* Replaces the contents of the screen with a job list */
function focusJob(id) {
	jobData = fetchJob(id);
	toggleColumns(1);

	focusBox.innerHTML = "<div class=\"p-2 bd-highlight\"><div class=\"card bg-light text-dark\"> <div class=\"card-body\"><table class=\"table table-bordered\"><tr><th colspan=\"2\">" +
		jobData[1] +
		"</th></tr><tr><td>Difficulty: " +
		jobData[4] +
		"</td><td id=\"jobPay\">Payment: $" +
		jobData[5] +
		"</td></tr><tr><td colspan=\"2\">Deadline: " +
		jobData[6] +
		"</td></tr><tr><td colspan=\"2\">" +
		jobData[2] +
		"</td></tr></table><div class=\"row\"><div class=\"col\"><button class=\"btn btn-dark\" onclick=\"toggleColumns(" +
		0 +
		")\">Back</button></div><div class=\"col\"><button class=\"btn btn-dark\" onclick=\"acceptJob(" +
		id +
		")\">Accept</button></div></div></div></div></div>";
}

/* Toggles main page column states 
0 -- default view
1 -- focused view */
function toggleColumns(state) {
	if (state) {
		colList[0].style.display = "none";
		colList[1].style.display = "none";
		colList[2].style.display = "block";
	}
	else {
		colList[0].style.display = "block";
		colList[1].style.display = "block";
		colList[2].style.display = "none";
	}
}

/* Allows a student to accept a particular job */
function acceptJob(id) {
	alert("Accepting job " + id);
}

/* Retrieves a job from the database 
id -- takes the identifier of a job within the database */
function fetchJob(id) {

	/* To be implemented
		See 10/23 lecture

		Alternatively:
		https://node-postgres.com/ 
		
		Sends a query to the database*/

	jobData = dummyJobData(); //Returns dummy data for the time being
	return jobData;
}

/* Adds a job to the database
Takes an array of job data */
function newJob(data) {
	//Have to store a picture on the server and pass a local path?
	/* To be implemented
		See 10/23 lecture

		Alternatively:
		https://node-postgres.com/ 
		
		Sends a query to the database*/

}

/* Rolls dummy job data for the project demo */
function dummyJobData() {
	var title = ["Coders wanted", "!!!Test Title!!!", "Looking for a friend"];

	var briefDesc = ["Test description.", "Yet another test description.", "A third test description."];

	var desc = ["Test description.Test description.Test description.Test description.Test description.Test description.Test description.Test description.Test description.Test description.Test description.Test description.Test description.", "Yet another test description.Yet another test description.Yet another test description.Yet another test description.Yet another test description.Yet another test description.Yet another test description.Yet another test description.Yet another test description.", "A third test description.A third test description.A third test description.A third test description.A third test description.A third test description.A third test description.A third test description.A third test description.A third test description."];

	jobCounter++;
	return [jobCounter, title[Math.floor(Math.random() * 3)], desc[Math.floor(Math.random() * 3)], briefDesc[Math.floor(Math.random() * 3)], Math.floor(Math.random() * 5) + 1, Math.floor(Math.random() * 100) + 5, "4/16/2077"];
}