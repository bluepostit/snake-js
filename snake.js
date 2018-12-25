function Snake(board) {
	function setupTail(tail, tailLength) {
		for (var i = 0; i < tailLength; i++) {
			tail.push(null);
		}
		return tail;
	}

	function growTail(size) {
		for (var i = 0; i < size; i++) {
			tail.unshift(null);
		}
	}

	function isInsideBoard(x, y) {
		if ((x < 0) || ((x + SIZE) > board.width)) {
			return false;
		}
		if ((y < 0) || ((y + SIZE) > board.height)) {
			return false;
		}
		return true;
	}

	function isInsideTail(x, y) {
		for (var i = 0; i < tail.length; i++) {
			var pos = tail[i];
			if (pos != null) {
				if ((pos.x == x) && (pos.y == y)) {
					return true;
				}
			}
		}
		return false;
	}

	function renderEyes(ctx, x, y, fillStyle) {
		ctx.fillStyle = fillStyle;
		let radius = SIZE / 8;
		let startAngle = 0;
		let endAngle = Math.PI * 2;

		let eye1 = { x: x, y: y };
		let eye2 = { x: x, y: y };

		if (direction == 'right' || direction == 'left') {
			eye1.y = y + (SIZE * 1/4);
			eye2.y = y + (SIZE * 3/4);
			eye1.x = eye2.x = (x + (SIZE * 3/4));
			if (direction == 'left') {
				eye1.x = eye2.x = (x + (SIZE * 1/4));
			}
		} else if (direction == 'up' || direction == 'down') {
			eye1.x = x + (SIZE * 1/4);
			eye2.x = x + (SIZE * 3/4);
			eye1.y = eye2.y = (y + (SIZE * 1/4));
			if (direction == 'down') {
				eye1.y = eye2.y = (y + (SIZE * 3/4));
			}
		}
		// eye 1
		ctx.beginPath();
		ctx.arc(eye1.x,
			eye1.y,
			radius,
			startAngle, 
			endAngle);
		ctx.fill();
		// eye 2
		ctx.beginPath();
		ctx.arc(eye2.x,
			eye2.y,
			radius,
			startAngle, 
			endAngle);
		ctx.fill();
	}

	function render() {
		var ctx = board.getContext('2d');
		ctx.fillStyle = 'black';
		ctx.clearRect(0, 0, board.width, board.height);
		ctx.fillRect(0, 0, board.width, board.height);
		for (var i = 0; i < tail.length; i++) {
			var pos = tail[i];
			if (pos != null) {
				ctx.fillStyle = '#01B600';
				ctx.fillRect(pos.x, pos.y, SIZE, SIZE);
				// It's the head
				if (i == (tail.length - 1)) {
					renderEyes(ctx, pos.x, pos.y, '#005497');
				}
			}
		}
		// render apple
		ctx.fillStyle = 'red';
		ctx.beginPath();
		ctx.arc(apple.x + (SIZE / 2), apple.y + (SIZE / 2),
			SIZE / 2, 0, (Math.PI * 2));
		ctx.fill();
	}

	function move() {
		tail.shift();
		var newX = position.x;
		var newY = position.y;
		if (direction == 'left') {
			newX = position.x - SIZE;
		} else if (direction == 'right') {
			newX = position.x + SIZE;
		} else if (direction == 'up') {
			newY = position.y - SIZE;
		} else if (direction == 'down') {
			newY = position.y + SIZE;
		}
		if (!isInsideBoard(newX, newY)) {
			throw new Error("Crash!");
		} else if (isInsideTail(newX, newY)) {
			throw new Error("Crash!");
		}
		if ((apple.x == newX) && (apple.y == newY)) {
			growTail(1);
			speed -= 5;
			apple = newApplePosition();
		}
		position.x = newX;
		position.y = newY;
		tail.push({x: position.x, y: position.y});
		if (turning) {
			turning = false;
		}
		render();
	}

	function getRandomInt(min, max) {
		min = Math.ceil(min);
		max = Math.floor(max);
		//The maximum is exclusive and the minimum is inclusive
		return Math.floor(Math.random() * (max - min)) + min; 
	}

	function newApplePosition() {
		do {
			var x = getRandomInt(0, board.width / SIZE) * SIZE;
			var y = getRandomInt(0, board.height / SIZE) * SIZE;
		} while (isInsideTail(x, y));
		return {
			x: x,
			y: y
		}; 
	}

	function handleError(error) {
		var ctx = board.getContext('2d');
		ctx.font = '28px Courier New';
		ctx.fillStyle = 'red';
		ctx.fillText(error, board.width / 6, board.height / 3);
	}

	// Width & height of each segment of the snake
	const SIZE = 20;
	// Initial amt. of snake segments
	const INITIAL_BODY_SIZE = 3;
	const TIMER_INTERVAL = 5;
	// Initial speed; amt. of milliseconds for move interval
	const STARTING_SPEED = 100;
	const DIRECTIONS = ['up', 'right', 'down', 'left'];

	// Travel direction
	let direction = null;
	// Amt. milliseconds for move interval
	let speed = null;
	// Timer for movement
	let timer = null;
	// Timer tick counter
	let tick = 0;
	// Current position of the snake's head
	let position = {
		x: null,
		y: null
	}
	// Are we currently turning?
	let turning = false;
	// The snake segments behind the head
	let tail = []
	// The apple's position
	let apple = null;

	function init() {
		direction = 'right';
		speed = STARTING_SPEED;
		if (!!timer) {
			window.clearTimeout(timer);
			timer = null;
		}
		position = {
			x: board.width / 2,
			y: board.height / 2
		}
		turning = false;
		tail = setupTail([], INITIAL_BODY_SIZE);
		apple = newApplePosition();
	}

	return {
		start: function () {
			init();
			render();
			timer = window.setInterval(function() {
				tick = ((tick * TIMER_INTERVAL) > speed) ? 0 : tick + 1;
				// console.log('tick:', tick, 'speed:', speed)
				if ((tick * TIMER_INTERVAL) != speed) {
					return;
				}
				try {
					move();
				} catch (error) {
					if (!!timer) {
						window.clearTimeout(timer);
					}
					handleError(error);
				}
			}, TIMER_INTERVAL);
		},
		stop: function () {

		},
		turn: function (turnDirection) {
			if (DIRECTIONS.includes(turnDirection)) {
				if (turning) {
					return false;
				}
				turning = true;
				direction = turnDirection;
			}
		}
	}
}

document.addEventListener("DOMContentLoaded", function() {
	var board = document.getElementById('board');
	var snake = new Snake(board);
	
	window.addEventListener('keydown', function(event) {
		var code = event.keyCode;
		if (code == 37) { // left
			snake.turn('left');
		} else if (code == 39) { // right
			snake.turn('right');
		} else if (code == 38) { // up
			snake.turn('up');
		} else if (code == 40) { // down
			snake.turn('down');
		} else if (code == 32) { // spacebar
			snake.start();
		}
	});

	snake.start();
});

// function drawRoundedSquare(x, y, size) {
// 	var board = document.getElementById('board');
// 	var ctx = board.getContext('2d');
// 	ctx.clearRect(0, 0, board.width, board.height);

// 	ctx.beginPath();
// 	ctx.arc(x + (size / 2), y + (size / 2), size / 2, Math.PI / 180 * 0, Math.PI / 180 * 360);
// 	ctx.stroke();

// 	ctx.strokeStyle = 'red';
// 	ctx.strokeRect(x, y, size, size);
// }
