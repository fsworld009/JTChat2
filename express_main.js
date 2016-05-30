var express = require('express');
var app = express();
var path = require('path');

// app.get('/', function (req, res) {
//   res.send('Hello World!');
// });

app.use('/', express.static(path.resolve(__dirname + '/web')));

app.listen(3000, function () {
  console.log('Example app listening on port 3000!');
});
