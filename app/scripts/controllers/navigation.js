controller('navigationCtrl', function() {
  var scope = this.scope;

  scope.items = [];
  for (var i = 0; i < 5; i++) {
    scope.items.push({
      path: '/#/section-' + i,
      name: 'Section ' + i
    });
  }
});