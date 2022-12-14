const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const knex = require('knex');
const bcrypt = require('bcryptjs');

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


const app = express();

app.use(bodyParser.json());
app.use(cors());

//create function for getting id so that you don't repeat

app.get('/', (req, res) => {
    res.send('success')
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
    db.select('email', 'hash').from('login')
        .where('email', '=', req.body.email)
        .then(data => {
            const isValid = bcrypt.compareSync(req.body.password, data[0].hash);
            if(isValid){
                db.select('*').from('users')
                    .where('email', '=', req.body.email)
                    .then(user => {
                        res.json(user[0])
                    })
                    .catch(err => res.status(400).json('Unable to login'))

            }else{
                 res.status(400).json('Wrong credentials')      
            }
        })
        .catch(err => res.status(400).json('Wrong credentials'))
        
});

app.post("/register", (req, res) => {
    const { email, name, password } = req.body;
    if(email && name){
        const salt = bcrypt.genSaltSync(14);
        const hash = bcrypt.hashSync(password, salt);
        db.transaction(trx => {
            trx.insert({
                hash: hash,
                email: email
            })
            .into('login')
            .returning('email')
            .then(loginEmail =>{
                
              return trx('users')
                        .returning('*')
                        .insert({
                            email: loginEmail[0].email,
                            name: name,
                            joined: new Date()
                        })
                        .then(user => res.json(user[0]))
                    })
                    .then(trx.commit)
                    .catch(trx.rollback)
                })
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

});

app.listen(3000, () => {
    console.log("App is running");
});