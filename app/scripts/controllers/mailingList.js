'use strict';

angular.module('projectApp')
.controller('mailingListCtrl', function ($scope, $location, storage, mailingList) {
  Event.query(function(data) {
    $scope.mailingLists = data;
  });

  $scope.deletemailingList = function (mailingListId) {
    Event.delete({ id: mailingListId });
    Event.query(function(data) {
      $scope.mailingLists = data;
    });
  };

  $scope.editmailingList = function(mailingList) {
    if (mailingList === 'new') {
      storage.newEvent = true;
      storage.editedEvent = {name: ''};
    }
    else {
      storage.newEvent = false;
      storage.editedEvent = mailingList;
    }
    $location.path('/mailingList/edit');
  };
})
.controller('mailingListEditCtrl', function ($scope, $location, storage, mailingList) {
  $scope.editedEvent = storage.editedEvent;
  $scope.save = function(mailingList) {
    if (storage.newEvent){
      Event.save(mailingList);
    } else {
      Event.update({id:mailingList._id}, mailingList);
    }
    $location.path('/mailingList');
  };
  $scope.back = function(){
    $location.path('/mailingList');
  }
});
