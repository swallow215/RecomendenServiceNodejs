var http = require('http'),
    template = require('swig'),
    pg = require('pg'),
    express = require('express'),
    cookieParser = require('cookie-parser'),  // npm install cookie-parser
    bodyParser = require('body-parser'), // npm install body-parser
    debug = require('debug')('todo-node-postgres:server');

var router = express.Router();

var urlencodedParser = bodyParser.urlencoded({ extended: false })
var connectionString = "postgres://postgres:postgres@localhost:5432/market";
	

  

     
router.get('/', function(req, res) {
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
						'username': getUsernameFromCookie(req),								
                         'title':'Фильмы'									
              
                   }  
				   )  
		 ) 
		 
	 });
   });
});


router.get('/movie/:movie_id', function(req, res){

      var id = req.params.movie_id,
      film_list = [],
      tmpl = template.compileFile('./templates/Card.html');


      pg.connect(connectionString, function(err, client, done) {
        // Handle connection errors
        if(err) {
          done();
          console.log(err);
          return res.status(500).json({success: false, data: err});
        }

        // SQL Query > Select Data
        var query = client.query("SELECT * FROM movie WHERE id=" + id)
		'SELECT m.id, m.title, m.year, m.rank, m.poster, ARRAY_TO_JSON(ARRAY_AGG(m2.*)) as alike_movies ' +
        'FROM movie as m '+
        'JOIN movie_distance AS md ON md.movie1_id = m.id '+ // AND m1.l1 >0
        'JOIN movie AS m2 ON md.movie2_id = m2.id AND m2.id!=m.id '+
        'WHERE m.id =' + id +
        ' GROUP BY m.id;';
console.log();
        
        // Stream results back one row at a time
        query.on('row', function(row) {

            film_list.push(row);
            return res.end(
                tmpl(
                    {
                        'movie': row,
                        'username': getUsernameFromCookie(req)
                    }
                )
            )
        });

        // After all data is returned, close connection and return results
        query.on('end', function() {
            client.end()

        });

    });

})

router.get('/popular', function(req, res){

		var tmpl = template.compileFile('./templates/popular.html');
		popular_list = []; 

      pg.connect(connectionString, function(err, client, done) {
        // Handle connection errors
        if(err) {
          done();
          console.log(err);
          return res.status(500).json({success: false, data: err});
        }

        // SQL Query > Select Data
        var query = client.query("SELECT m.id, m.title, m.poster, m.year, m.rank, COUNT(id) FROM movie AS m JOIN likes AS l ON l.movie_id = m.id GROUP BY (m.id) ORDER BY COUNT(id) DESC LIMIT 10;");
	 

        // Stream results back one row at a time
        query.on('row', function(row) { 
         popular_list.push(row);
		 }); 

        // After all data is returned, close connection and return results
        query.on('end', function() {
		  var row_length = 1;
		  new_resultspop = []
		 for (var i=0; i<popular_list.length; i++){
		   new_resultspop.push(popular_list[i])
		   console.log(new_resultspop);
		 }
         client.end()		 
         return res.end(
		 tmpl(  
                    {  
                        'popular_list':new_resultspop,
						'title1':'Популярные TOP-10',
						'username': getUsernameFromCookie(req)
              
                   }  
				   )  
		 ) 
		 
	 });
   });
});

router.get('/users', function(req, res){
    user_list = [],
    tmpl = template.compileFile('./templates/users.html');


    pg.connect(connectionString, function(err, client, done) {
    // Handle connection errors
        if(err) {
          done();
          console.log(err);
          return res.status(500).json({success: false, data: err});
        }

        // SQL Query > Select Data
        var query = client.query("SELECT * FROM users");

        // Stream results back one row at a time
        query.on('row', function(row) {

            user_list.push(row);
        });

        // After all data is returned, close connection and return results
        query.on('end', function() {

            client.end()
            return res.end(
                tmpl(
                    {
                        'user_list': user_list,
                        'username': getUsernameFromCookie(req)
                    }
                )
            )
        });

    });
})

router.get('/users/:user_id', function(req, res){

      var id = req.params.user_id,
      film_list = [],
      tmpl = template.compileFile('./templates/users_dop.html');


      pg.connect(connectionString, function(err, client, done) {
        // Handle connection errors
        if(err) {
          done();
          console.log(err);
          return res.status(500).json({success: false, data: err});
		  
        }

        // SQL Query > Select Data
        var query = client.query(
        "SELECT * FROM users AS u JOIN likes AS l ON l.user_id = u.id JOIN movie AS m ON m.id=l.movie_id WHERE u.id =" + id
        );

        // Stream results back one row at a time
        query.on('row', function(row) {
            film_list.push(row);
        });

        // After all data is returned, close connection and return results
        query.on('end', function() {

            return res.end(
                tmpl(
                    {
                        'film_list': film_list,
                        'target_user': film_list[0]['name'],
                        'username': getUsernameFromCookie(req)
                    }
                )
            )
            client.end()

        });

    });

})

