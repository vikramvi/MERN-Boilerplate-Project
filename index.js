const express = require('express');
const app = express();

const dotenv = require('dotenv');
const mongoose = require('mongoose');

//Node.js Everywhere with Environment Variables!
//https://medium.com/the-node-js-collection/making-your-node-js-work-everywhere-with-environment-variables-2da8cdf6e786

dotenv.config();
//console.log(process.env.DB_USERNAME);

mongoose.connect(`mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@cluster0.suqn1.mongodb.net/NatureDB?retryWrites=true&w=majority`,
    { useNewUrlParser: true })
    .then(() => console.log('DB Connected'))
    .catch(err => console.error(err));


//https://expressjs.com/en/guide/routing.html

app.get('/', (req, res) => {
    res.send('Hello World !');
});


//“Hello World!” app with Node.js and Express
//https://medium.com/@adnanrahic/hello-world-app-with-node-js-and-express-c1eb7cfa8a30

app.listen(5000);