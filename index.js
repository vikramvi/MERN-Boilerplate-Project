const express = require('express');
const app = express();

const dotenv = require('dotenv');
const mongoose = require('mongoose');

const cookieParser = require('cookie-parser');
const { User } = require('./models/user');

const config = require('./config/key');

const { auth } = require('./middleware/auth');

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

//authenticate use with token   
app.use('/api/users/auth', auth, (req, res) => {
    res.status(200).json({
        _id: req._id,
        isAuth: true,
        email: req.user.email,
        name: req.user.name,
        lastname: req.user.lastname,
        role: req.user.role
    })
})

//create new user
app.post('/api/users/register', (req, res) => {
    const user = new User(req.body);

    user.save((err, doc) => {
        if (err) return res.json({ success: false, err });
        return res.status(200).json({
            success: true,
            userData: doc
        })
    })
})

//login with existing user credentials
app.post('/api/users/login', (req, res) => {
    //find email
    User.findOne({ email: req.body.email }, (err, user) => {
        if (!user)
            return res.json({
                loginSuccess: false,
                message: "Auth failed, email not found"
            })

        //compare password
        user.comparePassword(req.body.password, (err, isMatch) => {
            if (!isMatch) {
                return res.json({
                    loginSuccess: false,
                    message: "wrong password"
                })
            }
        })

        //generate token
        user.generateToken((err, user) => {
            try {
                if (err) return res.status(400).send(err);
                res
                    .cookie("x_auth", user.token)
                    .status(200)
                    .json({
                        loginSuccess: true
                    })
                console.log("user.token ", user.token);
            } catch (e) {
                console.log(e);
            }
        })
    })
})

app.get('/api/users/logout', auth, (req, res) => {
    User.findOneAndUpdate({ _id: req.user._id }, { token: "" }, (err, doc) => {
        if (err) res.json({ success: false, err });
        return res.status(200).send({ success: true })
    });
})


//“Hello World!” app with Node.js and Express
//https://medium.com/@adnanrahic/hello-world-app-with-node-js-and-express-c1eb7cfa8a30

app.listen(5000);