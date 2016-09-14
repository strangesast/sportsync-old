//setInterval(function() {
//  document.querySelector('.page').classList.toggle('short');document.querySelector('.window').classList.toggle('right');document.querySelector('.window').classList.toggle('straight');
//}, 2000);

//var change = function() {
//  var page = document.querySelector('.page');
//  page.classList.add('game');
//  page.classList.remove('index');
//  document.querySelector('.window').classList.remove('straight');
//};
//
//setTimeout(function() {
//  change();
//}, 1000);
//
var start = function* () {
  while(true) {
    document.querySelector('.page').classList.add('short');
    document.querySelector('.window').classList.add('right');
    yield 1;
    document.querySelector('.page').classList.remove('short');
    document.querySelector('.window').classList.remove('right');

    yield 2;
    document.querySelector('.page').classList.add('index');

    yield 3;

    document.querySelector('.page').classList.remove('index');
    document.querySelector('.page').classList.add('short');
    document.querySelector('.window').classList.add('right');

    yield 4;

    document.querySelector('.page').classList.remove('short');
    document.querySelector('.window').classList.remove('right');

    yield 5;

  }
};

v = start();
window.addEventListener('click', function() {
  v.next();
});
