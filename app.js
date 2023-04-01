const webSocket = require('ws')
const server    = new webSocket.Server({port:'8080'})
const fs        = require('fs');

const allFileContents = fs.readFileSync('./a.txt', 'utf-8');

//const used = process.memoryUsage().heapUsed / 1024 / 1024;
//console.log(`The script uses approximately ${Math.round(used * 100) / 100} MB`);

// fs.readFile('./a.txt', 'utf8', function(err, data)
// {
//     if (err)
//     {
//         // check and handle err
//     }
//     var linesExceptFirst = data.split('\n').slice(1).join('\n');
//     fs.writeFile('./a.txt', linesExceptFirst, function(err, data) { if (err) {/** check and handle err */} });
// });


server.on('connection', socket => {
    console.log('Client connected')

      allFileContents.split(/\r?\n/).forEach(line =>  {
          socket.send(`past -> ${line}`);
          })                

      socket.on('message', message => {
        server.clients.forEach(client=>{
          if(client.readyState === webSocket.OPEN) client.send(`${message}`)
          fs.appendFile('./a.txt', `${message}\r\n`, function (err) {
            if (err) {
              // append failed
            } else {
              // done
            }
          })
        })
    })
})




console.log('socket initialized on port 8080')