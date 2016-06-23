var pmx = require('pmx');
pmx.init({
  http : true
});

var probe = pmx.probe();
var measureUniq = probe.metric({
  name        : 'Unique visitors',
  unit        : 'visitors'
});

var measureTotal = probe.metric({
  name        : 'Total views',
  unit        : 'views'
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
    , router = express.Router()
    , maxAge = 10 * 24 * 60 * 60 * 1000;

var bd = pmongo('localhost/baza', ['visitors']);

var measure_int = setInterval(function() {
  bd.visitors.find().toArray()
    .then(function(docs){
      docs.forEach(function(doc){
        if (doc._id === '__BAZA-TOTAL__') {
          measureTotal.set(doc.total);
        } else if (doc._id === '__BAZA__') {
          measureUniq.set(doc.ids.length);
        }
      })
    })
    .catch(function(e){
      measureTotal.set(-1)
      measureUniq.set(-1)
    })
}, 2500);

app.use(express.static(path.join(__dirname, 'public')));
app.use(favicon(__dirname + '/public/img/favicon.ico'));

app.use(cookieParser('baza2soon'));
app.use(function(req, res, next) {
  if(!req.cookies['baza']) {
    var id = uid.sync( 32 );
    req.cookies['baza'] = id;
    res.cookie('baza',id , { maxAge: maxAge, httpOnly: true });
  }
  next();
});

app.use(function(req, res, next) {
  bd.visitors.findAndModify({
      query: {_id: '__BAZA-TOTAL__'},
      update: {$inc: {total: 1}},
      new: true,
      upsert:true
  })
  .then(function(doc){
  })
  .catch(function(e){
  })
  next();
});

app.use(function(req, res, next) {
  bd.visitors.findAndModify({
      query: {_id: '__BAZA__'},
      update: {$addToSet: {ids: req.cookies['baza']}},
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
