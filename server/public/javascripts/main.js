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

rivets.adapters['*'] = {
  observe: function(obj, keypath, callback) {
    return obj.on('change:' + keypath, callback);
  },
  unobserve: function(obj, keypath, callback) {
    return obj.off('change:' + keypath, callback);
  },
  get: function(obj, keypath) {
    return obj[keypath]();
  },
  set: function(obj, keypath, value) {
    return obj[keypath](value);
  }
}

// for determining equality
rivets.formatters['='] = function(value, arg) {
  return value == arg;
};

rivets.formatters.date = function(value){
  if(typeof value === 'string') {
    var d = new Date(value);
    d.setUTCHours(d.getUTCHours() + d.getTimezoneOffset()/60);
    value = d;
  }
  //return value.toISOString().slice(0, -14);
  return value.toISOString().slice(0, 10);
}
