
pg = require('pg')

var connectionString = "postgres://postgres:postgres@localhost:5432/market";
var results = []; 
 
film_list = [
{"title":"Дубровский",
"poster":"http://right-film.ru/uploads/posts/2016-02/1456157180-1824291676.jpg",
 "director":"Александр Вартанов"},
{"title":"Про Любовь",
"poster":"http://drufilms.ru/uploads/posts/2015-12/1450534383-2032288180.jpg",
"director":"Анна Меликян"},
{"title":"Король Лев",
"poster":"http://ru2.anyfad.com/items/t2@c60a98bb-6f13-4f16-b238-1c9c1c8b07e4/Korol-Lev-1994.jpg",
"director":"Роджер Аллерс"},
{"title":"Приключения Паддингтона",
"poster":"http://kinogo-net-2015.ru/uploads/posts/2015-01/1421601585_priklyucheniya-paddingtona.jpg",
"director":"Пол Кинг"},
{"title":"Гарри Поттер и Дары Смерти","poster":"http://kino-go.tv/uploads/posts/2015-07/1437691322_poster-407636.jpg", "director":"Дэвид Йэтс"},
{"title":"Хроники Нарнии: Покоритель Зари","poster":"http://kino-go.tv/uploads/posts/2015-09/1441656442_poster-281439.jpg", "director":"Майкл Аптед"}
]
function addmovie(title, poster, director) {
b ="INSERT INTO movie (title, poster, director) VALUES (" +"'"+title+"'" + ',' +"'"+ poster + "'"+','+"'"+director+"'"+ ");" ;
return b}

 pg.connect(connectionString, function(err, client, done) { 
    // Handle connection errors 
    if(err) { 
      done(); 
      console.log({ success: false, data: err}); 
   } 

    /* 
    // SQL Query > Insert Data 
    for (var i=0; i<film_list.length; i++){
     name = film_list[i]['title']
     poster = film_list[i]['poster']
	 director = film_list[i]['director']
     client.query(addmovie(name, poster, director));
     }
	  */
    // SQL Query > Select Data 
   var query = client.query("SELECT * FROM movie ORDER BY id ASC"); 
 // 
 //    // Stream results back one row at a time 
     query.on('row', function(row) { 
         results.push(row); 
    }); 
 // 
    // After all data is returned, close connection and return results 
     query.on('end', function() { 
         console.log(results) 
        //client.close() 
    }); 
 }); 
