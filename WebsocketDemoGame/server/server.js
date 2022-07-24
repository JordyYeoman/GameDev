const express = require('express');
const { createServer } = require('http');
const { Server } = require('socket.io');

const app = express();
const httpServer = createServer(app);
const port = process.env.PORT || 3000;
// Allowing messages from any origin, fix to only allow from specific web domain.
const io = new Server(httpServer, {
  cors: {
    origin: '*',
  },
});

httpServer.listen(port, () => {
  console.log('BROOOOO, server listening on: ', port);
});

// Socketio controls
io.on('connection', (socket) => {
  console.log('SHITS REAL SON, SOMEBODY UP IN THIS BITCH -> ID: ', socket?.id);

  socket.on('start', function (data) {
    console.log('Incoming data from: ' + `${socket?.id} `, ' data: ', data);
  });

  // Emit all player positions
  socket.emit();
});

// var blobs = [];
// // Array of beer drinking legends ready to race to the bottle-O
// var beerDrinkers = [];

// // function Blob(id, x, y, r) {
// //   this.id = id;
// //   this.x = x;
// //   this.y = y;
// //   this.r = r;
// // }

// // Create the app
// var app = express();

// // Set up the server
// // process.env.PORT is related to deploying on heroku
// var server = app.listen(process.env.PORT || 3000, listen);

// // This call back just tells us that the server has started
// function listen() {
//   //   var host = server.address().address ?? 'localhost';
//   var host = 'localhost';
//   var port = server.address().port;
//   console.log('Example app listening at http://' + host + ':' + port);
// }

// app.use(express.static('public'));

// // WebSocket Portion
// // WebSockets work with the HTTP server
// var io = require('socket.io')(server);

// setInterval(heartbeat, 33);

// function heartbeat() {
//   io.sockets.emit('heartbeat', blobs);
// }

// // Register a callback function to run when we have an individual connection
// // This is run for each individual user that connects
// io.sockets.on(
//   'connection',
//   // We are given a websocket object in our function
//   function (socket) {
//     console.log('We have a new client: ' + socket.id);

//     socket.on('start', function (data) {
//       console.log(socket.id + ' ' + data.x + ' ' + data.y + ' ' + data.r);
//       //   var blob = new Blob(socket.id, data.x, data.y, data.r);
//       //   blobs.push(blob);
//     });

//     // socket.on('update', function (data) {
//     //   //console.log(socket.id + " " + data.x + " " + data.y + " " + data.r);
//     //   var blob;
//     //   for (var i = 0; i < blobs.length; i++) {
//     //     if (socket.id == blobs[i].id) {
//     //       blob = blobs[i];
//     //     }
//     //   }
//     //   blob.x = data.x;
//     //   blob.y = data.y;
//     //   blob.r = data.r;
//     // });

//     socket.on('disconnect', function () {
//       console.log('Client has disconnected');
//     });
//   }
// );

/// KEEP
// References -> The legendary Daniel Shiffman for all of his amazing work on Youtube creating tutorials.
// http://codingtra.in
// http://patreon.com/codingtrain
// Code for: https://youtu.be/ZjVyKXp9hec

// Based off of Shawn Van Every's Live Web
// http://itp.nyu.edu/~sve204/liveweb_fall2013/week3.html
