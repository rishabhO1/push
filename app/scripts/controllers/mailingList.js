'use strict';

angular.module('projectApp')
.controller('mailingListCtrl', function ($scope, $location, storage, MailingList) {
  MailingList.query(function(data) {
    $scope.mailingLists = data;
  });

  $scope.deletemailingList = function (mailingListId) {
    MailingList.delete({ id: mailingListId });
    MailingList.query(function(data) {
      $scope.mailingLists = data;
    });
  };

  $scope.editmailingList = function(mailingList) {
    if (mailingList === 'new') {
      storage.newMailingList = true;
      storage.editedMailingList = {name: ''};
    }
    else {
      storage.newMailingList = false;
      storage.editedMailingList = mailingList;
    }
    $location.path('/mailingLists/edit');
  };
})
.controller('mailingListEditCtrl', function ($scope, $location, storage, MailingList) {
  $scope.editedMailingList = storage.editedMailingList;
  $scope.save = function(mailingList) {
    if (storage.newMailingList){
      MailingList.save(mailingList);
    } else {
      MailingList.update({id:mailingList._id}, mailingList);
    }
    $location.path('/mailingLists');
  };
  $scope.back = function(){
    $location.path('/mailingLists');
  }
});
