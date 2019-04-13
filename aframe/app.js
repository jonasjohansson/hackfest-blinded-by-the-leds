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
		beat = 1;
	};
};

window.requestAnimationFrame(callback);

function callback() {
	if (beat > 0) beat *= 0.9;
	window.requestAnimationFrame(callback);
}

AFRAME.registerComponent('cool-stuff', {
	schema: {},

	update: function() {
		var data = this.data;
		var el = this.el;

		this.ent = document.createElement('a-entity');
		this.ent.setAttribute('geometry', 'primitive: box; width: 1; height: 1; depth: 1');
		this.ent.setAttribute('material', 'transparent: true; opacity: 1');
		el.appendChild(this.ent);
	},

	tick: function() {
		this.ent.object3D.children[0].material.opacity = beat;
	}
});
