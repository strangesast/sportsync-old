window.addEventListener('scroll', function(e) {
  var s = window.scrollY;
  if(s > 180) {
    document.querySelector('.pages').classList.add('active');
  } else {
    document.querySelector('.pages').classList.remove('active');
  }
});
