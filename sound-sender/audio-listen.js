const fs = require('fs');
const Speaker = require('speaker');
const createMusicStream = require('create-music-stream'); //read this https://github.com/chrvadala/create-music-stream#faq
const { MusicBeatDetector, MusicBeatScheduler, MusicGraph } = require('music-beat-detector');

const musicSource = process.argv[2]; //get the first argument on cli

const musicGraph = new MusicGraph();

const musicBeatScheduler = new MusicBeatScheduler(pos => {
	console.log(`peak at ${pos}ms`); // your music effect goes here
});

const musicBeatDetector = new MusicBeatDetector({
	plotter: musicGraph.getPlotter(),
	scheduler: musicBeatScheduler.getScheduler()
});

createMusicStream(musicSource)
	.pipe(musicBeatDetector.getAnalyzer())
	.on('peak-detected', (pos, bpm) => console.log(`peak-detected at ${pos}ms, detected bpm ${bpm}`))
	.on('end', () => {
		fs.writeFileSync('graph.svg', musicGraph.getSVG());
		console.log('end');
	})

	.pipe(new Speaker())
	.on('open', () => musicBeatScheduler.start());
