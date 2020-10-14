const express = require('express');
const app = express();

const dotenv = require('dotenv');
const mongoose = require('mongoose');

const cookieParser = require('cookie-parser');
const { User } = require('./models/user');

const config = require('./config/key');

//Node.js Everywhere with Environment Variables!
//https://medium.com/the-node-js-collection/making-your-node-js-work-everywhere-with-environment-variables-2da8cdf6e786
dotenv.config();
//console.log(process.env.DB_USERNAME);

mongoose.connect(config.mongoURI,
    { useNewUrlParser: true })
    .then(() => console.log('DB Connected'))
    .catch(err => console.error(err));


//https://expressjs.com/en/guide/routing.html
app.get('/', (req, res) => {
    res.send('Hello World !!!');
});


//body parser
//Express JS— body-parser and why may not need it
//https://medium.com/@mmajdanski/express-body-parser-and-why-may-not-need-it-335803cd048c
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//cookie parser
app.use(cookieParser());


app.post('/api/users/register', (req, res) => {
    const user = new User(req.body);

    user.save((err, userData) => {
        if (err) return err.json({ success: false, err });
    })
    return res.status(200);
})


//“Hello World!” app with Node.js and Express
//https://medium.com/@adnanrahic/hello-world-app-with-node-js-and-express-c1eb7cfa8a30

app.listen(5000);