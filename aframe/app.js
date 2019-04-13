var beat = 0;
window.onload = function() {
	'use strict';
	const ws = new WebSocket('ws://127.0.0.1:3927');

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

		el.setAttribute('position', `2.7 0 4.13`);
		el.setAttribute('scale', '0.0055 0.0055 0.0055');
		for (var x = 0; x < 5; x++) {
			for (var y = 0; y < 7; y++) {
				let pyramid = document.createElement('a-entity');
				pyramid.setAttribute('obj-model', 'obj: #py');
				pyramid.addEventListener('model-loaded', e => {
					var obj = pyramid.getObject3D('mesh').children[0];
					var geo = obj.mesh;
					var mat = obj.material;
					mat.transparent = true;
					mat.opacity = 0.5;
					mat.color = new THREE.Color(`hsl(${h}, 100%, 50%)`);
					mat.metalness = 0.3;
					mat.needsUpdate = true;
					h--;
				});
				pyramid.setAttribute('position', `${-x * offset} 0 ${-y * offset}`);
				el.appendChild(pyramid);
			}
		}
	}
});

AFRAME.registerComponent('lighthandler', {
	tick: function() {
		var lights = document.querySelectorAll('[light]');
		if (document.querySelector('#pyramid-marker').object3D.visible == true) {
			for (var light of lights) {
				light.object3D.visible = true;
			}
		} else {
			for (var light of lights) {
				light.object3D.visible = false;
			}
		}
	}
});
