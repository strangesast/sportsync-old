var models = (function() {
  var Model = Backbone.Model;
  var Collection = Backbone.Collection;

  var BaseModel = Model.extend({
  });
  var BaseCollection = Collection.extend({
  });

  var GameModel = Model.extend({
    defaults: {
    },
    // override parse to process date attr correctly
    parse: function(data) {
      data.start = new Date(data.start);
      return data;
    }
  });

  var GameCollection = BaseCollection.extend({
    url: '/api/games',
    model: GameModel
  });

  var TeamModel = Model.extend({
    defaults: {},
    getPlayers: function() {
      var ret = this.collection.getPlayers(this);
      return ret;
    }
  });
  var TeamCollection = BaseCollection.extend({
    url: '/api/teams',
    model: TeamModel
  });

  var PlayerModel = Model.extend({
    defaults: {},
    getTeam: function() {
      return this.collection.getTeam(this);
    },
    getAllTeams: function() {
      return this.collection.getAllTeams();
    },
    getAllOtherTeams: function() {
      return this.collection.getAllOtherTeams(this);
    }
  });

  var PlayerCollection = BaseCollection.extend({
    url: '/api/players',
    model: PlayerModel
  });

  return {
    GameModel: GameModel,
    GameCollection: GameCollection,
    PlayerCollection: PlayerCollection,
    TeamCollection: TeamCollection
  };
})();

const TEMPLATE_SUFFIX = 'ElementTemplate';
var getTemplate = function(name) {
  var templateId = name + TEMPLATE_SUFFIX;
  var templateElement = document.getElementById(templateId);
  if(templateElement == null) throw new Error('template does not exist in document');
  // return firstChild, otherwise it's a document fragment which is a pain
  return document.importNode(templateElement.content, true).firstChild;
}

var View = Backbone.View;

var ElementView = View.extend({
  // view for a single game
  initialize: function(params) {
    this.setElement(getTemplate(params.name));
    this.listenTo(this.model, 'change', this.render);
  },
  render: function() {
    this.binding = this.binding || rivets.bind(this.el, {model: this.model});
    return this;
  },
  remove: function() {
    this.binding.unbind();
  }
});

var ElementCollectionView = View.extend({
  // view for all games (list)
  initialize: function(params) {
    this.name = params.name;
    this.listenTo(this.collection, 'sync', this.initializeSubViews);
    this.initializeSubViews();
  },
  initializeSubViews: function() {
    var subViews = [];
    var name = this.name;
    this.collection.each(function(model) {
      subViews.push(new ElementView({model: model, name: name}));
    });
    this.subViews = subViews;
    this.render();
  },
  render: function() {
    var el = this.el;
    this.subViews.forEach(function(view) {
      var subel = view.render().el;
      // append to parent list if not already attached
      if(!(subel.parentNode && subel.parentNode === el)) el.appendChild(subel);
    });
    return this;
  }
});

var games = new models.GameCollection();
var teams = new models.TeamCollection();
// necessary. so that players can be accessed from team element
teams.getPlayers = function(t) {
  return players.where({team: t.id});
};

var players = new models.PlayerCollection();
players.teams = teams;
// necessary. so that teams can be accessed from player element
players.getTeam = function(m) {
  return teams.findWhere({id: m.get('team')});
};
players.getAllTeams = function() {
  return teams.where();
};
players.getAllOtherTeams = function(m) {
  return teams.filter(function(el) {
    return el.get('id') != m.get('team');
  });
};



// initial fetch... shouldn't be necessary
[games, teams, players].reduce(function(a, b) {
  return a.then(function() {
    return b.fetch();
  });
}, Promise.resolve()).then(function() {
   
  // view setup
  var gameListView = new ElementCollectionView({collection: games, el: '#game-list', name: 'game'});
  var teamListView = new ElementCollectionView({collection: teams, el: '#team-list', name: 'team'});
  var playerListView = new ElementCollectionView({collection: players, el: '#player-list', name: 'player'});
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
