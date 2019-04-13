const WebSocket = require('ws');

const wws = new WebSocket('ws://127.0.0.1:3000');

wws.on('message', function incoming(data) {
	console.log('received: %s', data);
	data = JSON.parse(data);
});

Number.prototype.map = function(in_min, in_max, out_min, out_max) {
	return ((this - in_min) * (out_max - out_min)) / (in_max - in_min) + out_min;
};
