var pg = require('pg')
var connectionString = "postgres://postgres:postgres@localhost:5432/market";

function addcomment(film_id, text) {
b ="INSERT INTO comment (film_id, text) VALUES ("+"'"+ + film_id+"'"+"," +"'"+ text+"'"+ ");" ;
return b}


pg.connect(connectionString, function(err, client, done) {
for(var i=37; i<40; i++)
{
film_id=i
client.query(addcomment(film_id, 'Хороший фильм'))
client.query(addcomment(film_id, 'Плохой фильм'))
client.query(addcomment(film_id, 'Отличный фильм'))
}
})

