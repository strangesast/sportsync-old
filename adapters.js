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
