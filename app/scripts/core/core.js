function controller(name, func) {
  if(func) {
    controller[name] = func;
    func.prototype.scope = {};
  } else {
    return controller[name];
  }
}

function getScope(elt) {
  return elt ? elt.scope ? elt.scope : getScope(elt.parentNode) : null;
}

document.addEventListener('DOMContentLoaded', function() {
  directive('controller', function(elt, ctrlName) {
    var ctrlClass = controller(ctrlName);
    if(ctrlClass) {
      var ctrl = new ctrlClass();
      elt.scope = ctrl.scope;
    } else {
      throw ('there is no controller named ' + ctrlName);
    }
  });

  directive('repeater', function(elt, expression) {
    var arr = expression;
    if(typeof expression === "string") {
      var scope = getScope(elt);
      if(scope && scope[expression]) {
        arr = scope[expression];
      }
    }

    var parentNode = elt.parentNode;
    for (var i = 0, len = arr.length; i < len; i++) {
      var clone = elt.cloneNode(true);
      clone.removeAttribute('repeater');
      parentNode.insertBefore(clone, elt.nextSibling);
    }
  });

  directive('bind', function(elt, term) {
    var scope = getScope(elt);
    if(scope && scope[term]) {
      elt.innerHTML = scope[term];
    }
  });

  directive('click', {
    load: function(elt, expression) {
      var scope = getScope(elt);
      if(scope) {
        this.cb = function() {
          with(scope) eval(expression);
        };
        elt.addEventListener('click', this.cb);
      }
    },
    unload: function() {
      elt.removeEventListener('click', this.cb);
    }
  });
});