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
  },
  render: function() {
    this.binding = this.binding || rivets.bind(this.el, { model: this.model, view: this});
  }
}); // game page view

var GameListView = Backbone.View.extend({
  template: function() {
    document.getElementById();
  },
  initialize: function(attrs) {
    this.type = attrs.type;
  },
  render: function() {
  }
});

var teamCollection = new TeamCollection();
var playerCollection = new PlayerCollection();
var gameCollection = new GameCollection();

var socketURL = 'ws:' + window.location.origin.slice(window.location.protocol.length) + '/sockets';
var router = new Router({
  teams: new TeamCollection(),
  players: new PlayerCollection(),
  games: new GameCollection(),
  socket: new WebSocket(socketURL)
});

var gameModel = gameCollection.create({
  name: 'Test game'
});

var gameView = new GameView({model: gameModel});
gameView.render();

// if(typeof window.orientation !== 'undefined'){...}
window.addEventListener('scroll', function(e) {
  var s = window.scrollY;
  if(s < 1) {
    document.querySelector('.pages').classList.remove('short');
    document.querySelector('.wide').classList.remove('right');
  } else {
    if(!document.querySelector('.pages').classList.contains('short')) {
      window.scrollTo(0, 1);
      document.querySelector('.pages').classList.add('short');
      document.querySelector('.wide').classList.add('right');
      e.preventDefault();
    }
  }
});

document.querySelector('.fa-bars').addEventListener('click', function() {
  if(!document.querySelector('.dropdown').classList.contains('active')) {
    document.querySelector('.dropdown').classList.add('active');
    document.querySelector('body').classList.add('full');

    var func = function(e) {
      document.querySelector('.dropdown').classList.remove('active');
      document.querySelector('body').classList.remove('full');
      window.removeEventListener('click', func, false);
    };
    setTimeout(function() {
      window.addEventListener('click', func, false);
    }, 10);
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
