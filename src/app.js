const express = require('express');
const app = express();
const PORT = 3000; 
const userController = require('./controller/userController');
const ticketController = require('./controller/ticketController');

app.use(express.json());

app.use('/users', userController);
app.use('/tickets', ticketController);

app.get('/', (req, res) => {
  res.send('Home Page');
});

app.listen(PORT, () => {
    console.log(`Listening on port: ${PORT}`);
});