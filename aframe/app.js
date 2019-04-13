var beat = 0;
window.onload = function() {
	'use strict';
	const ws = new WebSocket('ws://possan.ngrok.io');

	ws.onmessage = function(evt) {
		var received_msg = evt.data;
	};

	ws.onmessage = evt => {
		console.log('received: %s', evt.data);
		beat = evt.data;
	};
};

window.requestAnimationFrame(callback);

function callback() {
	beat *= 0.9;
	console.log(beat);
	window.requestAnimationFrame(callback);
}

AFRAME.registerComponent('pyramids', {
	schema: {},

	update: function() {
		var data = this.data;
		var el = this.el;
		var offset = 250;

		var h = 210;

		this.ent = document.createElement('a-entity');
		this.ent.setAttribute('geometry', 'primitive: box; width: 1; height: 1; depth: 1');
		el.appendChild(this.ent);
	},

	tick: function() {
		this.ent.material.opacity = beat;
	}
});
