var express = require('express'),
    path = require('path'),
    consolidate = require('consolidate');

var isDev = process.env.NODE_ENV !== 'production';
var app = express();
var port = 1234;
var uuid = require('node-uuid').v4;
const sessions = { run: {}, log: {} };

app.engine('html', consolidate.ejs);
app.set('view engine', 'html');
app.set('views', path.resolve(__dirname, './server/views'));

// local variables for all views
app.locals.env = process.env.NODE_ENV || 'dev';
app.locals.reload = true;

if (isDev) {

    // static assets served by webpack-dev-middleware & webpack-hot-middleware for development
    var webpack = require('webpack'),
        webpackDevMiddleware = require('webpack-dev-middleware'),
        webpackHotMiddleware = require('webpack-hot-middleware'),
        webpackDevConfig = require('./webpack.config.js');

    var compiler = webpack(webpackDevConfig);

    // attach to the compiler & the server
    app.use(webpackDevMiddleware(compiler, {

        // public path should be the same with webpack config
        publicPath: webpackDevConfig.output.publicPath,
        noInfo: true,
        stats: {
            colors: true
        }
    }));
function ping(type, id) {
  console.log('sending ping to %s', id);
  let res = sessions[type][id];
  if (res.connection.writable) {
    res.write('eventId: 0\n\n');
  } else {
    // remove the res object if it's no longer writable
    delete sessions[type][id];
  }
}

/*setInterval(() => {
  Object.keys(sessions.run).forEach(ping.bind(null, 'run'));
  Object.keys(sessions.log).forEach(ping.bind(null, 'log'));
}, 25 * 1000);*/

setInterval(function () {
    Object.keys(sessions.run).forEach(ping.bind(null, 'run'));
    Object.keys(sessions.log).forEach(ping.bind(null, 'log'));
},25*1000);

app.get('/remote/:id?', (req, res) => {
  let query = req.query;
  let id = req.params.id || uuid();
  res.writeHead(200, {'Content-Type': 'text/javascript'});
  res.end((query.callback || 'callback') + '("' + id + '");');
});
app.get('/remote/:id?', (req, res) => {
  let query = req.query;
  let id = req.params.id || uuid();
  res.writeHead(200, {'Content-Type': 'text/javascript'});
  res.end((query.callback || 'callback') + '("' + id + '");');
});

app.get('/remote/:id/log', (req, res) => {
  let id = req.params.id;
  res.writeHead(200, {
    'Content-Type': 'text/event-stream',
    'Cache-Control': 'no-cache',
  });
  res.write('eventId: 0\n\n');

  sessions.log[id] = res;
  sessions.log[id].xhr = req.headers['x-requested-with'] === 'XMLHttpRequest';
});

app.get('/remote/:id/run', function (req, res) {
  let id = req.params.id;
  res.writeHead(200, {
    'Content-Type': 'text/event-stream',
    'Cache-Control': 'no-cache',
  });
  res.write('eventId: 0\n\n');
  sessions.run[id] = res;
  sessions.run[id].xhr = req.headers['x-requested-with'] === 'XMLHttpRequest';
});

app.post('/remote/:id/run', (req, res) => {
  let id = req.params.id;

  console.log('post run: %s', id, req.body);

  if (sessions.run[id]) {
    sessions.run[id].write(`data: ${req.body.data}\neventId:${ ++eventId}\n\n`);

    if (sessions.run[id].xhr) {
      sessions.run[id].end(); // lets older browsers finish their xhr request
    }
  }
  res.writeHead(200, { 'Content-Type': 'text/plain' });
  res.end();
});
app.post('/remote/:id/log', (req, res) => {
  // post made to send log to jsconsole
  let id = req.params.id;
  // passed over to Server Sent Events on jsconsole.com
  if (sessions.log[id]) {
    sessions.log[id].write(`data: ${req.body.data}\neventId:${ ++eventId}\n\n`);

    if (sessions.log[id].xhr) {
      sessions.log[id].end(); // lets older browsers finish their xhr request
    }
  }

  res.writeHead(200, { 'Content-Type': 'text/plain' });
  res.end();
});

/*app.get(, restify.serveStatic({
  directory: __dirname + '/public',
  default: 'index.html',
}));*/
    app.use(webpackHotMiddleware(compiler));

    require('./server/routes')(app);

    // add "reload" to express, see: https://www.npmjs.com/package/reload
    var reload = require('reload');
    var http = require('http');

    var server = http.createServer(app);
    reload(server, app);

    server.listen(port, function(){
        console.log('App (dev) is now running on port 3000!');
    });
} else {
    // static assets served by express.static() for production
    app.use(express.static(path.join(__dirname, 'public')));
    require('./server/routes')(app);
    app.listen(port, function () {
        console.log('App (production) is now running on port 3000!');
    });
}
