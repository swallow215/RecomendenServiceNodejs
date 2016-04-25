var pg = require('pg'), 
    http = require('http'),  
    template = require('swig');  
	
      
      
    var server = new http.Server(),  
        connectionString = "postgres://postgres:postgres@localhost:5432/allinfo";  
		
      
    server.listen(8000, '127.0.0.1');  
     
   server.on('request', function(req, res){
   var tmpl = template.compileFile('./templates/1.html'),  
      film_list = [];  
 
   
    pg.connect(connectionString, function(err, client, done) { 
    
    if(err) { 
      done(); 
      console.log({ success: false, data: err}); 
   } 

     var query = client.query("SELECT m.id, m.title, m.poster, m.year, m.rank, COUNT(id) FROM movie AS m JOIN likes AS l ON l.movie_id = m.id GROUP BY (m.id);");
	 query.on('row', function(row) { 
         film_list.push(row);
		 });
		
		 
		 query.on('end', function() {
		  var row_length = 1;
		  new_results = []
		 for (var i=0; i<film_list.length; i++){
		   new_results.push(film_list[i])
		   console.log(new_results);
		 }
         client.end()		 
         return res.end(
		 tmpl(  
                    {  
                        'film_list':new_results,
									  
									
                         'title':'Фильмы'									
              
                   }  
				   )  
		 ) 
		 
	 });
   });
});
 
