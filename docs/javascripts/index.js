Backbone.ajax = function() {
  var args = Array.prototype.slice.call(arguments, 0);
  console.log(args);
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


var indexes = [0, 8, 12, 16, 20, 32];
var convert = function(uuidStr) {
  if(uuidStr.length < 32) throw new Error('bad uuid str');
  var arr = [];
  indexes.concat(uuidStr.length).reduce(function(a, b) {
    let sub = uuidStr.substring(a, b)
    if(sub != '') arr.push(sub);
    return b;
  });
  return arr.join('-');
}

var serviceUuids = [convert('13333333333333333333333333333337')];

var filters = [
  {
    services: serviceUuids
  }
];

var val;

var begin, end;

var getBluetoothDevice = function() {
  if(navigator.bluetooth == null) throw new Error('bluetooth unsupported');
  return navigator.bluetooth.requestDevice({
    filters: filters
  }).then(function(device) {
    return device.gatt.connect();
  });
};
  
var getBluetoothServiceCharacteristic = function(service, characteristicUuid) {
  return server.getPrimaryService(service).then(function(service) {
    return service.getCharacteristic(characteristic);
  });
};
  
var sendToCharacteristic = function(characteristic) {
  var begin = Date.now();
  return characteristic.readValue().then(function(value) {
    val = value;
    end = Date.now();
    var textDecoder = new TextDecoder('utf-8');
    var text = textDecoder.decode(value);
    var obj = JSON.parse(text);
    console.log('readvalue delta:', end - begin);
    console.log('decode delta:   ', Date.now() - end);
    document.getElementById('out').textContent = text;
    console.log(text);
  
  }).catch(function(err) {
    alert('error');
    throw err;
  });
};
// for addressing backbone model in rivets
rivets.adapters[':'] = {
  observe: function(obj, keypath, callback) {
    return obj.on('change:' + keypath, callback);
  },
  unobserve: function(obj, keypath, callback) {
    return obj.off('change:' + keypath, callback);
  },
  get: function(obj, keypath) {
    return obj.get(keypath);
  },
  set: function(obj, keypath, value) {
    return obj.set(keypath, value);
  }
}

// for determining equality
rivets.formatters['='] = {
  read: function(value, arg) {
    return value == arg;
  },
  publish: function(value, arg) {
    return arg;
  }
}

rivets.formatters['formatTime'] = {
  read: function(value, arg) {
    return GameModel.prototype.timeFormatter(value);
  },
  publish: function(value, arg) {
    throw new Error('wtf');
  }
}

rivets.formatters['notnull'] = function(value, arg) {
  return value != null;
};

rivets.formatters['fromid'] = {
  read: function(value, arg, prop) {
    var model = value.fromId(arg);
    return model != null ? model.get(prop != null ? prop : 'name') : null;
  }, 
  publish: function(value) {

  }
};
console.log(Backbone);
var PageView = Backbone.View.extend({
  initialize: function() {
    console.log('page view init');
    // notification
    // template / element id
  },
  render: function() {
    this.binding = this.binding || rivets.bind(this.el, { model: this.model });
  }
});

var GameView = PageView.extend({
  el: '#game-page',
  initialize: function(params, attr) {
    console.log('game view init');
    this.attributes = attr || {};

    this.model.on('timestart timestop timereset', this.watchClock);
  },
  events: {
    'click #start-clock': 'startclicked',
    'click #stop-clock': 'stopclicked',
    'click #reset-clock': 'resetclicked',
    'click #connect-bluetooth': 'bluetoothclicked',
    'click button.increment': 'incrementclicked'
  },
  startclicked: function(e) {
    this.model.startClock();
  },
  stopclicked: function(e) {
    this.model.stopClock();
  },
  resetclicked: function(e) {
    this.model.resetClock();
  },
  bluetoothclicked: function(e) {
    getBluetoothDevice().then(function() {
      return 'connection successful';
    }).catch(function(err) {
      return err;
    }).then(function(val) {
      alert(val);
    });
  },
  incrementclicked: function(e) {
    var target = e.currentTarget;
    var f = target.getAttribute('data-for');
    var v = Number(target.value);
    this.model.set(f, Math.max(this.model.get(f) + v, 0));
  },
  watchClock: function(timestamp) {
    // 'this' is model
    console.log(this.changed);
    if(this.changed.hasOwnProperty('timeLastStart')) { // starting
      // create interval, if not created
      // two 'watchers' complicates this
      this.timeUpdateInterval = this.timeUpdateInterval || setInterval(function() {
        this.updateTime();
      }.bind(this), this.updateInterval);
    } else {
      clearInterval(this.timeUpdateInterval);
      this.timeUpdateInterval = null;
    }
    //if(!this.model.clockRunning()) {
    //  // start interval
    //  console.log('stopped!');
    //} else {
    //  // stop interval
    //  console.log('running!');
    //}
  },
  render: function() {
    this.binding = this.binding || rivets.bind(this.el, { model: this.model, view: this});
  }
}); // game page view

var Router = Backbone.Router.extend({
  initialize: function() {
    Backbone.history.start({pushState: true});
    this.socket = new WebSocket('ws:' + window.location.origin.slice(window.location.protocol.length) + '/sockets');
  },
  routes: {
    '': 'index'
  },
  index: function() {
    console.log('index');
  }
});

var teamCollection = new TeamCollection();
var playerCollection = new PlayerCollection();
var gameCollection = new GameCollection();

var router = new Router();

var gameModel = gameCollection.create({
  name: 'Test game'
});

var gameView = new GameView({model: gameModel});
gameView.render();

// if(typeof window.orientation !== 'undefined'){...}
window.addEventListener('scroll', function(e) {
  var scrollY = window.scrollY;
  if(scrollY > 20) {
    document.querySelector('.score-box').classList.add('min');
    document.querySelector('.time-box').classList.add('min');
    document.querySelector('.boxes').classList.add('min');
  } else {
    document.querySelector('.score-box').classList.remove('min');
    document.querySelector('.time-box').classList.remove('min');
    document.querySelector('.boxes').classList.remove('min');
  }
});

//TEST FUNCTIONS
if (!String.format) {
  String.format = function(format) {
    var args = Array.prototype.slice.call(arguments, 1);
    return format.replace(/{(\d+)}/g, function(match, number) { 
      return typeof args[number] != 'undefined' ? args[number] : match
      ;
    });
  };
}

function loadBoard (){
  var parser = document.createElement('a');
  parser.href = document.baseURI;
  var api_page = String.format ("http://{0}:{1}/api/loadboard", parser.hostname, parser.port);
  var command_data = {board_name: 'board4'};
  
  var Httpreq = new XMLHttpRequest(); // a new request
  Httpreq.onreadystatechange = function() {
   if (Httpreq.readyState == 4) {
    var text = Httpreq.responseText;
 //   if (text) {
 //       var response = JSON.parse (text);
 //   }
   }
  };
  //last argument is true for asynchronous
  Httpreq.open("POST",api_page,true);
  Httpreq.setRequestHeader("Content-Type", "application/json");
  var tmp = JSON.stringify(command_data);
  Httpreq.send(tmp);         
 
}
