window.onload = function() {
	'use strict';

	const ws = new WebSocket('wss://possan.ngrok.io');
	// setInterval(function() {
	// 	var msg = 1;
	// 	ws.send(msg);
	// 	console.log(msg);
	// }, 500);

	var paths = document.getElementsByTagName('path');
	var visualizer = document.getElementById('visualizer');
	var mask = visualizer.getElementById('mask');
	var path;
	var beat = 0;
	var earliestnextbeat = 0;
	var taptempotimes = [];
	var beatstep = 0;
	var lasttap = 0;

	function doBeat() {
		var T = Date.now();
		if (T > earliestnextbeat) {
			beat = 100;
			console.log('BEAT');
			earliestnextbeat = T + 200;
			ws.send('B');
		}
	}

	var soundAllowed = function(stream) {
		console.log('got sound', stream);
		window.persistAudioStream = stream;

		var audioContent = new AudioContext();
		var audioStream = audioContent.createMediaStreamSource(stream);
		var analyser = audioContent.createAnalyser();
		audioStream.connect(analyser);
		analyser.fftSize = 256;

		var frequencyArray = new Uint8Array(analyser.frequencyBinCount);
		visualizer.setAttribute('viewBox', '0 0 255 255');

		for (var i = 0; i < 128; i++) {
			path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
			path.setAttribute('stroke-dasharray', '4,1');
			mask.appendChild(path);
		}
		var doDraw = function() {
			requestAnimationFrame(doDraw);
			analyser.getByteFrequencyData(frequencyArray);
			var adjustedLength;
			for (var i = 0; i < 127; i++) {
				adjustedLength = Math.floor(frequencyArray[i]) - (Math.floor(frequencyArray[i]) % 5);
				paths[i].setAttribute('d', 'M ' + i + ',255 l 0,-' + adjustedLength);
			}

			var t1 = document.getElementById('t1').value;
			var t2 = document.getElementById('t2').value;

			// bottom peak
			var agg = 0;
			for (var i = 1; i < 5; i++) {
				agg += (frequencyArray[i] / 250) * (frequencyArray[i] / 250);
			}
			agg /= 15;
			agg *= 100;

			var aggall = 0;
			for (var i = 10; i < 127; i++) {
				aggall += (frequencyArray[i] / 250) * (frequencyArray[i] / 250);
			}
			aggall /= 127;
			aggall *= 100;

			if (agg > t1 && aggall > t2 && !manualbpm) {
				doBeat();
			}

			document.getElementById('a').style.width = agg + '%';
			document.getElementById('a2').style.width = (agg > t1) ? '100%' : '0%';

			document.getElementById('b').style.width = aggall + '%';
			document.getElementById('b2').style.width = (aggall > t2) ? '100%' : '0%';

			document.getElementById('c').style.width = beat + '%';

			beat = Math.max(0, beat * 0.8);
			tickbpm();
		};
		doDraw();
	};

	var soundNotAllowed = function(error) {
		console.error('failed to init sound');
		console.error(error);
	};

	// navigator.getUserMedia(, soundAllowed, soundNotAllowed);

	navigator.mediaDevices.getUserMedia({ video: false, audio: true }).then(stream => {
		soundAllowed(stream);
	}).catch(err => {
		soundNotAllowed(err);
	})

	function taptempo() {
		var T = Date.now();
		if (lasttap < (T - 2000)) {
			console.log('reset taptempo');
			taptempotimes = [];
		}
		lasttap = T;
		taptempotimes.push(T);
		if (taptempotimes.length > 4) {
			taptempotimes = taptempotimes.slice(taptempotimes.length - 4, taptempotimes.length);
		}
		console.log('taptempo', T, taptempotimes);
		if (taptempotimes.length > 3) {
			console.log('calc tempo, from input', taptempotimes);
			var avginterval = (
				(taptempotimes[3] - taptempotimes[2]) +
				(taptempotimes[2] - taptempotimes[1]) +
				(taptempotimes[1] - taptempotimes[0])
			) / 3.0;
			console.log('average interval', avginterval);
			beatinterval = avginterval;
			lastbeat = taptempotimes[3];
			beatstep = 0;
			runel.checked = true;
			manualbpm = true;
		}
	}

    window.addEventListener('keydown', k => {
		console.log('key', k)
		if (k.key == 't') {
			taptempo();
		} else {
			ws.send('B');
		}
	})

	var beatinterval = 0;
	var manualbpm = false;

	function tickbpm() {
		var T = Date.now();
		if (T > (lastbeat + beatinterval) && manualbpm) {
			lastbeat = T;
			console.log('manual beat B');
			ws.send('B');
			if (beatstep % 4 == 2) {
				console.log('manual beat A');
				ws.send('A');
			}			
			if (beatstep % 5 == 3) {
				console.log('manual beat C');
				ws.send('C');
			}			
			beatstep += 1;
		}
	}

	function updatebpm() {
		console.log('bpm', bpm);
		beatinterval = 1000 * (60.0 / bpm);
		console.log('interval', beatinterval);
	}

	var lastbeat = 0;

	var t3el = document.getElementById('t3');
	var bpm = t3el.value;
	t3el.addEventListener('change', e => {
		bpm = t3el.value;
		updatebpm();
	});

	updatebpm();

	var runel = document.getElementById('run');
	runel.addEventListener('click', e => { manualbpm = runel.checked; });

	var tapel = document.getElementById('taptempo');
	tapel.addEventListener('click', e => taptempo());
};
