
/**
 * Module dependencies.
 */
var config = {
    secrets: {
        clientId:     "YEQEXVPVKYHABGZ51TIRHMUB2OS5TDK4M4ODCVTBGZR1IZI3",
        clientSecret: "CQG1WGHH54X1AHTGU2CBZM0DTJHWGOAOVEP0XRXNX45T4T4H",
        redirectUrl:  "http://4teg.zubte.com:3000/foursquare"

        //clientId:     "ER01KARUFNZGAFV330TW2QYZXOK42C1P1M1NXBT0EG2TE2G4",
        //clientSecret: "M5LD5XHRTNQ0UJLYONDBRURMSQHXQ4FELAEXOHF0DLKRGQFP",
        //redirectUrl:  "http://4teg.calcifer.com.ar/foursquare"
    }
}

var foursquare = require("./lib/foursquare")(config);

var express = require('express')
  , routes = require('./routes');

var app = module.exports = express.createServer();

// Configuration
app.configure(function () {
    app.set('views', __dirname + '/views');
    app.set('view engine', 'jade');
    app.set('view options', {layout: false});
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


function loginRequired (req, res, next) {
    if (req.session.accessToken) {
        next();
    } else {
        res.redirect('/login');
    }
}

// ------
// Routes
// ------

app.get('/', loginRequired, function(req, res) {
    res.render('index', { title: '4TEG' });
});

app.get('/login', function(req, res) {
    res.render('login', { title: 'Login',
                          url: foursquare.getAuthClientRedirectUrl()})
});

app.get('/logout', function (req, res) {
    if (req.session) {
        req.session.accessToken = null;
        res.clearCookie('connect.sid');
        req.session.destroy(function () {});
    }
    res.redirect('/');
});

app.get('/foursquare', function (req, res, next) {
    foursquare.getAccessToken({
        code: req.query.code
    }, function (error, accessToken) {
        if (error) {
            res.send("An error was thrown: " + error.message);
        } else {
            req.session.accessToken = accessToken; // accessToken to session
            res.redirect('/');
        }
    });
});

app.get('/user', loginRequired, function (req, res, next) {
    foursquare.Users.getUser('self', req.session.accessToken, function (error, data) {
        if (error) {
            res.send(error);
        } else {
            res.render('user', { title: 'User', data: data});
        }
    })
});

app.get('/explore', loginRequired, function (req, res, next) {
    var lat = req.query.lat;
    var lng = req.query.lng;
    var params = {};
    foursquare.Venues.explore(lat, lng, params, req.session.accessToken,
        function (error, data) {
            if (error) {
                res.send(error);
            } else {
                res.render('explore', { title: 'Explore', data: data.groups[0]  });
            }
    })
});

app.get('/checkin', loginRequired, function (req, res, next) {
    var venueId = req.query.id;
    
    var params = {};
    foursquare.Checkin.add(venueId, params, req.session.accessToken,
        function (error, data) {
            if (error) {
                res.send(error);
            } else {
                res.render('checkinResult', { title: 'Checkin Result', data: data.groups[0]  });
            }
    })
});

app.get('/venue', loginRequired, function (req, res, next) {
    var id = req.query.id;
    foursquare.Venues.getVenue(id, req.session.accessToken,
        function (error, data) {
            if (error) {
                res.send(error);
            } else {
                res.render('venue', { title: 'Venue', data: data });
            }
    })
});

app.listen(3000);
console.log("Express server listening on port %d in %s mode", app.address().port, app.settings.env);


