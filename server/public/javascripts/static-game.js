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

document.querySelector('.fa-bars').addEventListener('click', function(e) {
  document.querySelector('.dropdown').classList.toggle('active');
  document.querySelector('body').classList.toggle('full');
});
