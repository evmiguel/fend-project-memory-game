/**

	Author: Erika Miguel


	All code in this file, except the shuffle function,
	has been written by the author. This file details
	the Memory Game behavior.

*/

/**---------------------------------------------------

CONSTANTS


------------------------------------------------------*/
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

// ELEMENTS TO MANIPULATE
let deckElement = document.getElementById('deck')
let movesElement = document.getElementById('moves')
let restartElement = document.getElementById('restart')
let timerElement = document.getElementById('timer')
let starsElement = document.getElementById('stars')
let modalElement = document.getElementById('simpleModal')
let modalTextElement = document.getElementById('modalText')
let closeBtnElement = document.getElementsByClassName('closeBtn')[0]
let playAgainButton = document.getElementsByClassName('playAgainBtn')[0]


let cards = openCards = []
let moves = correctMatches = seconds = minutes = hours = 0
let starsStart = maxStars = 3
let firstClick = false
let t


/**------------------------------------------------------

CLASSES

------------------------------------------------------*/

/*
* Memory card class. Creates a Memory Card object
*	of a certain type and CSS class
*
* Constructor args:
*	type: string. type of card.
**/
class MemoryCard {
	constructor(type) {
		this.type = type
		this.cssStyle = cardCssTypes[type]

		// Returns the HTML of a card
		this.toHTML = () => {
			let iconElement = document.createElement('i')
	 		iconElement.setAttribute('type', this.type)
	 		iconElement.classList.add('fa')
	 		iconElement.classList.add(this.cssStyle)
	 		return iconElement
		}
	}
}

/**------------------------------------------------------

HELPER FUNCTiONS

------------------------------------------------------**/

/* Creates a list of cards that are NOT shuffled. **/
function generateListOfCards() {
	let cards = []
	CARD_TYPES.map(type => {
		cards.push(new MemoryCard(type))
		cards.push(new MemoryCard(type))
	})
	return cards
}

/*
 *	DIRECTIONS FROM UDACITY:
 *
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

/* Reset the game. **/
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

/* Set up the board in an initial state **/
function setUpBoard() {
	// Make a list of cards and shuffle them twice.
	cards = shuffle(generateListOfCards())
	cards = shuffle(cards)

	// Add each card's HTML to the deck element
	cards.map(card => {
		let cardElement = document.createElement('li')
		cardElement.classList.add('card')

		cardElement.appendChild(card.toHTML())
		deckElement.appendChild(cardElement)
	})

	// Create a default number of stars
	setUpStars()

	// Set the number of initial moves. Should be zero.
	movesElement.textContent = moves
}

/* Set up the number of stars on the board **/
function setUpStars() {
	function createStarChildNode () {
		let starElement = document.createElement("li")
		let starIcon = document.createElement('i')
		starIcon.classList.add('fa')
		starIcon.classList.add('fa-star')
		starElement.appendChild(starIcon)
		starsElement.appendChild(starElement)
	}

	// If a game is reset, create the necessary number of stars
	// until the number of max stars
	if (starsElement.childNodes.length < maxStars ) {
		while (starsElement.childNodes.length < maxStars){
			createStarChildNode()
		}
	// If the stars haven't been initialized yet, initialize all of them.
	} else if (starsElement.childNodes.length === 0){
		[...Array(starsStart).keys()].map(i => {
			createStarChildNode()
		})
	}

}

/* Removes a star for the list of stars **/
function removeStar() {
	let numStars = starsElement.childNodes.length
	if (numStars > 1) {
		starsElement.removeChild(starsElement.firstChild)
	}
}


/*
 * Add and time function from: https://jsfiddle.net/Daniel_Hug/pvk6p/.
 * Set the timer text.
**/
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

/* Runs a timer, which is just a setTimeout every second **/
function timer() {
    t = setTimeout(add, 1000);
}

/* Clears the timer **/
function clearTimer() {
	clearTimeout(t)
	timerElement.textContent = "00:00:00"
}

/*------------------------------------------------------

EVENT LISTENERS

------------------------------------------------------**/

/*
 * DIRECTIONS FROM UDACITY:
 *
 * set up the event listener for a card. If a card is clicked:
 *  - display the card's symbol (put this functionality in another function that you call from this one)
 *  - add the card to a *list* of "open" cards (put this functionality in another function that you call from this one)
 *  - if the list already has another card, check to see if the two cards match
 *    + if the cards do match, lock the cards in the open position (put this functionality in another function that you call from this one)
 *    + if the cards do not match, remove the cards from the list and hide the card's symbol (put this functionality in another function that you call from this one)
 *    + increment the move counter and display it on the page (put this functionality in another function that you call from this one)
 *    + if all cards have matched, display a message with the final score (put this functionality in another function that you call from this one)
 */
deckElement.addEventListener('click', (e) => {
	//------------------------------------------------------------------------------------------
	// INNER FUNCTIONS

	const setupTimer = () => {
		// Set timer on fist click
		if (!firstClick) {
			timer()
			firstClick = true
		}
	}

	const addToOpenCards = (cardElement) => {
	// Make sure that a list element is clicked and add to the openCards list
	if (cardElement.nodeName === 'LI' && openCards.length < 2 &&
		!cardElement.classList.contains('show') &&
		!cardElement.classList.contains('open')) {

			cardElement.classList.add('open')
			cardElement.classList.add('show')
			openCards.push(cardElement)

		}
	}

	const compareCards = (firstCard, secondCard) => {
		// Cards match!
		if (firstCard.firstChild.getAttribute('type') === secondCard.firstChild.getAttribute('type')) {
			correctMatches += openCards.length
			firstCard.classList.add('pulse')
			secondCard.classList.add('pulse')

			firstCard.classList.add('match')
			firstCard.classList.remove('open')
			secondCard.classList.remove('open')
			secondCard.classList.add('match')

		// Cards don't match!
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
					}, 100)

				})
			}

			tossCards().then(() => {
				setTimeout(() => {
					firstCard.classList.remove('no-match')
					secondCard.classList.remove('no-match')
				}, 300)
			})
		}

		// Clear out the open cards, regardless of a match or not.
		openCards = []

		movesElement.textContent = ++moves

		// Remove a star every 8 moves
		if (moves % 8 === 0 ){
			removeStar()
		}
	}

	const winGame = () => {
		modalElement.style.display = 'block'
		modalTextElement.textContent = `Game won in ${timerElement.textContent} with ${moves} moves and ${starsElement.childNodes.length} star`
		clearTimer()
	}
	//------------------------------------------------------------------------------------------


	// Actual click handling
	e.preventDefault()
	setupTimer()

	// Look at card element
	let cardElement = e.target

	addToOpenCards(cardElement)

	// Compare the cards if there are two cards to compare
	if (openCards.length == 2) {
		compareCards(openCards[0], openCards[1])
	}

	// Win the game if all pairs have been matched
	if (correctMatches > 0 && correctMatches === cards.length) {
		winGame()
	}

})

/* Restart game if user hit's the reset icon **/
restartElement.addEventListener('click', (e) => {
	e.preventDefault()
	resetGame()
})


/* Close game won modal **/
closeBtnElement.addEventListener('click', () => {
	modalElement.style.display = 'none'
})

/* Close modal on outside click **/
window.addEventListener('click', (e) => {
	if (e.target === modalElement){
		modalElement.style.display = 'none'
	}
})

/* Reset game if "Play Again" button pushed **/
playAgainButton.addEventListener('click', () => {
	modalElement.style.display = 'none'
	resetGame()
})



/*------------------------------------------------------

MAIN

------------------------------------------------------**/
setUpBoard()


