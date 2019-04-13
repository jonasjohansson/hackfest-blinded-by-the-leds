var beat = 1;
var beatCounter = 0;

window.onload = function() {
	'use strict';

	const ws = new WebSocket('ws://possan.ngrok.io');

	ws.onmessage = evt => {
		// console.log('received: %s', evt.data);
		beat = 1;
	};
};

window.requestAnimationFrame(callback);

function callback() {
	beat *= 0.8;
	if (beat < 0.1) beat = 0;
	// console.log(beat);

	window.requestAnimationFrame(callback);
}

function getRandomColor() {
	var letters = '0123456789ABCDEF';
	var color = '#';
	for (var i = 0; i < 6; i++) {
		color += letters[Math.floor(Math.random() * 16)];
	}
	return color;
}

Number.prototype.map = function(in_min, in_max, out_min, out_max) {
	return ((this - in_min) * (out_max - out_min)) / (in_max - in_min) + out_min;
};

function getRandomInt(max) {
	return Math.floor(Math.random() * Math.floor(max));
}
