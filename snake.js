function Snake(board) {
	let position = {
		x: board.width / 2,
		y: board.height / 2
	}

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
		if ((x < 0) || ((x + size) > board.width)) {
			return false;
		}
		if ((y < 0) || ((y + size) > board.height)) {
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
					ctx.fillRect(pos.x, pos.y, size, size);
				}
				ctx.strokeRect(pos.x, pos.y, size, size);
			}
		}
	}

	function move() {
		tail.shift();
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
		} else if (isInsideTail(newX, newY)) {
			throw new Error("Crash!");
		}
		position.x = newX;
		position.y = newY;
		tail.push({x: position.x, y: position.y});
		render();
	}

	function handleError(error) {
		var ctx = board.getContext('2d');
		ctx.font = '28px Courier New';
		ctx.fillStyle = 'red';
		ctx.fillText(error, board.width / 6, board.height / 3);
	}

	const size = 10;
	let direction = null;
	let speed = 100;
	let timer = null;

	let bodySize = 2;
	let tail = setupTail([], bodySize);

	return {
		start: function () {
			render();
			direction = 'right';
			timer = window.setInterval(function() {
				try {
					move();
					if (direction == 'right') {
						growTail(1);
					}
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
			snake.turnLeft();
		} else if (code == 39) { // right
			snake.turnRight();
		}
	});

	snake.start();
});

