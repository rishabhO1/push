// server.js

// BASE SETUP
// =============================================================================

// call the packages we need
var express    = require('express');        // call express
var app        = express();                 // define our app using express
var bodyParser = require('body-parser');

// getting-started.js
var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/test');

var Event = require('./app/models/event');

// configure app to use bodyParser()
// this will let us get the data from a POST
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

var port = process.env.PORT || 8080;        // set our port

// ROUTES FOR OUR API
// =============================================================================
var router = express.Router();              // get an instance of the express Router

// middleware to use for all requests
router.use(function(req, res, next) {
  // do logging
  console.log('Something is happening.');
  res.header("Access-Control-Allow-Origin", "*");
  res.header('Access-Control-Allow-Methods', 'OPTIONS,GET,POST,PUT,DELETE');
  res.header("Access-Control-Allow-Headers", "Content-Type, Authorization, X-Requested-With");
  if ('OPTIONS' == req.method){
    return res.send(200);
  }
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next(); // make sure we go to the next routes and don't stop here
});

// test route to make sure everything is working (accessed at GET http://localhost:8080/api)
router.get('/', function(req, res) {
  res.json({ message: 'hooray! welcome to our api!' });
});

// more routes for our API will happen here

// on routes that end in /events
// ----------------------------------------------------


router.route('/events')

// create a event (accessed at POST http://localhost:8080/api/events)
.post(function(req, res) {
  console.log(req.body);

  var event = new Event();      // create a new instance of the Event model
  event.name = req.body.name;  // set the events name (comes from the request)

  // save the event and check for errors
  event.save(function(err) {
    if (err)
      res.send(err);

    res.json({ message: 'Event created!' });
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

    event.name = req.body.name;  // update the events info

    // save the event
    event.save(function(err) {
      if (err)
        res.send(err);

      res.json({ message: 'Event updated!' });
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

    res.json({ message: 'Successfully deleted' });
  });
});

// REGISTER OUR ROUTES -------------------------------
// all of our routes will be prefixed with /api
app.use('/api', router);

// START THE SERVER
// =============================================================================
app.listen(port);
console.log('Magic happens on port ' + port);
