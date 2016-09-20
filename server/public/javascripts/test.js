describe('element collection', function() {
  var gameCollection;
  before(function() {
    gameCollection = new GameCollection();
  });
  it('should create and save', function(done) {
    var game = gameCollection.create({});
    game.save().then(function(results) {
      console.log(err);
      if(err) throw err;
      done();
    }).catch(function(err) {
      console.log(err);
    });
  });
});
