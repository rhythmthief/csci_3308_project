/* JavaScript scripts designed to work with node.js */
var jobCounter = 0; //Tentative global counter, will probably be deprecated in the future in favor of database IDs
var displayedJobs = []; //Keeps track of the displayed jobs by their IDs

module.exports = {
	generateJobs: function (count) {
		var jobs = [];

		for (var i = 0; i < count; i++) {
			jobs.push(dummyJobData());
		}

		return jobs;
	},

	focusJob: function (job_id) {
		console.log("test");
	}
}

	;/* Rolls dummy job data for the project demo */
function dummyJobData() {
	var title = ["Coders wanted", "!!!Test Title!!!", "Looking for a friend"];

	var briefDesc = ["Test description.", "Yet another test description.", "A third test description."];

	var desc = ["Test description.Test description.Test description.Test description.Test description.Test description.Test description.Test description.Test description.Test description.Test description.Test description.Test description.", "Yet another test description.Yet another test description.Yet another test description.Yet another test description.Yet another test description.Yet another test description.Yet another test description.Yet another test description.Yet another test description.", "A third test description.A third test description.A third test description.A third test description.A third test description.A third test description.A third test description.A third test description.A third test description.A third test description."];

	jobCounter++;
	return { id: jobCounter, title: title[Math.floor(Math.random() * 3)], description: desc[Math.floor(Math.random() * 3)], brief: briefDesc[Math.floor(Math.random() * 3)], difficulty: Math.floor(Math.random() * 5) + 1, pay: Math.floor(Math.random() * 100) + 5, date : "4/16/2077"};
}