'use strict';
const gameSetupDisplay = document.getElementById('displayGameSetup');
const playingGameDisplay = document.getElementById('displayPlayingGame');
const firstPlayerName = document.getElementById('playerOne');
const secondPlayerName = document.getElementById('playerTwo');
const currPlayerSpan = document.querySelectorAll('[data-curr-player]');
const startBtn = document.getElementById('startGame');
const pressToPlay = document.getElementById('pressToStart');
const resetBtn = document.getElementById('reset');
const tableSloth = document.querySelectorAll('[data-sloth]');
const tableRow = document.querySelectorAll('[data-row]');
const winnerMessage = document.getElementById('winner');
const exitGame = document.getElementById('exit');

/*//////////////////////////////////////////////////////////////////*/

const playerColor = ['rgba(211, 25, 25, 0.824)', 'rgba(37, 40, 218, 0.824)'];
const names = [firstPlayerName, secondPlayerName];
let gameStatus = false;
let players = [];
let currentPlayers;

const resetActualGame = () => {
	tableSloth.forEach((cell) => {
		cell.style.backgroundColor = 'white';
		cell.style.border = 'none';
	});
	pressToPlay.textContent = 'Press To Start';
	pressToPlay.style.color = 'black';
	gameStatus = false;
	winnerMessage.textContent = '';
	winnerMessage.style.visibility = 'hidden';
};

const resetGameOnExit = () => {
	startBtn.setAttribute('disabled', '');
	pressToPlay.textContent = 'Press To Start';
	pressToPlay.style.color = 'black';
	names.forEach((elem) => {
		elem.value = '';
	});
	tableSloth.forEach((cell) => {
		cell.style.backgroundColor = 'white';
		cell.style.border = 'none';
	});
	gameStatus = false;
	winnerMessage.textContent = '';
	winnerMessage.style.visibility = 'hidden';
};

const checkGameSetup = (event) => {
	const key = event;
	const firstName = names[0].value;
	const secondName = names[1].value;
	if (key != 'Backspace') {
		if (firstName.length >= 2 && secondName.length >= 2) {
			startBtn.removeAttribute('disabled');
		}
	}
	if (key === 'Backspace') {
		if (firstName.length < 2 || secondName.length < 2) {
			startBtn.setAttribute('disabled', '');
		}
	}
};

const setPlayerNames = () => {
	for (let x = 0; x < names.length; x++) {
		currPlayerSpan[x].textContent = names[x].value;
		currPlayerSpan[x].style.color = playerColor[x];
	}
	players.push([
		{ id: 1, name: names[0].value, color: playerColor[0], status: 0 },
		{ id: 2, name: names[1].value, color: playerColor[1], status: 0 }
	]);
	currentPlayers = players[players.length - 1];
};

const setFirstTurn = () => {
	const randomStart = Math.floor(Math.random() * 2);
	currentPlayers[randomStart].status = 1;
	pressToPlay.textContent = `${currentPlayers[randomStart].name} turn`;
	pressToPlay.style.color = currentPlayers[randomStart].color;
};

const playerTurn = () => {
	for (let x = 0; x < currentPlayers.length; x++) {
		if (currentPlayers[x].status === 1) {
			return currentPlayers[x].color;
		}
	}
};

const nextTurn = () => {
	if (currentPlayers[0].status === 1) {
		currentPlayers[0].status = 0;
		currentPlayers[1].status = 1;
		pressToPlay.textContent = `${currentPlayers[1].name} turn`;
		pressToPlay.style.color = currentPlayers[1].color;
		return;
	}
	if (currentPlayers[1].status === 1) {
		currentPlayers[1].status = 0;
		currentPlayers[0].status = 1;
		pressToPlay.textContent = `${currentPlayers[0].name} turn`;
		pressToPlay.style.color = currentPlayers[0].color;
		return;
	}
};

const isColumnFull = (cell) => {
	if (
		tableRow[0].cells[cell].style.backgroundColor === currentPlayers[0].color ||
		tableRow[0].cells[cell].style.backgroundColor === currentPlayers[1].color
	) {
		return false;
	}
	return true;
};

const setPlayerChip = (currCell, currPlayerColor) => {
	for (let x = 5; x >= 0; x--) {
		if (
			tableRow[x].cells[currCell].style.backgroundColor === '' ||
			tableRow[x].cells[currCell].style.backgroundColor === 'white'
		) {
			tableRow[x].cells[currCell].style.backgroundColor = currPlayerColor;
			return (
				checkHorizontalWin(),
				checkVerticalWin(),
				checkDiagonalWin1(),
				checkDiagonalWin2()
			);
		}
	}
};

