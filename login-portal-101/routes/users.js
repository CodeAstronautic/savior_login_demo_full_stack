const express = require('express');
const router= express.Router();
const bcrypt= require('bcryptjs');
const passport= require('passport');
//user modal
const User =require('../modals/User');


//Login Page
router.get('/login',(req, res)=>{res.render('login')});

//Register Page
router.get('/register',(req, res)=>{res.render('register')});

//register handle
router.post('/register',(req, res)=>{
    const {name, email, password, password2}= req.body;
    let errors =[];

    //check required fields
    if(!name || !email || !password || !password2){
        errors.push({msg:'please fill in all the fields'});
    }

    //check password match
    if(password !== password2){
        errors.push({msg:'password sdo not match'});
    }

    //check password length
    if(password.length<6){
        errors.push({msg:'password too short, minimum 6 characters'});
    }

    if(errors.length > 0){
        res.render('register',{
            errors,
            name,
            email,
            password,
            password2
        });
    }else{
       //validation passes
       User.findOne({ email: email})
       .then(user =>{
           if(user){
               //user exists
               errors.push({msg : 'Email already registered'});
               res.render('register',{
                errors,
                name,
                email,
                password,
                password2
            });
           } else {
               const newUser = new User({
                   name,
                   email,
                   password,
                   password2
               });

               //hash password
               bcrypt.genSalt(5,(err,salt)=>{
                bcrypt.hash(newUser.password, salt, (err, hash)=>{
                    if(err) throw err;
                    //set password to hashed
                    newUser.password=hash;

                    //save the user
                    newUser.save()
                    .then(user =>{ 
                        req.flash('success_msg', 'You are now registered and can login');
                        res.redirect('/users/login');})
                    .catch(err => console.log(err));
                })
               });

           }
       });
    }


});

// Login handle
router.post('/login',(req,res,next)=>{
    passport.authenticate('local',{
        successRedirect: '/dashboard',
        failureRedirect:'/users/login',
        failureFlash: true
    })(req,res,next);
});

//logout handle
router.get('/logout',(req, res)=>{
    req.logOut();
    req.flash('success_msg','You are logged out');
    res.redirect('/users/login');
});
module.exports= router;