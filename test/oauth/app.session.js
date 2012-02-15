
/**
 * Module dependencies.
 */
var config = {
    "secrets" : {
        "clientId" : "YEQEXVPVKYHABGZ51TIRHMUB2OS5TDK4M4ODCVTBGZR1IZI3",
        "clientSecret" : "CQG1WGHH54X1AHTGU2CBZM0DTJHWGOAOVEP0XRXNX45T4T4H",
        "redirectUrl" : "http://4teg.zubte.com:3000/ok"
    }
}

var foursquare = require("node-foursquare")(config);

var express = require('express')
  , routes = require('./routes');

var app = module.exports = express.createServer();

// Configuration
app.configure(function () {
    app.set('views', __dirname + '/views');
    app.set('view engine', 'jade');
    app.use(express.bodyParser());
    app.use(express.methodOverride());
    app.use(express.cookieParser());                   // needed for sessions
    app.use(express.session({secret: "sarasa"}));      // store sessions in memory
    app.use(app.router);
    app.use(express.static(__dirname + '/public'));
});

app.configure('development', function () {
    app.use(express.errorHandler({ dumpExceptions: true, showStack: true })); 
});

app.configure('production', function () {
    app.use(express.errorHandler()); 
});
// Routes

app.get('/', routes.index);

app.get('/auth', function (req, res) {
    res.writeHead(303, { "location": foursquare.getAuthClientRedirectUrl() });
    res.end();

});

app.get('/logout', function (req, res) {
    if (req.session) {
        req.session.accessToken = null;
        res.clearCookie('connect.sid');
        req.session.destroy(function () {});
    }
    res.redirect('/');
});

function loginRequired (req, res, next) {
    if (req.session.accessToken) {
        next();
    } else {
        res.redirect('/auth');
    }
}

app.get('/ok', function (req, res, next) {
    foursquare.getAccessToken({
        code: req.query.code
    }, function (error, accessToken) {
        if (error) {
            res.send("An error was thrown: " + error.message);
        } else {
            req.session.accessToken = accessToken; // accessToken to session
            res.send('it s work mother fucker');
        }
    });
});

app.get('/user', loginRequired, function (req, res, next) {
    foursquare.Users.getUser('self', req.session.accessToken, function (error, data) {
        if (error) {
            res.send(error);
        } else {
            res.send(data);
        }
    })
});

app.get('/')

app.listen(3000);
console.log("Express server listening on port %d in %s mode", app.address().port, app.settings.env);


