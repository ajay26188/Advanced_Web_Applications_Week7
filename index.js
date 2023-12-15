// https://www.youtube.com/watch?v=Ud5xKCYQTjM

const express = require("express");
const app = express()
const bcrypt = require("bcryptjs");
const session = require("express-session");
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;

app.use(express.json());
app.use(session({
        secret: "12345",
        resave: false,
        saveUninitialized: false,
}));

app.use(passport.initialize());
app.use(passport.session());


//Task 1 - Registration
const users = []

app.post("/api/user/register", checkNotAuthenticated, async (req, res) => {

    const userID = Math.floor(Math.random()*1000000);
    const hashedPassword = await bcrypt.hash(req.body.password, 10);
    const user = {id: userID, username: req.body.username, password: hashedPassword}
    const checkUsername = users.find(user => user.username ===  req.body.username);

    if (checkUsername) {
        return res.status(400).json("Username already exists!");
    } else {
        users.push(user);
        res.json(user);
    }  
})

app.get('/api/user/list', function(req, res) {
    res.json(users);
})

//Task 2 - Login
passport.use(new LocalStrategy(
    async function (username, password, done) {
        const user = users.find(user => user.username === username);
        if (!user) {
            return done(null, false);
        }
        try {
            if (await bcrypt.compare(password, user.password)) {
                return done(null, user);
            }else {
                return done(null, false)
            }   
        } catch (e) {
            return done(e);
        }
    }
))

passport.serializeUser((user, done) => {
    done(null, user.id);
})

passport.deserializeUser((id, done) => {
    const user = users.find(user => user.id === id);
    done(null, user);
})

app.post("/api/user/login", checkNotAuthenticated, passport.authenticate('local'),(req, res) => {
    res.status(200).json('ok');
})

//Task 3 - Secret route

function checkAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
        return next()
    }
    return res.status(401)
}

app.get("/api/secret", checkAuthenticated, (req,res) => {
    res.status(200);
})

//Task 4 - Login redirection

app.get("/",(req,res) => {
    res.status(200);
})

function checkNotAuthenticated(req,res,next) {
    if (req.isAuthenticated()) {
        return res.redirect("/");
    }
    return next()
}


app.listen(3000);