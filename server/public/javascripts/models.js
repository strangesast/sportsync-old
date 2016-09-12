Backbone.ajax = function() {
  var args = Array.prototype.slice.call(arguments, 0);
};

// pages
//   game
//   game list
//   administration
//   create new

var PageModel = Backbone.Model.extend({
  //defaults: {
  //  name:
  //  title:
  //},
  initialize: function() {
    console.log('page model init');
  }
});

var TeamModel = Backbone.Model.extend({
  //defaults: {
  //  name:
  //  primaryColor:
  //  secondaryColor:
  //},
});

var TeamCollection = Backbone.Collection.extend({
  url: '/teams',
  model: TeamModel
});

var PlayerModel = Backbone.Model.extend({
  //defaults: {
  //  name:
  //  age:
  //  team: // unattached
  //}
});

var PlayerCollection = Backbone.Collection.extend({
  url: '/players',
  model: PlayerModel
});

var GameModel = Backbone.Model.extend({
  defaults: {
    time: 0,
    timeAccum: 0,
    timeLastStart: null,
    timeLastStop: null,
    scoreA: 0,
    scoreB: 0,
    teamA: 'Team AAAA', // will be moved to team model
    teamB: 'Team BBBB'  // |
  },
  updateInterval: 100,
  initialize: function() {
    this.blacklist = ['time']; // should not be here
    this.timeUpdateInterval = null;
  },
  // should really separate out the clock but for now...
  timeFormatter: function(duration) {
    var milliseconds = parseInt((duration%1000)/100)
        , seconds = parseInt((duration/1000)%60)
        , minutes = parseInt((duration/(1000*60))%60)
        , hours = parseInt((duration/(1000*60*60))%24);

    hours = (hours < 10) ? "0" + hours : hours;
    minutes = (minutes < 10) ? "0" + minutes : minutes;
    seconds = (seconds < 10) ? "0" + seconds : seconds;

    return hours + ":" + minutes + ":" + seconds + "." + milliseconds;
  },
  resetClock: function() {
    var ctime = this.updateTime();
    this.set({
      time: 0,
      timeAccum: 0,
      timeLastStart: null,
      timeLastStop: null
    });
    this.trigger('timereset', ctime);
    return ctime;
  },
  updateTime: function(time) {
    // replace time with time
    var lastStop = this.get('timeLastStop');
    var lastStart = this.get('timeLastStart');
    var accum = this.get('timeAccum');
    var time = this.get('time');
    if(this.clockRunning()) {
      time = Date.now() - lastStart + accum;
    } else {
      time = accum; // but probably zero
    }
    this.set('time', time);
    return time;
  },
  getTime: function(formatted) {
    var time = this.updateTime();
    return formatted ? this.timeFormatter(time) : time;
  },
  setTime: function(time) {
    this.get('timeLastStart')
    this.get('timeLastStop')
    this.get('timeAccum')
    this.trigger('timereset', ctime);
  },
  toggleClock: function() {
    return this.clockRunning() ? this.stopClock() : this.startClock();
  },
  startClock: function() {
    if(this.clockRunning()) return;
    var datetime = Date.now();
    this.set('timeLastStart', datetime);
    this.trigger('timestart', datetime);
    return datetime;
  },
  stopClock: function() {
    if(!this.clockRunning()) return;
    var datetime = Date.now();
    this.set('timeLastStop', datetime);
    this.set('timeAccum', this.get('timeAccum') + datetime - this.get('timeLastStart')); // needs checking
    this.updateTime(); // sometimes redundant
    clearInterval(this.timeUpdateInterval); // probably (always) redundant
    this.trigger('timestop', datetime);
    return datetime;
  },
  clockRunning: function() {
    var lastStart = this.get('timeLastStart');
    if(lastStart == null) return false;
    var lastStop = this.get('timeLastStop');
    if(lastStart != null && lastStop == null) return true;
    return lastStart > lastStop; 
  },
  save: function(attrs, options) {
    options || (options = {});
    attrs || (attrs = _.clone(this.attributes));

    // Filter the data to send to the server
    _.each(this.blacklist || [], function(key) {
      delete attrs[key];
    });

    options.data = JSON.stringify(attrs);

    // Proxy the call to the original save function
    return Backbone.Model.prototype.save.call(this, attrs, options);
  }
});

var GameCollection = Backbone.Collection.extend({
  url: '/games',
  model: GameModel
});

var GameEventModel = Backbone.Model.extend({
  //defaults: {
  //  object: // which object
  //  prop: // property
  //  value: // new value
  //  action: // what occurred
  //  by: // by who
  //  time: // when
  //  last: // last event in chain, null only ok if first
  //},
});
var GameEventCollection = Backbone.Collection.extend({
  url: '/transactions',
  model: GameEventModel
});

var pages = {};
const validTypes = ['games', 'players', 'teams']; // more to come
var Router = Backbone.Router.extend({
  initialize: function(attrs) {
    _.map(attrs, function(value, key) {
      this[key] = value;
    }, this);
    Backbone.history.start({pushState: true});
  },
  routes: {
    'app/': 'index',
    'app/:objectType': 'objectListPage',
    'app/:objectType/': 'objectListPage',
    'app/:objectType/new': 'objectNewPage',
    'app/:objectType/new/': 'objectNewPage',
    'app/:objectType/*path': 'objectDetailPage'
  },
  validateType: function(type) {
    var frag;
    if(!(frag=Backbone.history.getFragment()).endsWith('/')) {
      this.navigate(frag + '/', {replace: true});
    }
    if(validTypes.indexOf(type) == -1) {
      throw new Error('invalid type');
    }
  },
  objectListPage: function(objectType) {
    this.validateType(objectType);

    pages.hasOwnProperty(objectType + '-list');
    console.log('list', objectType);
  },
  objectDetailPage: function(objectType, path) {
    this.validateType(objectType);
    // app/games/123/players etc
    path = path || ''
    var arr = path.split('/');
    if(arr.length == 0) {
      // list all games
      return;
    }
    var col = this[objectType];
    if(arr.length < 1) {
      // return all of type
      return;
    }
    var gameId = arr.shift();

    var model = col.get(gameId);
    if(model == null) {
      // 404
    }
  },
  objectNewPage: function(objectType) {
    this.validateType(objectType);

    console.log('new', objectType);
  },
  index: function(path) {
    console.log('index');
  }
});
