var mongoose = require('mongoose');
var mandrill = require('mandrill-api/mandrill');
var mandrill_client = new mandrill.Mandrill(process.env['MANDRILL_API_KEY']);
var moment = require('moment');
mongoose.connect('mongodb://localhost/test');
var Event = require('./app/models/event');
var MailingList = require('./app/models/mailingList.js');
var User = require('./app/models/user.js');
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
      groupIt();
  })
}

// group by mailing list id
groupIt = function(){
  // add mailingListId to events and then change the grouping to mailingListId
  grouped = _und.groupBy(eventsToBeSent, 'mailingListName');
  totalMailingListsToBeProcessed = Object.keys(grouped).length;
  for(mailingListName in grouped){
    consolidateEmailsForMailingList(mailingListName, grouped[mailingListName]);
  }
}

// consolidate notifications to be send to each user
consolidateEmailsForMailingList = function(mailingListId, events) {
  MailingList.findOne({
    'name': mailingListId
  }, function(err, mailingList){
    mailingList.users.map(function(user){
      if (!(user in emailsToBeSent)) emailsToBeSent[user] = [];
      emailsToBeSent[user] = emailsToBeSent[user].concat(events);
    });
    totalMailingListsToBeProcessed -= 1;
    if (totalMailingListsToBeProcessed == 0) sendEmails();
  })
}

createMessage = function(events){
  message = "Number of events today: " + events.length + '\n';
  sortedEvents = _und.sortBy(events, function(o){ return o.Time});
  sortedEvents.map(function(event){
    message += moment(event.Time).format("hh:mm a") + " : " + event.eventName + " (" + event.Description + ")\n";
  })
  return message;
}

sendEmail = function(user, message){
  console.log("Sending Email to : "+ user.email);
  console.log("Message : ");
  console.log("-------------------------");
  // EMAIL API CALL
  var message = {
      "html": "<p>"+message.replace(/\n/g,'<br>')+"</p>",
      "text": message,
      "subject": "Daily Task Digest",
      "from_email": "contact@aadarsh.biz",
      "from_name": "Push",
      "to": [{
              "email": user.email,
          }],
  };
  var async = false;
  mandrill_client.messages.send({"message": message, "async": async}, function(result) {
      console.log(result);
  }, function(e) {
      // Mandrill returns the error as an object with name and message keys
      console.log('A mandrill error occurred: ' + e.name + ' - ' + e.message);
      // A mandrill error occurred: Unknown_Subaccount - No subaccount exists with the id 'customer-123'
  });
}

sendEmails = function(){
  for (userId in emailsToBeSent) {
    messageToBeSent = createMessage(emailsToBeSent[userId]);
    User.findById(userId, function(err, user){
      sendEmail(user, messageToBeSent);
    })

  }
  // emails = getEmailOfSubscribers(mailingListId);
  // emailMessage = createMessage(events);
}

eventsToBeSent = [];
emailsToBeSent = {};
totalMailingListsToBeProcessed = 0;
sendDaily();
