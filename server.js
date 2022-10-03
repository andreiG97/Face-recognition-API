const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const knex = require('knex');

const db = knex({
    client: 'pg',
    connection: {
      host : '127.0.0.1', //localhost to be modfied when deploying
      port : 5432,
      user : 'postgres',
      password : 'Ppa97ss1@A',
      database : 'smart-brain'
    }
  });

// db.select('*').from('users').then(data =>{
//     console.log(data);
// })

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
    db.select('*')
                  .from('users')
                  .where({id: id})
                  .then(user => {

                      if(user.length){
                          res.json(user[0])
                      }else{
                          res.status(400).json("Not found")
                      }
                  })
                  .catch(err => res.status(400).json("User doesn't exist"))

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
    if(email && name){
        
        db('users')
                .returning('*')
                .insert({
                    email: email,
                    name: name,
                    joined: new Date()
                })
                .then(user => res.json(user[0]))
                .catch(err => res.status(400).json('User already exists'))
    }
});

app.put('/image', (req, res) => {
    const { id } = req.body;
    db('users').where('id', '=', id)
    .increment('entries', 1)
    .returning('entries')
    .then(entries => {
        res.json(entries[0].entries);
    })
    .catch(err => res.status(400).json('Unable to get entries'))
    // let found = false;
    // database.users.forEach( user => {
    //     if(user.id === id){
    //         found = true;
    //         user.entries += 1;
    //         console.log(user.entries)
    //         return res.json(user.entries);
    //     }
    
    // })
    // if(!found){
    //     res.status(400).json("User doesn't exist");
    // }

});

app.listen(3000, () => {
    console.log("App is running");
});