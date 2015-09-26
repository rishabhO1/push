var mongoose = require('mongoose');
var moment = require('moment');
mongoose.connect('mongodb://localhost/test');
var Event = require('./app/models/event');

// Send daily emails
sendDaily = function(){
  Event.find({
      'recurrence':'Daily',
      'fromDate':{$lte:moment().startOf('day').toDate().toISOString()},
      'untilDate':{$gte:moment().startOf('day').toDate().toISOString()}
    },function (err, events){
      eventsToBeSent.concat(events);
      console.log('Daily events: '+events.length);
      sendNone();
  });
}

// Send no recurrence emails
sendNone = function(){
  Event.find({
      'recurrence':'None',
      'fromDate':moment().startOf('day').toDate().toISOString()
    },function (err, events){
      eventsToBeSent.concat(events);
      console.log('None events: '+events.length);
      sendWeekly();
  });
}

// Send weekly emails
sendWeekly = function(){
  day = moment().startOf("day").toDate().getDay();
  Event.find({
      'recurrence':'Weekly',
      'fromDate':{$lte:moment().startOf('day').toDate().toISOString()},
      'untilDate':{$gte:moment().startOf('day').toDate().toISOString()},
      '$where': 'return this.fromDate.getDay() == '+ day
    },function (err, events){
      eventsToBeSent.concat(events);
      console.log('Weekly events: '+events.length);
      sendMonthly()
  })
}

// Send monthly emails
sendMonthly = function(){
  date = moment().startOf("day").toDate().getDate();
  Event.find({
      'recurrence':'Monthly',
      'fromDate':{$lte:moment().startOf('day').toDate().toISOString()},
      'untilDate':{$gte:moment().startOf('day').toDate().toISOString()},
      '$where': 'return this.fromDate.getDate() == '+ date
    },function (err, events){
      eventsToBeSent.concat(events);
      console.log('Monthly events: '+events.length);
      mongoose.connection.close();
  })
}

eventsToBeSent = [];
sendDaily();
