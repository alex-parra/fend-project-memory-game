/**
 * Memory Game - Project for Udacity Frontend Developer Nanodegree
 * @author: Alex Parra
 * @date: 2018-02-18
 */


// Game Logic ---------------------------------------------

const utils = {};

const game = {
  stars: null,
  moves: null,
  startTime: null,
  timer: null,
  timeToFinish: null,
  pair: [],
  matches: [],
  ui: {},
  cards: [],
};




document.addEventListener('DOMContentLoaded', function(ev){

  // Game Init
  game.ui.stars = document.querySelector('.score-panel > .stars');
  game.ui.moves = document.querySelector('.score-panel > .moves > b');
  game.ui.timer = document.querySelector('.score-panel > .timer');
  game.ui.restart = document.querySelector('.deck-wrap > .restart > span');
  game.ui.deckWrap = document.querySelector('.deck-wrap');
  game.ui.deck = document.querySelector('.deck-wrap > .deck');
  game.ui.startCover = document.querySelector('.deck-wrap > .cover-start');
  game.ui.doneCover = document.querySelector('.deck-wrap > .cover-finished');

  game.ui.startCover.addEventListener('click', function(ev){
    if( utils.hasClass(ev.target, 'start') ) {
      game.start();
    }
  });

  game.ui.restart.addEventListener('click', function(ev){
    game.reset();
  });

  game.reset();

});




// Start the game
game.start = function(){
  game.ui.deck.addEventListener('click', game.flipCard);
  utils.removeClass(game.ui.deckWrap, 'paused');
  game.startTime = performance.now();
  game.timer = setInterval(function(){
    requestAnimationFrame(function(){
      let ellapsed = (performance.now() - game.startTime) / 1000; // seconds
      game.ui.timer.textContent = utils.toHHMMSS(ellapsed.toFixed(0));
    });
  }, 500);
}




// Reset game counters and deck
game.reset = function(){
  game.stars = 3;
  game.moves = 0;
  game.startTime = 0;
  game.pair = [];
  game.matches = [];
  clearInterval(game.timer);
  game.timeToFinish = null;

  game.updateMoves();
  game.uiUpdateStars();
  game.uiRenderCards();
  game.ui.timer.textContent = '00:00:00';

  utils.removeClass(game.ui.deckWrap, 'finished');
  game.ui.doneCover.textContent = "";

  utils.addClass(game.ui.deckWrap, 'paused');
}




// Handle card clicks
game.flipCard = function(ev){
  if( utils.hasClass(ev.target, 'card') ) {
    if( utils.hasClass(ev.target, 'open') || utils.hasClass(ev.target, 'match') ) return; // do nothing

    utils.addClass(ev.target, 'open');

    game.pair.push(ev.target);

    if( game.pair.length === 2 ) {
      game.addMove();
      const [card1, card2] = game.pair;
      if( card1.getAttribute('data-symbol') === card2.getAttribute('data-symbol') ) {
        game.matches.push(card1.getAttribute('data-symbol'));
        utils.addClass(game.pair, 'match');
        if( game.matches.length === game.cards.length ) {
          game.finished();
        }
      } else {
        utils.addClass(game.pair, 'no-match');
        setTimeout(() => {
          card1.className = 'card';
          card2.className = 'card';
        }, 1000);
      }
      game.pair = []; // reset for next try
    }
  }
};




// Renders the stars indicator in score-panel
game.uiUpdateStars = function(){
  const starsFragment = document.createDocumentFragment();
  for( let i=0; i<game.stars; i++ ) {
    let star = document.createElement('i');
    star.className = 'fa fa-star';
    starsFragment.appendChild(star);
  }
  game.ui.stars.textContent = "";
  game.ui.stars.appendChild(starsFragment);
}




// Render the Cards
game.uiRenderCards = function(){
  game.cards = utils.iconsNames(8);
  let cardsToRender = game.cards.concat(game.cards);
  cardsToRender = utils.shuffle(cardsToRender);

  const cardsFragment = document.createDocumentFragment();
  cardsToRender.forEach(function(c){
    let card = document.createElement('li');
    card.className = 'card';
    card.setAttribute('data-symbol', c);

    let cardInner = document.createElement('span');

    let cardIcon = document.createElement('i');
    cardIcon.className = 'fa fa-'+ c;

    cardInner.appendChild(cardIcon);
    card.appendChild(cardInner);

    cardsFragment.appendChild(card);
  });

  game.ui.deck.textContent = "";
  game.ui.deck.appendChild(cardsFragment);
}




