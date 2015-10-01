// server.js

// BASE SETUP
// =============================================================================

var port = process.env.PORT || 8080; // set our port

// Connecting MongoDB using mongoose
var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/test');

// call the packages we need
var flash = require('connect-flash');
var express = require('express'); // call express
var bodyParser = require('body-parser'); // call body parser
var bCrypt = require('bcrypt-nodejs'); // call bcrypt

var app = express(); // define our app using express
var Event = require('./app/models/event');
var MailingList = require('./app/models/mailingList');
var User = require('./app/models/user');

// Validates password using bCrypt hash
var isValidPassword = function(user, password) {
  return bCrypt.compareSync(password, user.password);
}

// Generates hash using bCrypt
var createHash = function(password) {
  console.log(password);
  return bCrypt.hashSync(password, bCrypt.genSaltSync(10), null);
}

// configure app to use bodyParser()
// this will let us get the data from a POST
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(bodyParser.json());

// Configuring Passport
var passport = require('passport');
var expressSession = require('express-session');
var LocalStrategy = require('passport-local').Strategy;
app.use(expressSession({
  secret: 'mySecretKey',
  resave: true,
  saveUninitialized: true
}));
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());
app.set('view engine', 'jade');

passport.serializeUser(function(user, done) {
  done(null, user._id);
});

passport.deserializeUser(function(id, done) {
  User.findById(id, function(err, user) {
    done(err, user);
  });
});

// passport/login.js
passport.use('login', new LocalStrategy({
  passReqToCallback: true
},
function(req, username, password, done) {
  // check in mongo if a user with username exists or not
  User.findOne({
    'username': username
  },
  function(err, user) {
    // In case of any error, return using the done method
    if (err)
      return done(err);
    // Username does not exist, log error & redirect back
    if (!user) {
      console.log('User Not Found with username ' + username);
      return done(null, false,
                  req.flash('message', 'User Not found.'));
    }
    // User exists but wrong password, log the error
    if (!isValidPassword(user, password)) {
      console.log('Invalid Password');
      return done(null, false,
                  req.flash('message', 'Invalid Password'));
    }
    // User and password both match, return user from
    // done method which will be treated like success
    return done(null, user);
  }
);
}));

// passport/signup.js
passport.use('signup', new LocalStrategy({
  passReqToCallback: true
},
function(req, username, password, done) {
  findOrCreateUser = function() {
    // find a user in Mongo with provided username
    User.findOne({
      'username': username
    }, function(err, user) {
      // In case of any error return
      if (err) {
        console.log('Error in SignUp: ' + err);
        return done(err);
      }
      // already exists
      if (user) {
        console.log('User already exists');
        return done(null, false,
                    req.flash('message', 'User Already Exists'));
      } else {
        // if there is no user with that email
        // create the user
        var newUser = new User();
        // set the user's local credentials
        newUser.username = username;
        newUser.password = createHash(password);
        newUser.email = req.param('email');
        newUser.contact = req.param('contact');

        // save the user
        newUser.save(function(err) {
          if (err) {
            console.log('Error in Saving user: ' + err);
            throw err;
          }
          console.log('User Registration succesful');
          return done(null, newUser);
        });
      }
    });
  };
  // Delay the execution of findOrCreateUser and execute
  // the method in the next tick of the event loop
  process.nextTick(findOrCreateUser);
}
));

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

// As with any middleware it is quintessential to call next()
// if the user is authenticated
var isAuthenticated = function(req, res, next) {
  if (req.isAuthenticated())
    return next();
  res.redirect('/');
}

// more routes for our API will happen here

// on routes used in authentication
// ----------------------------------------------------

/* GET login page. */
router.get('/', function(req, res) {
  // Display the Login page with any flash message, if any
  res.render('index', {
    message: req.flash('message')
  });
});

/* Handle Login POST */
router.post('/login', function(req, res, next) {
  passport.authenticate('login', function(err, user, info) {
    if (err) {
      return next(err); // will generate a 500 error
    }
    // Generate a JSON response reflecting login
    if (!user) {
      return res.send({
        success: false,
        message: 'login failed'
      });
    }
    return res.send({
      id: req.sessionID,
      user: {
        id: user.username,
        role: "guest",
        mailingLists: user.mailingLists,
      },
      success: true,
      message: 'login succeeded'
    });
  })(req, res, next);
});

/* GET Registration Page */
router.get('/signup', function(req, res) {
  res.render('register', {
    message: req.flash('message')
  });
});

router.post('/signup', function(req, res, next) {
  passport.authenticate('signup', function(err, user, info) {
    if (err) {
      return next(err); // will generate a 500 error
    }
    // Generate a JSON response reflecting signup
    if (!user) {
      return res.send({
        success: false,
        message: 'signup failed'
      });
    }
    return res.send({
      id: req.sessionID,
      user: {
        id: user.username,
        role: "guest"
      },
      success: true,
      message: 'signup succeeded'
    });
  })(req, res, next);
});

/* Handle Logout */
router.get('/signout', function(req, res) {
  req.logout();
  res.redirect('/');
});

/* GET Home Page */
router.get('/dashboard', isAuthenticated, function(req, res) {
  res.render('dashboard', {
    user: req.user
  });
});

router.post('/subscribe', function(req,res) {
  var username = req.body.username;
  var mailingListId= req.body.mailingListId;
  User.update({username: username},{$addToSet: {mailingLists:mailingListId}},{upsert:true},function(err){
      if(err){
        res.json({ message: err });
      }else{
        res.json({ message: 'Success' });
      }
  });
});

router.post('/unsubscribe', function(req,res) {
  var username = req.body.username;
  var mailingListId= req.body.mailingListId;
  User.update({username: username},{$pull: {mailingLists:mailingListId}},function(err){
      if(err){
        res.json({ message: err });
      }else{
        res.json({ message: 'Success' });
      }
  });
});

router.post('/addtoml', function(req,res) {
  var name = req.body.mailingListName;
  var eventId= req.body.event_id;
  MailingList.update({name: name}, {$addToSet: {events:eventId}},{upsert:true},function(err){
      if(err){
        res.json({ message: err });
      }else{
        res.json({ message: 'Success' });
      }
  });
});

router.post('/removefromml', function(req,res) {
  var name = req.body.mailingListName;
  var eventId= req.body.event_id;
  MailingList.update({name: name}, {$pull: {events:eventId}},function(err){
      if(err){
        res.json({ message: err });
      }else{
        res.json({ message: 'Success' });
      }
  });
});

// on routes that end in /events
// ----------------------------------------------------
router.route('/events')

// create a event (accessed at POST http://localhost:8080/api/events)
.post(function(req, res) {
  console.log(req.body);

  var event = new Event(); // create a new instance of the Event model
  event.eventName = req.body.eventName; // set the events name (comes from the request)
  event.Time = new Date(req.body.Time);
  event.fromDate = new Date(req.body.fromDate);
  event.untilDate = new Date(req.body.untilDate);
  event.Description = req.body.Description;
  event.recurrence = req.body.recurrence;
  event.mailingListName = req.body.mailingListName;

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
    event.Time = new Date(req.body.Time);
    event.fromDate = new Date(req.body.fromDate);
    event.untilDate = new Date(req.body.untilDate);
    event.Description = req.body.Description;
    event.recurrence = req.body.recurrence;
    event.mailingListName = req.body.mailingListName; // update the events info
    
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

// START THE SERVER
// =============================================================================
app.listen(port);
console.log('Magic happens on port ' + port);
