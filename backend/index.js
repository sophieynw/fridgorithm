'use strict';

const express = require('express');
const app = express();
const cors = require('cors');

app.use(cors());

app.set('port', process.env.PORT || 3000);
const port = app.get('port');

app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
