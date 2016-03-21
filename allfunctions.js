
function addcategory(name) {
b ='INSERT INTO category (title) VALUES (' + name + ');' ;
return b}

console.log(addcategory("'Action'"));

//добавление фильма
function addmovie(name) {
b ='INSERT INTO movie (title, director, country, pub_year, rank, duration, category) VALUES (' + name + ');' ;
return b}

console.log(addcategory("'12', 'Никита Михалков', 'Россия', 2007, 7.6, 155, 'драма' "));

//добавление юзера
function adduser(name) {
b ='INSERT INTO movie (pass, last_activity, registration_date, gender, birthday_date, first_name, last_name, login) VALUES (' + name + ');' ;
return b}

console.log(addcategory("'123456', 2016-03-21, 2005-09-25, 'False', 2003-06-21, 'Phill', 'Green', 'PG'"));

//выводить список фильмов
function listmovie(name) {
b ='SELECT' + name + 'FROM movie' ;
return b}

console.log(listmovie("title"));

