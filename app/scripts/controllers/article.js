controller('articleCtrl', function() {
  var scope = this.scope;
  scope.title = 'Articles Area';
  scope.data = null;
  scope.lorem = 'Lorem ipsum dolor sit amet';

  setTimeout(function() {
    scope.data = [0,1,2,3,4,5];
    console.log('new data');
  }, 1e3);

  scope.callService = function() {
    console.log(arguments);
  };
});