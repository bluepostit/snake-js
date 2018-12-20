function Snake(board) {
	let position = {
		x: board.width / 2,
		y: board.height / 2
	}

	const size = 10;

	function isInsideBoard(x, y) {
		if ((x < 0) || ((x + size) > board.width)) {
			return false;
		}
		if ((y < 0) || ((y + size) > board.height)) {
			return false;
		}
		return true;
	}

	function render() {
		var ctx = board.getContext('2d');
		ctx.clearRect(0, 0, board.width, board.height);
		ctx.fillRect(position.x, position.y, size, size);
	}

	function move() {
		var newX = position.x;
		var newY = position.y;
		if (direction == 'left') {
			newX = position.x - size;
		} else if (direction == 'right') {
			newX = position.x + size;
		} else if (direction == 'up') {
			newY = position.y - size;
		} else if (direction == 'down') {
			newY = position.y + size;
		}
		if (!isInsideBoard(newX, newY)) {
			throw new Error("Crash!");
		}
		position.x = newX;
		position.y = newY;
		render();
	}

	let direction = null;
	let speed = 200;
	let timer = null;

	return {
		start: function () {
			render();
			direction = 'right';
			timer = window.setInterval(function() {
				try {
					move();
				} catch (error) {
					if (!!timer) {
						window.clearTimeout(timer);
					}
					throw error;
				}
			}, speed);
		},
		stop: function () {

		},
		turnLeft: function () {
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
			console.log('left');
			snake.turnLeft();
		} else if (code == 39) { // right
			console.log('right');
			snake.turnRight();
		}
	});

	snake.start();
});

