(function(Backbone, _) {

  var extend = Backbone.Router.extend;

  Backbone.Router.extend = function() {
    var child = extend.apply(this, arguments),
      childProto = child.prototype,
      parentProto = this.prototype;

    _.each(['before', 'after'], function(filter) {
      _.defaults(childProto[filter], parentProto[filter]);
    });

    return child;
  };

  _.extend(Backbone.Router.prototype, {

    /**
     * Override default route fn to call before/after filters
     *
     * @param {String} route
     * @param {String} name
     * @param {Function} [callback]
     * @return {*}
     */
    route: function(route, name, callback) {
      if (!_.isRegExp(route)) route = this._routeToRegExp(route);
      if (_.isFunction(name)) {
        callback = name;
        name = '';
      }
      if (!callback) callback = this[name];
      var router = this;
      
      // store all the before and after routes in a stack
      var beforeStack = [];
      var afterStack = [];
      var index = 0;
      _.each(router.before, function(value,key) {
        beforeStack.push({'filter':key, 'filterFn':value});
      });
      _.each(router.after, function(value,key) {
        afterStack.push({'filter':key, 'filterFn':value});
      });

      Backbone.history.route(route, function(fragment) {
        var args = router._extractParameters(route, fragment);
        
        function next(stack, runRoute) {
          var layer = stack[index++];
          if(layer) {
            var filter = _.isRegExp(layer.filter) ? layer.filter : router._routeToRegExp(layer.filter);
            if(filter.test(fragment)) {
              var fn = _.isFunction(layer.filterFn) ? layer.filterFn : router[layer.filterFn];
              fn.apply(router, [fragment, args, function(){ next(stack, runRoute); } ]);
            } else {
              next(stack, runRoute);
            }
          } else if(runRoute) {
            callback.apply(router, args);
          }
        }

        // reset the stack coutner for before filters
        index = 0;
        // start with top of the before stack
        next(beforeStack, true);

        router.execute(callback, args);
        router.trigger.apply(router, ['route:' + name].concat(args));
        router.trigger('route', name, args);
        Backbone.history.trigger('route', router, name, args);
        
        // reset the stack coutner for after filters
        index = 0;
        next(afterStack);

      });

      return this;
    }

  });
})(Backbone, _);