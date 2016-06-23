var express = require('express')
    , morgan = require('morgan')
    , path = require('path')
    , app = express()
    , port = process.env.PORT || 3000
    , router = express.Router();

app.use(express.static(path.join(__dirname, 'public')));
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
