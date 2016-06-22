var express = require('express')
    , morgan = require('morgan')
    , app = express()
    , port = process.env.PORT || 3000
    , router = express.Router();

app.use(express.static(__dirname + '/public')); // set the static files location /public/img will be /img for users
app.use(morgan('dev'));                     // log every request to the console

router.get('/', function(req, res, next) {
    res.render('index.html');
});

app.use('/', router);

app.listen(port);
console.log('App running on port', port);
