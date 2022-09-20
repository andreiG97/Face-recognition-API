const express = require("express");
const bodyParser = require("body-parser");

const cors = require("cors");
const app = express();

app.use(bodyParser.json());
app.use(cors());
const database = {
    users:[
        {
            id: '123',
            name: 'Dumbo',
            email: 'dumbo@gmail.com',
            password: 'cookie',
            entries: 0,
            joined: new Date()
        },
        {
            id: '133',
            name: 'Paco',
            email: 'Paco@gmail.com',
            password: 'cookie',
            entries: 0,
            joined: new Date()
        },
    ]
};

//create function for getting id so that you don't repeat

app.get('/', (req, res) => {
    res.send(database.users);
})

app.get("/profile/:id", (req, res) => {
    const { id } = req.params;
    let found = false;
    database.users.forEach((user) => {
        if(user.id === id){
            found = true;
            return res.json(user);
        }
    })
    if(!found){
        res.status(400).json("User doesn't exist");
    }
});

app.post("/signin", (req, res) => {
    if(req.body.email === database.users[1].email && 
       req.body.password === database.users[1].password){
     
            res.json(database.users[1]);
          
        }else{
            res.status(400).json("error logging in");
        }
});

app.post("/register", (req, res) => {
    const { email, name, password } = req.body;
    database.users.push({
        id: '123',
        name: name,
        email: email,
        entries: 0,
        joined: new Date()
    });
    res.json(database.users[database.users.length-1]);
});

app.put('/image', (req, res) => {
    const { id } = req.body;
    let found = false;
    database.users.forEach( user => {
        if(user.id === id){
            found = true;
            user.entries += 1;
            console.log(user.entries)
            return res.json(user.entries);
        }
    
    })
    if(!found){
        res.status(400).json("User doesn't exist");
    }

});

app.listen(3000, () => {
    console.log("App is running");
});