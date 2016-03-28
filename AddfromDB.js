var pg = require('pg'), 
    http = require('http'),  
    template = require('swig');  
	
      
      
    var server = new http.Server(),  
        connectionString = "postgres://postgres:postgres@localhost:5432/market";  
		
      
    server.listen(8000, '127.0.0.1');  
     
   server.on('request', function(req, res){
   var tmpl = template.compileFile('./templates/1.html'),  
      film_list = [];  
 
   
    pg.connect(connectionString, function(err, client, done) { 
    
    if(err) { 
      done(); 
      console.log({ success: false, data: err}); 
   } 

     var query = client.query("SELECT * FROM movie ORDER BY id ASC");
	 query.on('row', function(row) { 
         film_list.push(row);
		 });
		
		 
		 query.on('end', function() {
		  var row_length = 3;
		  new_results = []
		 for (var i=0; i<3; i++){
		   new_results.push(film_list[i])
		   console.log(new_results);
		 }
         client.end()		 
         return res.end(
		 tmpl(  
                    {  
                        'film_list':[ new_results,
						             new_results,
									 new_results,
									 new_results,
									 new_results
									],
                         'title':'Фильмы'									
              
                   }  
				   )  
		 ) 
		 
	 });
   });
});