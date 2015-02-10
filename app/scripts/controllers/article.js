controller('articleCtrl', function() {
  var scope = this.scope;
  scope.title = 'Articles Area';
  scope.data = [0,1,2,3,4,5];

  scope.callService = function() {
    console.log(arguments);
  };
});