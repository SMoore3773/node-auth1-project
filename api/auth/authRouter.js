const router = require('express').Router();
const bcrypt = require('bcryptjs');
const users = require('../users/usersModel');

router.post('/register', async (req,res)=>{
    const user = req.body;
    const hash = bcrypt.hashSync(user.password, 8);
    user.password = hash;

    try{
        const saved = await users.add(user);
        res.status(201).json(saved);
    }catch(err){
        console.log(err);
        res.status(500).json({message:'error in registering account', reason:err.message})
    }

})

router.post('/login', async (req,res)=>{
    let {username, password} = req.body;

    try{
        const user = await users.findBy({username}).first();
        if(user && bcrypt.compareSync(password, user.password)){
            req.session.user = user;
            res.status(200).json({message:`Greetings ${user.username}`})
        }else{
            res.status(401).json({message:'invalid login credentials'})
        }
    }catch(err){
        console.log(err)
        res.status(500).json({message:'error in posting login data', reason:err.message})
    }
})

router.delete('/logout', (req,res)=>{
    if(req.session){
        req.session.destroy((err)=>{
            if(err){
                req.status(400).json({message:"error logging out"})
            }else{
                res.json({message:"logout successful"})
            }
        })
    }else{
        res.end()
    }
})


module.exports = router;