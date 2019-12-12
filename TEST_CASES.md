# Application Test Cases

We are assuming that the database is generated and that tests are being run locally.

## Self-updating main page job list
Run:
~~~~
psql -U postgres -d arbonsi_db -c "SELECT * FROM job;"
~~~~
Log into the student profile and access the main page of the app and make sure that all entries are displayed and that their information appears exactly the way it does in the database.

## Viewing and accepting job listings
Assuming that the application passed the "self-updating main page job list" test. Log into the student profile and access the main page of the app. Select an arbitrary job and accept it. 
Run:
~~~~
psql -U postgres -d arbonsi_db -c "SELECT * FROM students;"
psql -U postgres -d arbonsi_db -c "SELECT * FROM job;"
~~~~
Locate your student entry. Locate the job you have accepted and take note of its job_id. Make sure that the job_id has been inserted into the accepted_jobs array of your student entry. Make sure that job.acceptor has been updated to student's id. Access the student profile and make sure that the accepted job appears on the list.

## Creation of Job Listings
Log into an employer account and fill out all job fields. Take note of the inputted information. Submit the new job. Run:
~~~~
psql -U postgres -d arbonsi_db -c "SELECT * FROM job ORDER BY id DESC LIMIT 1;"
~~~~
Make sure that the returned job entry exactly matches the inputted information. Run:
~~~~
psql -U postgres -d arbonsi_db -c "SELECT * FROM employers;"
~~~~
Locate the employer entry you are currently logged into, make sure that the new job_id has been inserted into the created_jobs array of your employer entry. Make sure that job.creator has been updated to employer's id. Access the employer profile and verify that the new job appears on the list of created jobs.
