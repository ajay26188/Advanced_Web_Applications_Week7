// https://www.youtube.com/watch?v=Ud5xKCYQTjM

const express = require("express");
const app = express()
const bcrypt = require("bcryptjs");

app.use(express.json());

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

app.listen(3000);