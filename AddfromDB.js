var pg = require('pg'), 
    http = require('http'),  
    template = require('swig');  
      
      
    var server = new http.Server(),  
        connectionString = "postgres://postgres:postgres@localhost:5432/market";  
      
    server.listen(8000, '127.0.0.1');  
     
   server.on('request', function(req, res){

     console.log('Сервер работает');
   
});