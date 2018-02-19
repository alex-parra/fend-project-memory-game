/**
 * Memory Game - Project for Udacity Frontend Developer Nanodegree
 * @author: Alex Parra
 * @date: 2018-02-18
 */


// Game Logic ---------------------------------------------

const game = {
  stars: null,
  moves: null,
  startTime: null,
  pair: [],
  ui: {},
  cards: ['anchor', 'bicycle', 'bolt', 'bomb', 'cube', 'diamond', 'leaf', 'paper-plane-o'],
};




document.addEventListener('DOMContentLoaded', function(ev){

  // Game Init
  game.ui.stars = document.querySelector('.score-panel > .stars');
  game.ui.moves = document.querySelector('.score-panel > .moves > b');
  game.ui.timer = document.querySelector('.score-panel > .timer');
  game.ui.restart = document.querySelector('.container > .restart > span');
  game.ui.deck = document.querySelector('.deck-wrap > .deck');

  game.ui.restart.addEventListener('click', function(ev){
    game.reset();
  });

  game.reset();

});




// Start the game
game.start = function(){
  game.ui.deck.addEventListener('click', game.flipCard);
  game.startTime = performance.now();

  game.timer = setInterval(function(){
    requestAnimationFrame(function(){
      game.ui.timer.textContent = ((performance.now() - game.startTime) / 1000).toFixed(0).toHHMMSS();
    });
  }, 500);
}




// Reset game counters and deck
game.reset = function(){
  game.stars = 3;
  game.moves = 0;
  game.startTime = 0;
  game.pair = [];

  game.updateMoves();
  game.uiUpdateStars();
  game.uiRenderCards();
  game.ui.timer.textContent = '00:00:00';
  clearInterval(game.timer);

  game.start();
}




// Handle card clicks
game.flipCard = function(ev){
  if( hasClass(ev.target, 'card') ) {
    if( hasClass(ev.target, 'open') || hasClass(ev.target, 'match') ) return; // do nothing

    addClass(ev.target, 'open');

    game.pair.push(ev.target);

    if( game.pair.length === 2 ) {
      game.addMove();
      const [card1, card2] = game.pair;
      if( card1.getAttribute('data-symbol') === card2.getAttribute('data-symbol') ) {
        addClass(game.pair, 'match');
      } else {
        addClass(game.pair, 'no-match');
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
  let cardsToRender = game.cards.concat(game.cards);
  cardsToRender = shuffle(cardsToRender);

  const cardsFragment = document.createDocumentFragment();
  cardsToRender.forEach(function(c){
    let card = document.createElement('li');
    card.className = 'card';
    card.setAttribute('data-symbol', c);
    let cardIcon = document.createElement('i');
    cardIcon.className = 'fa fa-'+ c;
    card.appendChild(cardIcon);
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

  if( game.stars > 1 && game.moves > 0 && game.moves % game.cards.length === 0 ) {
    game.stars--;
    game.uiUpdateStars();
  }
}




// HELPERS ------------------------------------------------


// Convert a string integer to H:i:s
String.prototype.toHHMMSS = function() {
  var sec_num = parseInt(this, 10); // don't forget the second param
  var hours   = Math.floor(sec_num / 3600);
  var minutes = Math.floor((sec_num - (hours * 3600)) / 60);
  var seconds = sec_num - (hours * 3600) - (minutes * 60);

  if (hours   < 10) {hours   = "0"+hours;}
  if (minutes < 10) {minutes = "0"+minutes;}
  if (seconds < 10) {seconds = "0"+seconds;}
  return hours+':'+minutes+':'+seconds;
}


// Shuffle function from http://stackoverflow.com/a/2450976
function shuffle(array) {
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
function hasClass(el, className) {
  if (el.classList)
    return el.classList.contains(className)
  else
    return !!el.className.match(new RegExp('(\\s|^)' + className + '(\\s|$)'))
}




// Add a class to an element. Single classes only.
function addClass(elems, className) {
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
function removeClass(elems, className) {
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
