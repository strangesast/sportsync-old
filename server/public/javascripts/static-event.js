window.addEventListener('scroll', function(e) {
  var s = window.scrollY;
  if(s > 180) {
    document.querySelector('.pages').classList.add('active');
  } else {
    document.querySelector('.pages').classList.remove('active');
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
