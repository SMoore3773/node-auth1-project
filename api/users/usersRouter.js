const router = require('express').Router();
const users = require('./usersModel');

router.get('/', (req,res)=>{
    users.find()
    .then(users =>{
        res.json(users);
    })
    .catch(err=>{
        res.status(500).send(err)
    })
})
module.exports = router;