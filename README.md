Backbone Async Route filters
==================

Backbone Async Route filters allows you to have a pre-condition for the router using `before` filters and some
"after" routing calls using `after` filters.

Backbone async filters is port of [fantactuka/backbone-route-filter](https://github.com/fantactuka/backbone-route-filter) with expressjs style async next callbacks.

The primary problem the async callbacks solve is the ability to stall exectution of the forthcoming item in the chain until a next callback has been issued. This makes it very convenient to add ajax functionality in your filters without fearing that the route function will get executed before the ajax function finishes in the background.

## Installation
Using [Bower](http://twitter.github.com/bower/) `bower install backbone-async-route-filter` or just copy [backbone-async-route-filter.js](https://raw.github.com/chirag04/backbone-async-route-filter/master/backbone-async-route-filter.js)

## Usage

```js
var Router = Backbone.Router.extend({
  routes: {
    'users': 'usersList',
    'users/:id': 'userShow',
    'account/sign-in': 'signIn'
  },

  before: {
    // Using instance methods
    'users(:/id)': 'checkAuthorization',

    // Using inline filter definition
    '*any': function(fragment, args, next) {
      console.log('Atempting to load ' + fragment + ' with arguments: ', args);
      next();
    }
  },

  after: {
    // Google analytics tracking
    // After filter will be triggered only if all before filters passed and action was triggered,
    // so you'll only track pages that was displayed to user
    '*any': function(fragment, args, next) {
      goog._trackPageview(fragment);
      next();
    }
  },

  checkAuthorization: function(fragment, args, next) {
    
    //make ajax to check authorization here.
    $.ajax({
      data: somedata,
      success: function() {
        // if logged in execute next() to move ahead.
        next();
      },
      error: function() {
        //redirect to signin page.
      }
    });
  }
});
```

In order to use the AMD file

```js
require(['path/to/backbone-route-filter-amd'], function(Router){
  var router = Router.extend({
    routes: {
      'users': 'usersList',
      'users/:id': 'userShow',
      'account/sign-in': 'signIn'
    },

    before: {
      // Using instance methods
      'users(:/id)': 'checkAuthorization',

      // Using inline filter definition
      '*any': function(fragment, args, next) {
        console.log('Atempting to load ' + fragment + ' with arguments: ', args);
        next();
      }
    },

    after: {
      // Google analytics tracking
      // After filter will be triggered only if all before filters passed and action was triggered,
      // so you'll only track pages that was displayed to user
      '*any': function(fragment, args, next) {
        goog._trackPageview(fragment);
        next();
      }
    },

    checkAuthorization: function(fragment, args, next) {
      
      //make ajax to check authorization here.
      $.ajax({
        data: somedata,
        success: function() {
          // if logged in execute next() to move ahead.
          next();
        },
        error: function() {
          //redirect to signin page.
        }
      });
    }
  }) 
});
```

## CONTRIBUTORS
  [Srinivas Iyer](https://github.com/srinivasiyer)

## LICENSE

MIT
