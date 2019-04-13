const WebSocket = require('ws');

const PORT = 0xf57; /* "FST"=3927 */
const wss = new WebSocket.Server({ port: PORT });

console.log(`serving on port ${PORT}…`);
wss.on('connection', ws => {
	console.log('connected…');
	ws.on('message', data => {
		console.log('received: %s', data);
		wss.clients.forEach(client => {
			if (client !== ws && client.readyState === WebSocket.OPEN) {
				client.send(data.toString('utf8'));
			}
		});
	});
});
