#!/bin/bash

### Database Section ###
declare -a QUERIES
QUERIES[0]="DROP DATABASE IF EXISTS arbonsi_db;"
QUERIES[1]="CREATE DATABASE arbonsi_db;"
QUERIES[2]="create table if not exists job(id serial primary key,title varchar(50),description varchar(500),brief_description varchar(250),difficulty smallint,payment smallint,deadline varchar(50),tags varchar(10)[] NOT NULL,creator smallint,acceptor smallint);"
QUERIES[3]="create table if not exists employers(employer_name varchar(50),employer_id serial primary key,about_employer varchar(500),company varchar(50),employer_email varchar(50),created_jobs smallint[]);"
QUERIES[4]="CREATE TABLE IF NOT EXISTS students(id serial primary key, student_name VARCHAR(50) NOT NULL,skills varchar(250),about_me varchar(500),school varchar(50),student_email varchar(50), accepted_jobs smallint[]);"
QUERIES[5]="create table if not exists login_info(username varchar(50) primary key, password varchar(50), usertype integer NOT NULL, userid integer NOT NULL);"
QUERIES[6]="CREATE VIEW jobListing_preview AS SELECT id, title, difficulty, deadline, brief_description FROM job;"
QUERIES[7]="CREATE VIEW jobListing_full AS SELECT id, title, difficulty, deadline, description,payment,tags,about_employer,company,employer_email,employer_name FROM job INNER JOIN employers ON job.creator=ANY(employers.created_jobs);"
QUERIES[8]="CREATE VIEW employer_profile AS SELECT employer_name, company, about_employer, employer_email FROM employers;"
QUERIES[9]="CREATE VIEW student_profile AS SELECT student_name, skills, about_me, school, student_email FROM students;"

#Makes sure all files are present in the directory before starting
if test -f "$PWD/NAMES.txt" && test -f "$PWD/PLACES.txt" && test -f "$PWD/ACRONYMS.txt";
then
     #Creates a new database
     for ((i = 0; i < ${#QUERIES[@]}; i++))
     do
          if [[ $i < 2 ]] #Drops and creates the database
          then
               psql -U postgres -c "${QUERIES[$i]}" # Dropping a pre-existing database, creating a new one
          else
               psql -U postgres -d arbonsi_db -c "${QUERIES[$i]}" #Creating tables and views
          fi
     done
     
     
     # Generating database entries
     for ((i = 1; i < 21; i++))
     do
          #Rolling tags
          tags="{"
          if [[ $((RANDOM % 2)) == 1 ]]
          then
               tags=$tags"JavaScript,"
          fi
          if [[ $((RANDOM % 2)) == 1 ]]
          then
               tags=$tags"C#,"
          fi
          if [[ $((RANDOM % 2)) == 1 ]]
          then
               tags=$tags"LaTeX,"
          fi
          
          # Edge case when we rolled no tags: there has to be at least one
          if [[ $tags == "{" ]]
          then
               tags="{JavaScript,"
          fi
          
          # Deleting the comma at the end and closes the brackets
          tags=${tags::-1}"}"
          
          # Inserts job entries
          psql -U postgres -d arbonsi_db -c "INSERT INTO job(title, description, brief_description, difficulty, payment, deadline, tags, creator) VALUES ('Job $i', 'A long description of the job. The student will be able to admire the great effort put into the extremely detailed and sophisticated details regarding the project requirements.', 'Brief description for the preview.', $(($RANDOM % 5+1)), $(($RANDOM % 1000)), '01-01-2077', '$tags',$i);"
          
          # Employers section
          tempName=$(shuf -n 1 NAMES.txt | tr -d '\r'\') # Rolls a random name, truncates escape characters
          tempCompany=$(shuf -n 1 ACRONYMS.txt | tr -d '\r'\')" "$(shuf -n 1 PLACES.txt | tr -d '\r') # Rolls a random acronym + location
          tempEmail=$tempName"@"$(echo $tempCompany | tr -d ' ')".com" #Employer email
          
          # Adds employer entries to employers table
          psql -U postgres -d arbonsi_db -c "INSERT INTO employers(employer_name,about_employer,company,employer_email,created_jobs) VALUES ('$tempName', 'Greatest employer on Earth.', '$tempCompany', '$tempEmail', '{$i}');"
          
          # Adds login info to login_imfo table
          psql -U postgres -d arbonsi_db -c "INSERT INTO login_info(username, password, usertype, userid) VALUES ('$tempEmail', '123', '2', '$i')"
     done
     
     #First user insert to avoid breaking the website
     psql -U postgres -d arbonsi_db -c "INSERT INTO students(student_name, school, student_email, about_me) VALUES ('Dennis', 'CU Boulder', 'test_email@gmail.com', 'Memes interlinked.')";
     
     ## DEBUG ONLY
     # Prints out the inserted queries
     # psql -U postgres -d arbonsi_db -c "SELECT * FROM employers;"
     # psql -U postgres -d arbonsi_db -c "SELECT id, tags FROM job;"
     # psql -U postgres -d arbonsi_db -c "SELECT * FROM jobListing_preview;"
     
else
     echo "One or more of the dictionaries are missing. Make sure ACRONYMS.TXT, NAMES.TXT and PLACES.TXT are next to deployDB.sh. Also make sure you are executing the script from project_dir/database_workspace/"
     exit
fi