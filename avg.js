var pg = require('pg')
var connectionString = "postgres://postgres:postgres@localhost:5432/market";
var results = [];



 pg.connect(connectionString, function(err, client, done) { 
    // Handle connection errors 
    if(err) { 
      done(); 
      console.log({ success: false, data: err}); 
   } 

  
    // SQL Query > Select Data 
   var query = client.query("SELECT m.id, m.title, m.poster, AVG(c.otzyv) FROM movie AS m LEFT JOIN comment AS c ON c.film_id = m.id LEFT JOIN users AS u ON u.id = c.user_id GROUP BY (m.id)"); 
    // Stream results back one row at a time 
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
 
 
 SELECT m.id, m.title, m.poster, COUNT(id)
 FROM movie AS m 
 JOIN likes AS l
ON l.movie_id = m.id
GROUP BY (m.id);
