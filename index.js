var pmx = require('pmx');
pmx.init({
  http : true
});

var probe = pmx.probe();
var measure = probe.counter({
  name        : 'Unique visitors',
  unit        : 'visitors',
  measurement : 'mean'
});

var express = require('express')
    , favicon = require('serve-favicon')
    , cookieParser = require('cookie-parser')
    , morgan = require('morgan')
    , path = require('path')
    , uid = require('uid-safe')
    , pmongo = require('promised-mongo')
    , app = express()
    , port = process.env.PORT || 3000
    , router = express.Router();

var bd = pmongo('localhost/baza', ['visitors']);

var measure_int = setInterval(function() {
  bd.visitors.find({
      query: {_id: '__BAZA__'}
  })
  .then(function(doc){
    measure.update(doc.track_id.length);
  })
  .catch(function(e){
    measure.update(-1)
  })
}, 3000);

app.use(express.static(path.join(__dirname, 'public')));
app.use(favicon(__dirname + '/public/img/favicon.ico'));

app.use(cookieParser('baza2soon'));
app.use(function(req, res, next) {
  console.log(req.cookies['track_id'])
  if(!req.cookies['track_id']) {
    res.cookie('track_id', uid.sync( 32 ), { maxAge: 900000, httpOnly: true });
  }
  next();
});

app.use(function(req, res, next) {
  bd.visitors.findAndModify({
      query: {_id: '__BAZA__'},
      update: {$addToSet: {ids: req.cookies['track_id']}},
      new: true,
      upsert:true
  })
  .then(function(doc){
    next()
  })
  .catch(function(e){
    next()
  })
});

app.use(morgan('dev'));
app.set('views', __dirname + '/views');
app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');

router.get('/', function(req, res, next) {
    res.render('index.html');
});

app.use('/', router);

app.use(function(req, res, next) {
  res.render('404.html');
});

app.listen(port);
console.log('App running on port', port);

process.on('SIGINT', function() {
   clearInterval(measure_int);
  bd.close();

  setTimeout(function() {
    process.exit(0);
  }, 300);
});