// Increment moves counter and trigger UI update
game.addMove = function(){
  game.moves++;
  game.updateMoves();
}




// Update Moves count in game interface
game.updateMoves = function(){
  game.ui.moves.textContent = game.moves;

  let threshold = game.cards.length + 5;
  if( game.stars > 1 && game.moves > 0 && game.moves % threshold === 0 ) {
    game.stars--;
    game.uiUpdateStars();
  }
}




game.finished = function(){
  game.timeToFinish = (performance.now() - game.startTime) / 1000; // seconds
  clearInterval(game.timer);

  let doneScreenContent = document.createDocumentFragment();

  let doneTitle = document.createElement('h2');
  switch( game.stars ) {
    case 1:
      doneTitle.textContent = 'You can do better!';
      break;
    case 2:
      doneTitle.textContent = 'Well done!';
      break;
    case 3:
      doneTitle.textContent = 'WOW WOW WOW!';
      break;
  }
  doneScreenContent.appendChild(doneTitle);

  let doneInfo = document.createElement('p');
  doneInfo.textContent = 'You found all matches in '+ game.timeToFinish.toFixed(0) +' seconds and '+ game.moves +' pair flips.';
  doneScreenContent.appendChild(doneInfo);

  game.ui.doneCover.textContent = "";
  game.ui.doneCover.appendChild(doneScreenContent);

  utils.addClass(game.ui.deckWrap, 'finished');
}


// HELPERS ------------------------------------------------

// Convert a string integer to H:i:s
utils.toHHMMSS = function(seconds) {
  var sec_num = parseInt(seconds, 10); // don't forget the second param
  var hours   = Math.floor(sec_num / 3600);
  var minutes = Math.floor((sec_num - (hours * 3600)) / 60);
  var seconds = sec_num - (hours * 3600) - (minutes * 60);

  if (hours   < 10) {hours   = "0"+hours;}
  if (minutes < 10) {minutes = "0"+minutes;}
  if (seconds < 10) {seconds = "0"+seconds;}
  return hours+':'+minutes+':'+seconds;
}


// Shuffle function from http://stackoverflow.com/a/2450976
utils.shuffle = function(array) {
  var currentIndex = array.length, temporaryValue, randomIndex;

  while (currentIndex !== 0) {
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;
    temporaryValue = array[currentIndex];
    array[currentIndex] = array[randomIndex];
    array[randomIndex] = temporaryValue;
  }

  return array;
}




// Test if an element has a certain class. Single classes only.
utils.hasClass = function(el, className) {
  if (el.classList)
    return el.classList.contains(className)
  else
    return !!el.className.match(new RegExp('(\\s|^)' + className + '(\\s|$)'))
}




// Add a class to an element. Single classes only.
utils.addClass = function(elems, className) {
  let list = [].concat(elems);
  list.forEach(function(el){
    if (el.classList) {
      el.classList.add(className)
    } else if (!hasClass(el, className)) {
      el.className += " " + className
    }
  });
}




// Remove a class from an element. Single classes only.
utils.removeClass = function(elems, className) {
  let list = [].concat(elems);
  list.forEach(function(el){
    if (el.classList) {
      el.classList.remove(className)
    } else if (hasClass(el, className)) {
      var reg = new RegExp('(\\s|^)' + className + '(\\s|$)')
      el.className=el.className.replace(reg, ' ')
    }
  });
}



utils.iconsNames = function(limit){
  const icons = [
    'amazon',
    'ambulance',
    'anchor',
    'android',
    'apple',
    'bicycle',
    'bitcoin',
    'bolt',
    'bomb',
    'css3',
    'cube',
    'diamond',
    'drupal',
    'facebook-square',
    'firefox',
    'github',
    'heartbeat',
    'leaf',
    'linux',
    'paper-plane-o',
    'pinterest',
    'rebel',
  ];

  return utils.shuffle(icons).slice(0, limit);
}