router.get('/urec', function(req, res){

    var user_list = [],
    username = getUsernameFromCookie(req)

    tmpl = template.compileFile('./templates/urecommend.html');

    pg.connect(connectionString, function(err, client, done) {

     var query = client.query(
        "select *  from users as u " +
        "join user_distance as ud ON u.id = ud.user1_id " +
        "join users as rec_user ON ud.user2_id = rec_user.id " +
        "where l1 <> 0 and u.name='"+ username +
        "' order by l2 DESC;"
    );

    query.on('row', function(row) {
        user_list.push(row);
    });

    // After all data is returned, close connection and return results
    query.on('end', function() {
        return res.end(
            tmpl(
                {
                    'user_list': user_list,
                    'username': getUsernameFromCookie(req)
                }
            )
        )
        client.end()

    });

  })

})




router.get('/logout', function(req, res){
    res.clearCookie('username');
    res.redirect('/');
    // Убираем куку
})

router.get('/login', function(req, res){
    // Рендерим страницу для авторизации
    var tmpl = template.compileFile('./templates/auth.html')
    return res.end(
        tmpl({})
    )
})

router.post('/login', urlencodedParser, function(req, res){  // 3 параметра!
    // Вторым параметром передаём паресер параметров запроса
    var name = unescape(req.body['username']) || null
    if (name){
    // Ставим куку, добавляем пользователя в базу если его там нет

        pg.connect(connectionString, function(err, client, done) {
            var query = client.query(
                "INSERT INTO users (name) VALUES ('"+name+"');"
            )

            query.on('end', function(){

                client.end()
                res.cookie('username', name, { maxAge: 900000 });
                res.redirect('/');
            })
        })

    } else {
        res.redirect('/login');
    }
})
router.post('/like', urlencodedParser, function(req, res){
   var user = getUsernameFromCookie(req)
   if (user){
       var movie_id = unescape(req.body['id']) || null;
           


       pg.connect(connectionString, function(err, client, done) {

           var user_query = client.query(
            "select *  from users as u "+
            "where u.name='"+user+"'"
           );


           user_query.on('row', function(row){
               user_id = row['id'];

               var query = client.query(
                   "INSERT INTO likes (user_id, movie_id) VALUES ("+user_id+","+movie_id+") "+
                   "ON CONFLICT ON CONSTRAINT likes_pkey DO UPDATE " +
                   "WHERE likes.user_id="+user_id+" AND "+" likes.movie_id="+movie_id
               )
               query.on('end',function(){
                    return res.end(
                        'done!'
                    )
               })
           })
           user_query.on('end', function(){
               client.end()
           })
       })
   } else{
        return res.end('error!')
   }
})


router.post('/login', urlencodedParser, function(req, res){  // 3 параметра!
    // Вторым параметром передаём паресер параметров запроса
    var name = req.body['username'] || null
    if (name){
        console.log(name)
    // Ставим куку, добавляем пользователя в базу если его там нет
        res.cookie('username', name, { maxAge: 900000 });
        res.redirect('/');

    } else {
        res.redirect('/login');
    }
})

var port = 8000,
    app = express();

app.set('port', port)
app.use('/', router)
app.use(cookieParser())
app.use(bodyParser.json());

var server = new http.createServer(app)
server.listen(port, '127.0.0.1');

server.on('error', onError);
server.on('listening', onListening);


function getUsernameFromCookie(req){
    if (!req.headers.cookie){return null}
    var cookies = req.headers.cookie.split('&').map(function(e){return e.split('=')})
    for (var i=0; i<cookies.length;i++){
        if (cookies[i][0] == 'username'){
            return cookies[i][1]
        }
    }
}

/**
 * Normalize a port into a number, string, or false.
 */

function normalizePort(val) {
  var port = parseInt(val, 10);

  if (isNaN(port)) {
    // named pipe
    return val;
  }

  if (port >= 0) {
    // port number
    return port;
  }

  return false;
}

/**
 * Event listener for HTTP server "error" event.
 */

function onError(error) {
  if (error.syscall !== 'listen') {
    throw error;
  }

  var bind = typeof port === 'string'
    ? 'Pipe ' + port
    : 'Port ' + port

  // handle specific listen errors with friendly messages
  switch (error.code) {
    case 'EACCES':
      console.error(bind + ' requires elevated privileges');
      process.exit(1);
      break;
    case 'EADDRINUSE':
      console.error(bind + ' is already in use');
      process.exit(1);
      break;
    default:
      throw error;
  }
}

/**
 * Event listener for HTTP server "listening" event.
 */

function onListening() {
  var addr = server.address();
  var bind = typeof addr === 'string'
    ? 'pipe ' + addr
    : 'port ' + addr.port;
  debug('Listening on ' + bind);
}
 
