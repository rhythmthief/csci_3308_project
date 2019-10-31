#!/bin/bash

### Database Section ###
declare -a QUERIES
QUERIES[0]="DROP DATABASE IF EXISTS arbonsi_db;"
QUERIES[1]="CREATE DATABASE arbonsi_db;"
QUERIES[2]="CREATE TABLE IF NOT EXISTS jobs(id serial primary key,title varchar(50),description varchar(500),brief_description varchar(250),difficulty smallint,payment smallint,deadline varchar(50),tags varchar(50));"
QUERIES[3]="CREATE TABLE IF NOT EXISTS login_info(username VARCHAR(50) NOT NULL,password varchar(50) NOT NULL);"
QUERIES[4]="CREATE TABLE IF NOT EXISTS employers(employer_name VARCHAR(50) NOT NULL,about_employer varchar(500),company varchar(50),employer_email varchar(50));"
QUERIES[5]="CREATE TABLE IF NOT EXISTS students(student_name VARCHAR(50) NOT NULL,skills varchar(250),about_me varchar(500),school varchar(50),student_email varchar(50));"
QUERIES[6]="CREATE VIEW jobListing_preview AS SELECT id, title, difficulty, deadline, brief_description FROM jobs;"
QUERIES[7]="CREATE VIEW employer_profile AS SELECT employer_name, company, about_employer, employer_email FROM employers;"
QUERIES[8]="CREATE VIEW student_profile AS SELECT student_name, skills, about_me, school, student_email FROM students;"

for ((i = 0; i < ${#QUERIES[@]}; i++))
do
    if [[ $i == 0 || $i == 1 ]] #Drops and creates the database
    then
        psql -U postgres -c "${QUERIES[$i]}" # Dropping a pre-existing database, creating a new one
    else
        psql -U postgres -d arbonsi_db -c "${QUERIES[$i]}" #Creating tables and views
    fi
done