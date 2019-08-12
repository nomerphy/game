const gameContainer = document.querySelector('.game-container');
const scoreElement = document.querySelector('#score');
const restartBtn = document.querySelector('#restartGame')

const directions = ['up', 'right', 'down', 'left'];

let startX = 0;
let startY = 0;
let endX = 0;
let endY = 0;

let direction;
let isReverseDirection;

let score = 0;

nextArrow();

gameContainer.addEventListener('mousedown', lock);
gameContainer.addEventListener('touchstart', lock);

gameContainer.addEventListener('mouseup', release);
gameContainer.addEventListener('touchend', release);


function lock(event){
	if(!event.target.classList.contains('arrow')) return;
	startX = event.type === 'mousedown' ? event.screenX : event.changedTouches[0].screenX;
	startY = event.type === 'mousedown' ? event.screenY : event.changedTouches[0].screenY;
}

function release(event) {
  if(!startX) return;
  endX = event.type === "mouseup" ? event.screenX : event.changedTouches[0].screenX;
  endY = event.type === "mouseup" ? event.screenY : event.changedTouches[0].screenY;
  handleArrowSwipe();
}

restartBtn.addEventListener('click', restartGame);

function restartGame() {
	gameContainer.addEventListener('mousedown', lock);
	gameContainer.addEventListener('touchstart', lock);
	startX = 0; startY = 0; endX = 0; endY = 0;
	gameContainer.addEventListener('mouseup', release);
	gameContainer.addEventListener('touchend', release);
	
	clearInterval(progressBarInterval);
	progressBarWidthNumerator = gameDuration * 1000;
	score = 0;
	document.querySelector('.arrow').remove();
	nextArrow();
	scoreElement.textContent = score;
	progressBarInterval = setInterval(progressBarFrame, 10);

}


function handleArrowSwipe() {
  const result = getValidationResult();
  const arrowElement = document.querySelector(".arrow");

  if(result==="correct") {
    score+=10;
    scoreElement.textContent = score;

    scoreElement.classList.remove("pulse", "reversePulse");
    setTimeout(() => { scoreElement.classList.add("pulse"); }, 0);

    arrowElement.remove();
    nextArrow();
  }
  else if(result==="wrong") {
    if(score>0) {
      score = Math.max(0, score-10); // score-=10;
      scoreElement.textContent = score;

      scoreElement.classList.remove("pulse", "reversePulse");
      setTimeout(() => { scoreElement.classList.add("reversePulse"); }, 0);
    }
    arrowElement.classList.remove("bounceIn", "shake");
    setTimeout(() => { arrowElement.classList.add("shake"); }, 0);
  }

  startX = 0; startY = 0; endX = 0; endY = 0;
}

function getValidationResult(){
	let result = "";
  // const sensitivityThreshold = 10;
  if(correctDirection()==="up") {
    // if(Math.abs(endY-startY)>sensitivityThreshold) {
      if(endY < startY) result="correct"; // Swiped up
      else if(endY > startY) result="wrong"; // Swiped down
    // }
  }
  else if(correctDirection()==="right") {
    if(endX > startX) result="correct"; // Swiped right
    else if(endX < startX) result="wrong"; // Swiped left
  }
  else if(correctDirection()==="down") {
    if(endY > startY) result="correct"; // Swiped down
    else if (endY < startY) result="wrong"; // Swiped up
  }
  else if(correctDirection()==="left") {
    if(endX < startX) result="correct"; // Swiped left
    else if (endX > startX) result="wrong"; // Swiped right
  }
  return result;
}

function correctDirection(){
	if(!isReverseDirection) return direction;
	if(direction === 'up') return 'down';
	if(direction === 'right') return 'left';
	if(direction === 'down') return 'up';
	if(direction === 'left') return 'right';
}

function nextArrow(){

	direction = directions[getRandomInt(4)];
	isReverseDirection = getRandomInt(2);


	const newElement = document.createElement('i');

	newElement.classList.add('fas',`fa-arrow-circle-${direction}`,'arrow', 'animated', 'bounceIn');
	newElement.setAttribute('style', `color: ${isReverseDirection ? 'crimson' : 'royalblue'}`);
	gameContainer.appendChild(newElement);

}

function getRandomInt(max){
	return Math.floor(Math.random()*max);
}

//Progress Bar

const progressBarElement = document.querySelector('#progress-bar');
const gameDuration = 30;
let progressBarWidthNumerator = gameDuration * 1000;
let progressBarWidthDenumerator = gameDuration * 1000;
const progressBarInterval = setInterval(progressBarFrame, 10);

function progressBarFrame(){
	if(progressBarWidthNumerator <= 0) {
		clearInterval(progressBarInterval);
		gameContainer.removeEventListener('mousedown', lock);
		gameContainer.removeEventListener('touchstart', lock);

		gameContainer.removeEventListener('mouseup', release);
		gameContainer.removeEventListener('touchend', release);

	} else {
		progressBarWidthNumerator-=10;
		const currentProgressBarWidth =progressBarWidthNumerator/progressBarWidthDenumerator;

		if(currentProgressBarWidth <= 0.15){
			progressBarElement.setAttribute('style', `width: ${100 * currentProgressBarWidth}%; background-color: crimson;`);
		} else if(currentProgressBarWidth <= 0.45){
			progressBarElement.setAttribute('style', `width:${100 * currentProgressBarWidth}%; background-color: orange`);
		} else {
			progressBarElement.setAttribute('style', `width:${100 * currentProgressBarWidth}%;`)
		}
	}
}
