
pg = require('pg')


connectionString = "postgres://postgres:postgres@localhost:5432/ai_recipe";
var results = []; 
 
film_list = [
{"title":"Дубровский",
"poster":"http://right-film.ru/uploads/posts/2016-02/1456157180-1824291676.jpg"},
{"title":"Про Любовь",
"poster":"http://drufilms.ru/uploads/posts/2015-12/1450534383-2032288180.jpg"},
{"title":"Король Лев",
"poster":"http://ru2.anyfad.com/items/t2@c60a98bb-6f13-4f16-b238-1c9c1c8b07e4/Korol-Lev-1994.jpg"},
{"title":"Приключения Паддингтона",
"poster":"http://kinogo-net-2015.ru/uploads/posts/2015-01/1421601585_priklyucheniya-paddingtona.jpg"},
{"title":"Гарри Поттер и Дары Смерти","poster":"http://kino-go.tv/uploads/posts/2015-07/1437691322_poster-407636.jpg"},
{"title":"Хроники Нарнии: Покоритель Зари","poster":"http://kino-go.tv/uploads/posts/2015-09/1441656442_poster-281439.jpg"}
]
function addmovie(title, poster) {
b ='INSERT INTO movie (title, poster) VALUES (' + title + ', ' + poster + ');' ;
return b}
for (var i=0; i<film_list.length; i++){
name = film_list[i]['title']
poster = film_list[i]['poster']
console.log(addmovie(name, poster));
} 
 pg.connect(connectionString, function(err, client, done) { 
    // Handle connection errors 
    if(err) { 
      done(); 
      console.log({ success: false, data: err}); 
   } 

 
    // SQL Query > Insert Data 
    for (var i=0; i<film_list.length; i++){
     name = film_list[i]['title']
     poster = film_list[i]['poster']
     client.query(addmovie(name, poster));
     }
	 ); 
    // SQL Query > Select Data 
   var query = client.query("SELECT * FROM film ORDER BY id ASC"); 
 // 
 //    // Stream results back one row at a time 
     query.on('row', function(row) { 
         results.push(row); 
    }); 
 // 
    // After all data is returned, close connection and return results 
     query.on('end', function() { 
         console.log(results) 
        client.close() 
    }); 
 }) 
