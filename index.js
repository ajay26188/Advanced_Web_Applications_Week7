// https://www.youtube.com/watch?v=Ud5xKCYQTjM

const express = require("express");
const app = express()
const bcrypt = require("bcryptjs");
const session = require("express-session");

app.use(express.json());
app.use(
    session({
        secret: "12345",
        resave: false,
        saveUninitialized: true,
    })
)

//Task 1
const users = []

app.post("/api/user/register", async (req, res) => {
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

//Task 2
app.post("/api/user/login",async (req, res) => {
    const {username, password} = req.body;
    const user = users.find((user) => user.username === username);

    if (!user || !(await bcrypt.compare(password, user.passowrd))) {
        return res.status(401).json("Wrong password")
    }

    req.session.user = {id: user.id, username: user.username};

    res.cookie("connect.sid",req.sessionID, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
    });

    res.status(200).json("ok");
})

app.listen(3000);