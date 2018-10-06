/**

	Author: Erika Miguel


	All code in this file, except the shuffle function,
	has been written by the author.
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

 let deckElement = document.getElementById('deck')
 let movesElement = document.getElementById('moves')

 let openCards = []
 let moves = 0
 let correctMatches

 function setUpBoard() {
 	const cards = shuffle(generateListOfCards())
 	cards.map(card => {
 		let cardElement = document.createElement('li')
 		cardElement.classList.add('card')

 		cardElement.appendChild(card.toHTML())
 		deckElement.appendChild(cardElement)
 	})

 	movesElement.textContent = moves
 	correctMatches = cards.length
 }

 deckElement.addEventListener('click', (e) => {
 	 e.preventDefault()
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
 			firstCard.classList.remove('open')
 			firstCard.classList.add('match')
 			secondCard.classList.remove('open')
 			secondCard.classList.add('match')
 		} else {
 			setTimeout(() => {
 				firstCard.classList.remove('open')
	 			firstCard.classList.remove('show')
	 			secondCard.classList.remove('open')
	 			secondCard.classList.remove('show')
 			}, 500)
 		}

 		openCards = []
 		movesElement.textContent = ++moves
 	}

 })


setUpBoard()


