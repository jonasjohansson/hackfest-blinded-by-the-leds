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

			if (agg > t1 && aggall > t2) {
				doBeat();
			}

			document.getElementById('a').style.width = agg + '%';
			document.getElementById('a2').style.width = (agg > t1) ? '100%' : '0%';

			document.getElementById('b').style.width = aggall + '%';
			document.getElementById('b2').style.width = (aggall > t2) ? '100%' : '0%';

			document.getElementById('c').style.width = beat + '%';

			beat = Math.max(0, beat * 0.8);

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

};
