const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const saltRounds = 10;
const jwt = require('jsonwebtoken');

const userSchema = mongoose.Schema({
    name: {
        type: String,
        maxlength: 50
    },
    email: {
        type: String,
        trim: true,
        unique: 1
    },
    password: {
        type: String,
        minlength: 5
    },
    lastname: {
        type: String,
        maxlength: 50
    },
    role: {
        type: Number,
        default: 0
    },
    image: String,
    token: {
        type: String
    },
    tokenExp: {
        type: Number
    }
})

//function to hash the password
userSchema.pre('save', function (next) {
    var user = this;

    if (user.isModified('password')) {

        bcrypt.genSalt(saltRounds, function (err, salt) {
            if (err) return next(err);

            bcrypt.hash(user.password, salt, function (err, hash) {
                if (err) return next(err);
                user.password = hash
                next()
            })
        })
    } else {
        next()
    }
});

//function to compare password
userSchema.methods.comparePassword = function (plainPassword, cb) {
    //workd only if existing password is hashed
    bcrypt.compare(plainPassword, this.password, function (err, isMatch) {
        console.log("isMatch  ", isMatch);
        if (err) return cb(err);
        cb(null, isMatch);
    })
}

//function to generate token
userSchema.methods.generateToken = function (cb) {
    try {
        let user = this;
        let token = jwt.sign(user._id.toHexString(), 'secret');

        user.token = token;

        user.save(function (err, user) {
            if (err) return cb(err);
            cb(null, user);
        })
    } catch (e) {
        console.log(e);
    }
}

userSchema.statics.findByToken = function (token, cb) {
    let user = this;

    jwt.verify(token, 'secret', function (err, decode) {
        user.findOne({ "_id": decode, "token": token }, function (err, user) {
            if (err) return cb(err);
            cb(null, user);
        })
    })
}


const User = mongoose.model('User', userSchema);
module.exports = { User }