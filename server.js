// server.js

// BASE SETUP
// =============================================================================

// call the packages we need

var express = require('express'),
    exphbs = require('express-handlebars'),
    logger = require('morgan'),
    cookieParser = require('cookie-parser'),
    bodyParser = require('body-parser'),
    methodOverride = require('method-override'),
    session = require('express-session'),
    passport = require('passport'),
    LocalStrategy = require('passport-local'),
    TwitterStrategy = require('passport-twitter'),
    GoogleStrategy = require('passport-google'),
    FacebookStrategy = require('passport-facebook');

var app = express(); // define our app using express
app.use(logger('combined'));
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(methodOverride('X-HTTP-Method-Override'));
app.use(session({secret: 'supernova', saveUninitialized: true, resave: true}));
app.use(passport.initialize());
app.use(passport.session());


// Configure express to use handlebars templates
var hbs = exphbs.create({
    defaultLayout: 'main', //we will be creating this layout shortly
});
app.engine('handlebars', hbs.engine);
app.set('view engine', 'handlebars');

// Session-persisted message middleware
app.use(function(req, res, next){
  var err = req.session.error,
      msg = req.session.notice,
      success = req.session.success;

  delete req.session.error;
  delete req.session.success;
  delete req.session.notice;

  if (err) res.locals.error = err;
  if (msg) res.locals.notice = msg;
  if (success) res.locals.success = success;

  next();
});

// getting-started.js
var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/test');

var Event = require('./app/models/event');
var MailingList = require('./app/models/mailingList');

// configure app to use bodyParser()
// this will let us get the data from a POST
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json());

var port = process.env.PORT || 8080; // set our port

// ROUTES FOR OUR API
// =============================================================================
var router = express.Router(); // get an instance of the express Router




// middleware to use for all requests
router.use(function(req, res, next) {
    // do logging
    console.log('Something is happening.');
    res.header("Access-Control-Allow-Origin", "*");
    res.header('Access-Control-Allow-Methods', 'OPTIONS,GET,POST,PUT,DELETE');
    res.header("Access-Control-Allow-Headers", "Content-Type, Authorization, X-Requested-With");
    if ('OPTIONS' == req.method) {
        return res.sendStatus(200);
    }
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next(); // make sure we go to the next routes and don't stop here
});

// test route to make sure everything is working (accessed at GET http://localhost:8080/api)
router.get('/', function(req, res) {
    res.json({
        message: 'hooray! welcome to our api!'
    });
});

// more routes for our API will happen here

// on routes that end in /events
// ----------------------------------------------------


router.route('/events')

// create a event (accessed at POST http://localhost:8080/api/events)
.post(function(req, res) {
        console.log(req.body);

        var event = new Event(); // create a new instance of the Event model
        event.eventName = req.body.eventName; // set the events name (comes from the request)
        event.Time = req.body.Time;
        event.fromDate = req.body.fromDate;
        event.untilDate = req.body.untilDate;
        event.Description = req.body.Description;
        event.eventListName = req.body.eventListName; 

        // save the event and check for errors
        event.save(function(err) {
            if (err)
                res.send(err);

            res.json({
                message: 'Event created!'
            });
        });
    })
    .get(function(req, res) {
        Event.find(function(err, events) {
            if (err)
                res.send(err);

            res.json(events);
        });
    });

// on routes that end in /events/:event_id
// ----------------------------------------------------
router.route('/events/:event_id')

// get the event with that id (accessed at GET http://localhost:8080/api/events/:event_id)
.get(function(req, res) {
    Event.findById(req.params.event_id, function(err, event) {
        if (err)
            res.send(err);
        res.json(event);
    });
})

// update the event with this id (accessed at PUT http://localhost:8080/api/events/:event_id)
.put(function(req, res) {

    // use our event model to find the event we want
    Event.findById(req.params.event_id, function(err, event) {

        if (err)
            res.send(err);

        event.eventName = req.body.eventName; // set the events name (comes from the request)
        event.Time = req.body.Time;
        event.fromDate = req.body.fromDate;
        event.untilDate = req.body.untilDate;
        event.Description = req.body.Description;
        event.eventListName = req.body.eventListName;   // update the events info

        // save the event
        event.save(function(err) {
            if (err)
                res.send(err);

            res.json({
                message: 'Event updated!'
            });
        });

    });
})

// delete the event with this id (accessed at DELETE http://localhost:8080/api/events/:event_id)
.delete(function(req, res) {
    Event.remove({
        _id: req.params.event_id
    }, function(err, event) {
        if (err)
            res.send(err);

        res.json({
            message: 'Successfully deleted'
        });
    });
});









// on routes that end in /mailingLists
// ----------------------------------------------------


router.route('/mailingLists')

// create a mailingList (accessed at POST http://localhost:8080/api/mailingLists)
.post(function(req, res) {
        console.log(req.body);

        var mailingList = new MailingList(); // create a new instance of the mailingList model
        mailingList.name = req.body.name;

        // save the mailingList and check for errors
        mailingList.save(function(err) {
            if (err)
                res.send(err);

            res.json({
                message: 'mailingList created!'
            });
        });
    })
    .get(function(req, res) {
        MailingList.find(function(err, mailingLists) {
            if (err)
                res.send(err);

            res.json(mailingLists);
        });
    });

// on routes that end in /mailingLists/:mailingList_id
// ----------------------------------------------------
router.route('/mailingLists/:mailingList_id')

// get the mailingList with that id (accessed at GET http://localhost:8080/api/mailingLists/:mailingList_id)
.get(function(req, res) {
    MailingList.findById(req.params.mailingList_id, function(err, mailingList) {
        if (err)
            res.send(err);
        res.json(mailingList);
    });
})

// update the mailingList with this id (accessed at PUT http://localhost:8080/api/mailingLists/:mailingList_id)
.put(function(req, res) {

    // use our mailingList model to find the mailingList we want
    MailingList.findById(req.params.mailingList_id, function(err, mailingList) {

        if (err)
            res.send(err);

        mailingList.name = req.body.name;

        // save the mailingList
        mailingList.save(function(err) {
            if (err)
                res.send(err);

            res.json({
                message: 'mailingList updated!'
            });
        });

    });
})

// delete the mailingList with this id (accessed at DELETE http://localhost:8080/api/mailingLists/:mailingList_id)
.delete(function(req, res) {
    MailingList.remove({
        _id: req.params.mailingList_id
    }, function(err, mailingList) {
        if (err)
            res.send(err);

        res.json({
            message: 'Successfully deleted'
        });
    });
});


// REGISTER OUR ROUTES -------------------------------
// all of our routes will be prefixed with /api
app.use('/api', router);

app.post('/login', passport.authenticate('local', { successRedirect: '/',
                                                    failureRedirect: '/login' }));

// START THE SERVER
// =============================================================================
app.listen(port);
console.log('Magic happens on port ' + port);
