AFRAME.registerComponent('basic', {
	schema: {},

	init: function() {
		this.parent = this.el.parentElement;

		this.t = 0;
		this.c = new THREE.Clock();

		this.entity = document.createElement('a-entity');

		this.el.appendChild(this.entity);

		// whenever the marker is detected
		this.parent.addEventListener('markerFound', e => {
			this.entity.setAttribute('material', `transparent: true; opacity: 1; color: ${getRandomColor()}`);

			var r = getRandomInt(0, 2);
			switch (r) {
				case 0:
					this.entity.setAttribute('geometry', 'primitive: box; width: 1; height: 1; depth: 1');
					break;
				case 1:
					this.entity.setAttribute('geometry', `primitive: cylinder; segments-radial: ${getRandomInt(1, 6)}`);
					break;
				case 2:
					this.entity.setAttribute('geometry', `primitive: sphere; radius: ${getRandomInt(1, 6)}`);
					break;
			}

			// this.entity.setAttribute('material', 'wireframe', true);
		});
	},

	update: function() {},

	tick: function() {
		// check if marker is visible
		if (this.parent.object3D.visible === true) {
			this.entity.object3D.children[0].material.opacity = beat;
			this.t = this.c.getElapsedTime();
			delta = this.t * 10;
			var scale = 1 + 5 * (1 - beat);
			this.entity.setAttribute('scale', {
				x: scale,
				y: scale,
				z: scale
			});

			// this.entity.setAttribute('position', {
			// 	x: 0,
			// 	y: 0,
			// 	z: -10 * Math.sin(delta)
			// });
		} else {
		}
	}
});
