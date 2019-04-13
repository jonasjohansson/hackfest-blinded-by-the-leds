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
	window.requestAnimationFrame(callback);
}

AFRAME.registerComponent('cool-stuff', {
	schema: {},

	update: function() {
		var data = this.data;
		var el = this.el;

		this.ent = document.createElement('a-entity');
		this.ent.setAttribute('geometry', 'primitive: box; width: 1; height: 1; depth: 1');

		el.appendChild(this.ent);
	},

	tick: function() {
		this.material = this.ent.getOrCreateObject3D('mesh').material;
		this.material.transparent = true;
		this.material.opacity = beat;
	}
});
