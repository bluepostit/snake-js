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

	function render() {
		var ctx = board.getContext('2d');
		ctx.clearRect(0, 0, board.width, board.height);
		for (var i = 0; i < tail.length; i++) {
			var pos = tail[i];
			if (pos != null) {
				if (i == (tail.length - 1)) {
					ctx.fillStyle = 'blue';
					ctx.fillRect(pos.x, pos.y, SIZE, SIZE);
				}
				ctx.strokeRect(pos.x, pos.y, SIZE, SIZE);
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
	const SIZE = 10;
	// Initial amt. of snake segments
	const INITIAL_BODY_SIZE = 3;
	// Initial speed; amt. of milliseconds for move interval
	const STARTING_SPEED = 100;

	// Travel direction
	let direction = null;
	// Amt. milliseconds for move interval
	let speed = null;
	// Timer for movement
	let timer = null;
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
				try {
					move();
				} catch (error) {
					if (!!timer) {
						window.clearTimeout(timer);
					}
					handleError(error);
				}
			}, speed);
		},
		stop: function () {

		},
		turnLeft: function () {
			if (turning) {
				return false;
			}
			turning = true;
			switch (direction) {
				case 'left':
					direction = 'down';
					break;
				case 'right':
					direction = 'up';
					break;
				case 'down':
				case 'up':
					direction = 'left';
					break;
			}
		},
		turnRight: function () {
			if (turning) {
				return false;
			}
			turning = true;
			switch (direction) {
				case 'left':
					direction = 'up';
					break;
				case 'right':
					direction = 'down';
					break;
				case 'down':
				case 'up':
					direction = 'right';
					break;
			}
		},
	}
}

document.addEventListener("DOMContentLoaded", function() {
	var board = document.getElementById('board');
	snake = new Snake(board);
	
	window.addEventListener('keydown', function(event) {
		var code = event.keyCode;
		if (code == 37) { // left
			snake.turnLeft();
		} else if (code == 39) { // right
			snake.turnRight();
		} else if (code == 32) { // spacebar
			snake.start();
		}
	});

	snake.start();
});

