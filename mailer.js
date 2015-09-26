var mongoose = require('mongoose');
var moment = require('moment');
mongoose.connect('mongodb://localhost/test');
var Event = require('./app/models/event');
var MailingList = require('./app/models/mailingList.js');
var _und = require('underscore');

// Send daily emails
sendDaily = function(){
  Event.find({
      'recurrence':'Daily',
      'fromDate':{$lte:moment().startOf('day').toDate().toISOString()},
      'untilDate':{$gte:moment().startOf('day').toDate().toISOString()}
    },function (err, events){
      eventsToBeSent = eventsToBeSent.concat(events);
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
      eventsToBeSent = eventsToBeSent.concat(events);
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
      eventsToBeSent = eventsToBeSent.concat(events);
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
      eventsToBeSent = eventsToBeSent.concat(events);
      console.log('Monthly events: '+events.length);
      mongoose.connection.close();
      groupIt();
  })
}

groupIt = function(){
  // add mailingListId to events and then change the grouping to mailingListId
  grouped = _und.groupBy(eventsToBeSent, 'mailingListName');
  for(mailingListName in grouped){
    sendEmailForMailingList(mailingListName, grouped[mailingListName]);
  }
}

eventsToBeSent = [];
sendDaily();

// group by mailing list id


sendEmailForMailingList = function(mailingListId, events) {
  console.log(MailingList.find({
    'name': mailingListId
  }, function(err, mailingList){
    console.log('here');
    console.log(mailingList);
    // console.log(events);
    // emails = getEmailOfSubscribers(mailingListId);
    // emailMessage = createMessage(events);
  })
             )
}
