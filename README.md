# [CSCI 3308] Arbonsi (Team 3 Final Project)

Arbonsi is a freelancing website targeting Computer Science students. The website was primarily designed to enable students to find small jobs that could potentially lead to full-time employment.  

In and of itself, Arbonsi is easy to use and helps you find projects that fit your level of language expertise and preference. Our website enables students to gain new knowledge and experience, as well as get paid for completing assignments created by registered employers. The key benefit of using Arbonsi over its competitors is that jobs posted on this website are created with CU students in mind, so that they can gain exposure, as well as fill gaps in their resumes for future full-time employment.

## Deployment

### Prerequisites
* GNU/Linux OS
* postgres

### Heroku Deployment

By default, the website is meant to be deployed in a Heroku dyno. Create a new application on Heroku and add _Heroku Postgres_ as a resource.

To initialize the database, `cd` into the project directory and run:
~~~~
cd ./database_workspace
sudo chmod +x deploy_heroku_db.sh
./deploy_heroku_db.sh [heroku-app-name]
~~~~
Note: `deploy_heroku_db.sh` uses `shuf` to generate database data from dictionaries, which only ships with Linux. When executing the command on Mac OS, the names will not be generated properly.

Once the database is deployed, `cd` into the project directory, enter the following commands and follow prompts:
~~~~
heroku login
git init
heroku git:remote -a [heroku-app-name]
git add .
git commit -am [commit-message]
git push heroku master
~~~~
The app should now be available at [heroku-app-name].herokuapp.com

### Local Deployment
Change the following lines in server.js to reflect your local settings (see comments):
 ~~~~
 const dbConfig = process.env.DATABASE_URL;
 ~~~~
 ~~~~
 app.listen(process.env.PORT);
 ~~~~
  `cd` into the project directory and execute the following to deploy the project database under the user `postgres`:
 ~~~~
 cd ./database_workspace
 sudo chmod +x deploy_local_db.sh
 ./deploy_local_db
 ~~~~
 Note: `deploy_local_db.sh` also uses `shuf` to generate names from a dictionary. When executing the command on Mac OS, the names will not be generated properly.



## Sources 
### Dictionaries
Ward, G. (2002). Moby Word Lists. Retrieved from http://www.gutenberg.org/ebooks/3201.
