AFRAME.registerComponent('basic', {
	schema: {},

	update: function() {
		var data = this.data;
		var el = this.el;

		this.t = 0;
		this.c = new THREE.Clock();

		this.ent = document.createElement('a-entity');
		this.ent.setAttribute('geometry', 'primitive: box; width: 1; height: 1; depth: 1');
		this.ent.setAttribute('material', 'transparent: true; opacity: 1');
		this.ent.setAttribute('material', 'color', getRandomColor());

		el.appendChild(this.ent);

		this.el.parentElement.addEventListener('markerFound', e => {
			this.ent.setAttribute('material', 'color', getRandomColor());
		});
	},

	tick: function() {
		this.ent.object3D.children[0].material.opacity = beat;

		this.t = this.c.getElapsedTime();
		delta = this.t * 10;
		// this.ent.setAttribute('position', {
		// 	x: 0,
		// 	y: 0,
		// 	z: -10 * Math.sin(delta)
		// });
	}
});
