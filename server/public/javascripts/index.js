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
    scoreboardCmd (BoardElementCmd.TIMER_START);
    startClock();
  },
  stopclicked: function(e) {
    this.model.stopClock();
    scoreboardCmd (BoardElementCmd.TIMER_STOP);
  },
  resetclicked: function(e) {
    scoreboardCmd (BoardElementCmd.TIMER_SET);
  },
  bluetoothclicked: function(e) {
    resetBluetooth().then(function(ob) {;
      this.model.bluetooth = ob;
    }.bind(this));
  },
  incrementclicked: function(e) {
    var target = e.currentTarget;
    var f = target.getAttribute('data-for');
    var v = Number(target.value);
    var value = Math.max(this.model.get(f) + v, 0);
    this.model.set(f, value);
//    alert ('click ' + f);
//    scoreboardCmd (BoardElementCmd.SCORE_SET, 'Home Score', value);
    scoreboardCmd (BoardElementCmd.SCORE_SET, f, value);
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

var board_config_array = [
  {
    id: 1,
    name: 'board config 1'
  },
  {
    id: 2,
    name: 'board config 2'
  }
];
  var BoardSelectView = Backbone.View.extend({
  el: '#active-board',
  initialize: function(attrs) {
//    alert ('init select');
    var boardlist = ['board'];
//    var boardlist = getBoardList ();
    var board_config_array = [];

    for (i=0; i<boardlist.length; i++) {
        var board_item = {id: 0, name: boardlist[i]};
        board_config_array.push (board_item);
    }
 //   var board_config_array = attrs.board_config_array;
    // store "obj" in "this" so you access it later
    this.obj = {
      selected: 1,
      init: false,
      array: board_config_array
    };
    this.render(); // calling render here isn't always desirable, but works fine
  },
  events: {
    "change select": "changeBoard",
    "click select": "openBoard"
  },
  changeBoard: function(e) {
    //request the selected board to load
    var target = e.currentTarget;
    var value = target.options[target.selectedIndex].innerText;
    loadBoard (value);
//    alert ('selected ' + value);
  },

  openBoard: function(e) {
    if (!this.obj.init) {
        var theObject = this.obj;
        getBoardList().then (function (boardlist) {
//            alert ('then getBoardList' + boardlist + ' len=' + boardlist.length);
            theObject.array = [];
            for (i=0; i<boardlist.length; i++) {
                var board_item = {id: 0, name: boardlist[i]};
//                alert ('adding item  ' + boardlist[i]);
                theObject.array.push (board_item);
            }
            theObject.init = true;
        });
    }
  },
  render: function() {
    this.binding = this.binding || rivets.bind(this.el, { obj: this.obj});
  },
  remove: function() {
    if(this.binding) this.binding.unbind(); // if you go to a different page or otherwise remove this page, need to unbind listeners
  }
});

var boardSelectView = new BoardSelectView({board_config_array: board_config_array});
//var boardSelectView = null;
boardSelectView.obj.selected = 2; // dom should update to that new value

  


var teamCollection = new TeamCollection();
var playerCollection = new PlayerCollection();
var gameCollection = new GameCollection();

// global bluetooth server
var bluetoothServer = null;

var resetBluetooth = function() {
  return getBluetoothDevice().then(function(server) {
    bluetoothServer = server;
    return getBluetoothServiceCharacteristic(server, serviceUuid, characteristicUuid).then(function(res) {
      alert('connected!');
      //return res;
      return {server: bluetoothServer, service: res[0], characteristic: res[1]};
    }).catch(function(err) {
      alert('connection error!');
      throw err || new Error('connection error');
    });
  });
};

var socketURL = 'ws:' + window.location.origin.slice(window.location.protocol.length) + '/sockets';
var router = new Router({
  teams: new TeamCollection(),
  players: new PlayerCollection(),
  games: new GameCollection(),
  socket: new WebSocket(socketURL)
});

var gameModel = gameCollection.create({
  name: 'Test game'
}, {
  bluetoothServer: bluetoothServer
});

gameModel.websocket = router.socket; // ugly

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

function loadBoard_old (){
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

function getBoardList () {
    var boardlist = ['board1', 'board2', 'board3'];
    var  request = new BoardRequest();
    request.request_type = BoardRequestType.BRT_QUERY;

    return sendToScoreboard (request).then (function (list) {
 //       boardlist = list;
 //       alert ('getBoardList promise next  ' + list + ' len=' + list.length);
        return list;
    }); 
}
function loadBoard (board_name) {
    var  request = new BoardRequest();
    request.request_type = BoardRequestType.BRT_DISPLAY_CMD;
    request.cmd = BoardDisplayCmd.BDC_LOAD;
    request.board_name = board_name;

    return sendToScoreboard (request).then (function (status) {
 //       boardlist = list;
 //       alert ('getBoardList promise next  ' + list + ' len=' + list.length);
        return status;
    }); 
}
function scoreboardCmd (cmd, element_name, element_value) {
    var  request = new BoardRequest();
    request.cmd = cmd;
    request.request_type = BoardRequestType.BRT_ELEMENT_CMD;
    request.cmd = cmd;
    request.element_name = element_name;
    request.element_value = element_value;

    return sendToScoreboard (request).then (function (status) {
 //       boardlist = list;
 //       alert ('getBoardList promise next  ' + list + ' len=' + list.length);
        return status;
    }); 
}
