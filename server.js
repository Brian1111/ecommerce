var express = require('express');
var morgan = require('morgan');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');
var ejs = require('ejs');
var engine = require('ejs-mate');
var session = require('express-session');
var cookieParser = require('cookie-parser');
var flash = require('express-flash');
var MongoStore = require('connect-mongo/es5')(session);
var passport = require('passport');
var secret = require('./config/secret');
var User = require('./models/user');
var Category = require('./models/category');
var cartLength = require('./middlewares/middlewares');

var app = express();

mongoose.connect(secret.database, function(err) {
    if (err) {
        console.log(err);
    } else {
        console.log("Connected to the database");
    }
});

// Middleware
app.use(express.static(__dirname + '/public'));
app.use(morgan('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(session({
    resave: true,
    saveUninitialized: true,
    secret: secret.secretKey,
    store: new MongoStore({ url: secret.database, autoReconnect: true })
}));
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());
app.use(function(req, res, next) {
    res.locals.user = req.user;
    next();
});

app.use(cartLength);
app.use(function(req, res, next) {
    Category.find({}, function(err, categories) {
        if (err) return next(err);
        res.locals.categories = categories;
        next();
    });
});

app.engine('ejs', engine);
app.set('view engine', 'ejs');

var mainRoutes = require('./routes/main');
var userRoutes = require('./routes/user');
var adminRoutes = require('./routes/admin');
var apiRoutes = require('./api/api');

app.use(mainRoutes);
app.use(userRoutes);
app.use(adminRoutes);
app.use('/api', apiRoutes);

app.listen(secret.port, function(err) {
    if (err) throw err;
    console.log("Server is Running on port " + secret.port);
});


// Bonsai Elasticsearch
var bonsai_url = process.env.BONSAI_URL;
var elasticsearch = require('elasticsearch');
var client = new elasticsearch.Client({
    host: bonsai_url,
    log: 'trace'
});


// Test the connection...
client.ping({
        requestTimeout: 30000,
        hello: "elasticsearch"
    },
    function(error) {
        if (error) {
            console.error('elasticsearch cluster is down!');
        } else {
            console.log('All is well');
        }
    }
);