'use strict'
const https = require('https');
const fs = require('fs');
const ws = require('ws');

const options = {
  key: fs.readFileSync('/etc/letsencrypt/live/arindana.com/privkey.pem', 'utf8'),
  cert: fs.readFileSync('/etc/letsencrypt/live/arindana.com/cert.pem', 'utf8')
};

const index = fs.readFileSync('./client.html');

let server = https.createServer(options, (req, res) => {
  res.writeHead(200);
  res.end(index);
});
server.addListener('upgrade', (req, res, head) => console.log('UPGRADE:', req.url));
//server.on('error', (err) => console.error(err));
server.listen(8000, () => console.log('Https running on port 8000'));

const wss = new ws.Server({server, path: '/echo'});
wss.on('connection', socket => {
      socket.on('message', message => {
        wss.clients.forEach(client=>{
          if(client.readyState === ws.OPEN) client.send(`${message}`)
        })
    })
})