const colorMatch = (one, two, three, four) => {
	return (
		one === two &&
		one === three &&
		one === four &&
		one !== '' &&
		one !== 'white'
	);
};

const drawWin = (cell, cell1, cell2, cell3) => {
	cell.style.border = '3px solid black';
	cell1.style.border = '3px solid black';
	cell2.style.border = '3px solid black';
	cell3.style.border = '3px solid black';
};

const checkHorizontalWin = () => {
	for (let row = 5; row > 0; row--) {
		for (let col = 0; col < 4; col++) {
			if (
				colorMatch(
					tableRow[row].cells[col].style.backgroundColor,
					tableRow[row].cells[col + 1].style.backgroundColor,
					tableRow[row].cells[col + 2].style.backgroundColor,
					tableRow[row].cells[col + 3].style.backgroundColor
				)
			) {
				drawWin(
					tableRow[row].cells[col],
					tableRow[row].cells[col + 1],
					tableRow[row].cells[col + 2],
					tableRow[row].cells[col + 3]
				);
				return endGame();
			}
		}
	}
};

const checkVerticalWin = () => {
	for (let col = 0; col < 7; col++) {
		for (let row = 5; row > 2; row--) {
			if (
				colorMatch(
					tableRow[row].cells[col].style.backgroundColor,
					tableRow[row - 1].cells[col].style.backgroundColor,
					tableRow[row - 2].cells[col].style.backgroundColor,
					tableRow[row - 3].cells[col].style.backgroundColor
				)
			) {
				drawWin(
					tableRow[row].cells[col],
					tableRow[row - 1].cells[col],
					tableRow[row - 2].cells[col],
					tableRow[row - 3].cells[col]
				);
				return endGame();
			}
		}
	}
};

const checkDiagonalWin1 = () => {
	for (let col = 0; col < 4; col++) {
		for (let row = 0; row < 3; row++) {
			if (
				colorMatch(
					tableRow[row].cells[col].style.backgroundColor,
					tableRow[row + 1].cells[col + 1].style.backgroundColor,
					tableRow[row + 2].cells[col + 2].style.backgroundColor,
					tableRow[row + 3].cells[col + 3].style.backgroundColor
				)
			) {
				drawWin(
					tableRow[row].cells[col],
					tableRow[row + 1].cells[col + 1],
					tableRow[row + 2].cells[col + 2],
					tableRow[row + 3].cells[col + 3]
				);
				return endGame();
			}
		}
	}
};

const checkDiagonalWin2 = () => {
	for (let col = 0; col < 4; col++) {
		for (let row = 5; row > 2; row--) {
			if (
				colorMatch(
					tableRow[row].cells[col].style.backgroundColor,
					tableRow[row - 1].cells[col + 1].style.backgroundColor,
					tableRow[row - 2].cells[col + 2].style.backgroundColor,
					tableRow[row - 3].cells[col + 3].style.backgroundColor
				)
			) {
				drawWin(
					tableRow[row].cells[col],
					tableRow[row - 1].cells[col + 1],
					tableRow[row - 2].cells[col + 2],
					tableRow[row - 3].cells[col + 3]
				);
				return endGame();
			}
		}
	}
};

const winnerPlayer = () => {
	for (let x = 0; x < currentPlayers.length; x++) {
		if (currentPlayers[x].status === 1) {
			return currentPlayers[x].name;
		}
	}
};

const endGame = () => {
	gameStatus = false;
	winnerMessage.textContent = `${winnerPlayer()} Win!`;
	winnerMessage.style.color = playerTurn();
	winnerMessage.style.visibility = 'visible';
};

/*//////////////////////////////////////////////////////////////////*/

names.forEach((elem) => {
	elem.addEventListener('keyup', (event) => {
		const key = event.key;
		checkGameSetup(key);
	});
});

startBtn.addEventListener('click', () => {
	gameSetupDisplay.style.display = 'none';
	playingGameDisplay.style.display = 'flex';
	pressToPlay.textContent = 'Press To Start';
	setPlayerNames();
});

pressToPlay.addEventListener('click', () => {
	if (gameStatus === false) {
		gameStatus = true;
		setFirstTurn();
	}
});

tableSloth.forEach((sloth) => {
	sloth.addEventListener('click', function () {
		const currentCell = this.cellIndex;
		if (gameStatus === true && isColumnFull(currentCell)) {
			setPlayerChip(currentCell, playerTurn());
			nextTurn();
		}
	});
});

resetBtn.addEventListener('click', () => {
	resetActualGame();
});

exitGame.addEventListener('click', () => {
	playingGameDisplay.style.display = 'none';
	gameSetupDisplay.style.display = 'block';
	resetGameOnExit();
});
