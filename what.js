var http = require('http'),
    template = require('swig'),
    pg = require('pg'),
    express = require('express'),
    cookieParser = require('cookie-parser'), 
    bodyParser = require('body-parser'),
    debug = require('debug')('todo-node-postgres:server');

var router = express.Router();

var urlencodedParser = bodyParser.urlencoded({ extended: false })
var connectionString = "postgres://postgres:postgres@localhost:5432/allinfo";


router.get('/', function(req, res) {

    var tmpl = template.compileFile('./templates/1.html'),
        film_list = [];

    pg.connect(connectionString, function(err, client, done) {
        // Handle connection errors
        if(err) {
          done();
          console.log(err);
          return res.status(500).json({success: false, data: err});
        }

        // SQL Query > Select Data
        var query = client.query("SELECT * FROM movie ORDER BY id DESC");

        // Stream results back one row at a time
        query.on('row', function(row) {
            film_list.push(row);
        });

        // After all data is returned, close connection and return results
        query.on('end', function() {
            client.end()
            return res.end(
                tmpl(
                    {
                        'film_list': film_list,
                        'title': 'Кино для всех',
                        'username': getUsernameFromCookie(req)
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
        var query = client.query("SELECT * FROM movie WHERE id=" + id);

        // Stream results back one row at a time
        query.on('row', function(row) {

            film_list.push(row);
            return res.end(
                tmpl(
                    {
                        'film': row,
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

router.get('/logout', function(req, res){
    res.clearCookie('username');
    res.redirect('/');
    // Убираем куку
})

router.get('/login', function(req, res){
    // Рендерим страницу для авторизации
    var tmpl = template.compileFile('./templates/авторизация.html')
    return res.end(
        tmpl({})
    )
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

var port = 8008,
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