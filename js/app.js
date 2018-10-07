/**

	Author: Erika Miguel


	All code in this file, except the shuffle function,
	has been written by the author.

	TODO:
		- add css animation
		- make game won modal
		- responsiveness
		- fix timing bugs
*/

/**

CONSTANTS

*/
// Card types
const ANCHOR = 'anchor'
const BICYCLE = 'bicycle'
const BOLT = 'bolt'
const BOMB = 'bomb'
const CUBE = 'cube'
const DIAMOND = 'diamond'
const LEAF = 'leaf'
const PLANE = 'plane'

const CARD_TYPES = [ ANCHOR, BICYCLE, BOLT, BOMB, CUBE, DIAMOND, LEAF, PLANE ]

// Card to CSS mappings
const cardCssTypes = {
	[ANCHOR]: 'fa-anchor',
	[BICYCLE]: 'fa-bicycle',
	[BOLT]: 'fa-bolt',
	[BOMB]: 'fa-bomb',
	[CUBE]: 'fa-cube',
	[DIAMOND]: 'fa-diamond',
	[LEAF]: 'fa-leaf',
	[PLANE]: 'fa-paper-plane-o'
}

/**

CLASSES

*/
class MemoryCard {
	constructor(type) {
		this.type = type
		this.cssStyle = cardCssTypes[type]
		this.toHTML = () => {
			let iconElement = document.createElement('i')
	 		iconElement.setAttribute('type', this.type)
	 		iconElement.classList.add('fa')
	 		iconElement.classList.add(this.cssStyle)
	 		return iconElement
		}
	}
}

function generateListOfCards() {
	let cards = []
	CARD_TYPES.map(type => {
		cards.push(new MemoryCard(type))
		cards.push(new MemoryCard(type))
	})
	return cards
}


/*
 * Create a list that holds all of your cards
 */


/*
 * Display the cards on the page
 *   - shuffle the list of cards using the provided "shuffle" method below
 *   - loop through each card and create its HTML
 *   - add each card's HTML to the page
 */

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



/*
 * set up the event listener for a card. If a card is clicked:
 *  - display the card's symbol (put this functionality in another function that you call from this one)
 *  - add the card to a *list* of "open" cards (put this functionality in another function that you call from this one)
 *  - if the list already has another card, check to see if the two cards match
 *    + if the cards do match, lock the cards in the open position (put this functionality in another function that you call from this one)
 *    + if the cards do not match, remove the cards from the list and hide the card's symbol (put this functionality in another function that you call from this one)
 *    + increment the move counter and display it on the page (put this functionality in another function that you call from this one)
 *    + if all cards have matched, display a message with the final score (put this functionality in another function that you call from this one)
 */

// ELEMENTS TO MANIPULATE
let deckElement = document.getElementById('deck')
let movesElement = document.getElementById('moves')
let restartElement = document.getElementById('restart')
let timerElement = document.getElementById('timer')
let starsElement = document.getElementById('stars')


let cards = openCards = []
let moves = correctMatches = seconds = minutes = hours = 0
let starsStart = 3
let firstClick = false
let t

// HELPER FUNCTIONS

function resetGame() {
	// Reset moves, matches, and open cards
	moves = correctMatches = 0
	movesElement.textContent = movesElement
	openCards = []

	// Remove all elements from the deck
	while (deckElement.firstChild) {
  		deckElement.removeChild(deckElement.firstChild);
	}

	// Reset timer
	clearTimer()
	firstClick = false

	setUpBoard()
}

function setUpBoard() {
	cards = shuffle(generateListOfCards())
	cards = shuffle(cards)
	cards.map(card => {
		let cardElement = document.createElement('li')
		cardElement.classList.add('card')

		cardElement.appendChild(card.toHTML())
		deckElement.appendChild(cardElement)
	})

	setUpStars()
	movesElement.textContent = moves
}

function setUpStars() {
	function createStarChildNode () {
		let starElement = document.createElement("li")
		let starIcon = document.createElement('i')
		starIcon.classList.add('fa')
		starIcon.classList.add('fa-star')
		starElement.appendChild(starIcon)
		starsElement.appendChild(starElement)
	}

	if (starsElement.childNodes.length < 3 ) {
		while (starsElement.childNodes.length < 3){
			createStarChildNode()
		}
	} else if (starsElement.childNodes.length === 0){
		[...Array(starsStart).keys()].map(i => {
			createStarChildNode()
		})
	}

}

function removeStar() {
	let numStars = starsElement.childNodes.length
	if (numStars > 0) {
		starsElement.removeChild(starsElement.firstChild)
	}
}


// Add and time function from: https://jsfiddle.net/Daniel_Hug/pvk6p/
function add() {
    seconds++;
    if (seconds >= 60) {
        seconds = 0;
        minutes++;
        if (minutes >= 60) {
            minutes = 0;
            hours++;
        }
    }

    timerElement.textContent = (hours ? (hours > 9 ? hours : "0" + hours) : "00") + ":" + (minutes ? (minutes > 9 ? minutes : "0" + minutes) : "00") + ":" + (seconds > 9 ? seconds : "0" + seconds);
    timer();
}

function timer() {
    t = setTimeout(add, 1000);
}

function clearTimer() {
	clearTimeout(t)
	timerElement.textContent = "00:00:00"
}

// EVENT LISTENERS

restartElement.addEventListener('click', (e) => {
	e.preventDefault()
	resetGame()
})

deckElement.addEventListener('click', (e) => {
	e.preventDefault()

	// Set timer on fist click
	if (!firstClick) {
		timer()
		firstClick = true
	}

	// Look at card element
	let cardElement = e.target

	// Make sure that a list element is clicked and add to the openCards
	if (cardElement.nodeName === 'LI' && openCards.length < 2 &&
			!cardElement.classList.contains('show') &&
			!cardElement.classList.contains('open')) {
	cardElement.classList.add('show')
	cardElement.classList.add('open')
	openCards.push(cardElement)
	}

	// Compare the cards
	if (openCards.length == 2) {
		const firstCard = openCards[0]
		const secondCard = openCards[1]

		if (firstCard.firstChild.getAttribute('type') === secondCard.firstChild.getAttribute('type')) {
			correctMatches += openCards.length
			firstCard.classList.add('pulse')
			secondCard.classList.add('pulse')

			firstCard.classList.add('match')
			firstCard.classList.remove('open')
			secondCard.classList.remove('open')
			secondCard.classList.add('match')
		} else {
			const tossCards = () => {
				return new Promise((res, rej) => {
					setTimeout(() => {
						firstCard.classList.add('no-match')
						secondCard.classList.add('no-match')
						firstCard.classList.add('toss')
						secondCard.classList.add('toss')

						firstCard.classList.remove('toss')
						secondCard.classList.remove('toss')
						firstCard.classList.remove('open')
						secondCard.classList.remove('open')
			 			firstCard.classList.remove('show')
			 			secondCard.classList.remove('show')
			 			res()
					}, 200)

				})
			}

			tossCards().then(() => {
				setTimeout(() => {
					firstCard.classList.remove('no-match')
					secondCard.classList.remove('no-match')
				}, 1000)
			})
		}

		openCards = []
		movesElement.textContent = ++moves
		if (moves % 8 === 0 ){
			removeStar()
		}
	}

	if (correctMatches > 0 && correctMatches === cards.length) {
		// TODO: make a modal
		alert(`Game won in ${timerElement.textContent}`)
		clearTimer()
	}

})


setUpBoard()


