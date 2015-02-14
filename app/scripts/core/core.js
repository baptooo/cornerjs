function Scope() {
  this.watchers = {};
  Object.observe(this, this.onObserving.bind(this));
}
Scope.prototype = {
  watch: function(term, cb) {
    var watchers = this.watchers;
    watchers[term] = cb;
    return function() {
      delete watchers[term];
    }
  },
  destroy: function() { /* To define in controller */ },
  afterDestroy: function() {
    Object.unobserve(this, this.onObserving.bind(this));
  },
  onObserving: function(changes) {
    var watchers = this.watchers;
    for (var i = 0, len = changes.length; i < len; i++) {
      var change = changes[i],
        watcher = watchers[change.name];

      if(watcher) {
        watcher(change.object[change.name], change.type === 'add' ? null : change.oldValue);
      }
    }
  }
};

function controller(name, func) {
  if(func) {
    controller[name] = func;
    func.prototype.scope = new Scope();
  } else {
    return controller[name];
  }
}

function getScope(elt) {
  return elt ? elt.scope ? elt.scope : getScope(elt.parentNode) : null;
}

/**
 * Retrieves the asked path on the given object
 * @param path
 * @param obj
 * @returns {*}
 */
function getTerm(path, obj) {
  return obj[path] != undefined ? obj[path] : (function(split) {
    var term = split.pop();
    for(var i = 0; i < split.length; i++) {
      obj = obj[split[i] || ''];
    }
    return obj ? obj[term] != undefined ? obj[term] : '' : '';
  })(path.split('.'));
};

function ajax(path, method, data) {
  var def = Promise.defer(),
    req = new XMLHttpRequest();

  req.onload = function() {
    def.resolve(req);
  };
  req.onerror = function(msg) {
    def.reject(msg);
  };

  req.open(method || 'GET', path, true);
  req.send(data);

  return def.promise;
}

document.addEventListener('DOMContentLoaded', function() {
  directive('controller', {
    load: function(elt, ctrlName) {
      var ctrlClass = controller(ctrlName);
      if(ctrlClass) {
        var ctrl = new ctrlClass();
        elt.scope = ctrl.scope;
      } else {
        throw ('there is no controller named ' + ctrlName);
      }
    },
    unload: function(elt) {
      elt.scope.destroy();
      elt.scope.afterDestroy();
      elt.scope = null;
    }
  });

  directive('if', function(elt, term) {
    var scope = getScope(elt);
      data = getTerm(term, elt);

    if(!data) {
      var htmlCache = elt.innerHTML.toString();
      elt.innerHTML = '';
      var watcher = scope.watch(term, function(newValue) {
        if(newValue) {
          elt.innerHTML = htmlCache;
          watcher();
        }
      });
    }
  });

  directive('repeater', {
    load: function(elt, expression) {
      if(typeof expression !== 'string') {
        elt.remove();
        return false;
      }

      var arr = [],
        // Getting repeater scope
        scope = getScope(elt),
        // Parsing expression
        parsed = expression.match(/^(.*) in (.*)$/i),
        // Retrieving target in expression
        repeatTarget = parsed && parsed[2],
        repeatVar = parsed && parsed[1];

      if(scope && parsed && scope[repeatTarget]) {
        arr = scope[repeatTarget];
      } else {
        elt.remove();
        return false;
      }

      var parentNode = elt.parentNode;
      for (var i = 0, len = arr.length; i < len; i++) {
        var clone = elt.cloneNode(true),
          loopNode = arr[i];

        // Prevent infinite loop directive constructor
        clone.removeAttribute('repeater');

        // Building isolated scope for repeated element
        var loopScope = {};
        loopScope.$index = i;
        loopScope[repeatVar] = loopNode;
        clone.scope = loopScope;

        parentNode.insertBefore(clone, elt);
      }

      // Finally, removing the original element to clean the DOM
      elt.remove();
    },
    alter: function() {
      console.log(arguments);
    }
  });

  directive('bind', function(elt, term) {
    var scope = getScope(elt);
    if(scope) {
      elt.innerHTML = getTerm(term, scope);
    }
  });

  directive('bind-attr', function(elt, expression) {
    var scope = getScope(elt),
      config = expression.split(',');

    if(scope) {
      elt.setAttribute(config[0], getTerm(config[1], scope));
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

  directive('require', function(elt, path) {
    ajax(path)
      .then(function(res) {
        elt.innerHTML = res.responseText;
      });
  });
});