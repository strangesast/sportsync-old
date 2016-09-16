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
