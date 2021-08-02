const router = require('express').Router();
const Pustakawan = require('../models/pustakawanModel');
const mongoose = require('mongoose');
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const passport = require("passport");
const {   registerPustakawan, loginPustakawan } = require('../validation');

router.route('/')
.get(async(req, res, next) => {
    try {
        const pustakawans = await Pustakawan.find();
        res.status = 200;
        res.setHeader('Content-type', 'application/json');
        res.json(pustakawans)
    } catch (err) {
        return res.status(500).json({msg: err.msg});
    }
  })
.post(async(req, res, next) => {
    //Validate the data register
    const {error} = registerPustakawan(req.body);
    if(error) return res.status(400).send(error.details[0].message);

    try {
        const {pustakawan_id, name, email, password, address, phoneNumber, gender} = req.body;
   
        const pustakawan = await Pustakawan.findOne({pustakawan_id});
        if(pustakawan){
            return res.status(400).json({msg: "Pustakawan has exists"}); 
        }
        const newPustakawan= new Pustakawan({
            pustakawan_id, name, email, password, address, phoneNumber, gender
        })
        bcrypt.genSalt(10, (err, salt) => {
            bcrypt.hash(newPustakawan.password, salt, (err, hash) => {
                if (err) throw err;
                newPustakawan.password = hash;
                newPustakawan.save()
            })
        })
        res.status = 200;
        res.setHeader('Content-type', 'application/json');
        res.json({msg : "Created a Pustakawan success"});
    } catch (err) {
        return res.status(500).json({msg: err.msg});
    }
  })


router.route('/:id')
.put((req, res, next) => {
      Pustakawan.findByIdAndUpdate(req.params.id, {
          $set: req.body
      }, {
          new: true
      }).then((Pustakawan) => {
          res.status = 200;
          res.setHeader('Content-type', 'application/json');
          res.json({msg: "Data Updated"});
      });
  })

.delete(async(req, res, next) => {
    try {
        await Pustakawan.findByIdAndDelete(req.params.id) 
        res.status = 200;
        res.setHeader('Content-type', 'application/json');
        res.json({msg: "Pustakawan Deleted"}) 
    } catch (err) {
        return res.status(500).json({msg: err.msg});
    }
})

router.post('/auth/login', (req, res, next) => {
    //Login Validation
    const {error} = loginPustakawan(req.body);
    if(error) return res.status(400).send(error.details[0].message);
    
    const email = req.body.email;
    const password = req.body.password;
    Pustakawan.findOne({ email }).then(pustakawan => {
        if (!pustakawan) {
            return res.status(404).json({ error: "Email Not Found !" });
        }
        bcrypt.compare(password, pustakawan.password).then(isMatch => {
            if (isMatch) {
                //pustakawanMatched
                const payload = { id: pustakawan.id, name: pustakawan.name }; 
                //Create JWT Payload
                //Sign Token
                jwt.sign(payload, process.env.KEY, { expiresIn: 3600 }, (err, token) => {
                    res.json({
                        success: true,
                        token: "Bearer " + token
                    });
                });
            } else {
                return res.status(400).json({ error: "Wrong Password !" });
            }
        });
    }).catch(err => console.log(err));
})

router.get('/profile', passport.authenticate("jwt", { session: false }), (req, res, next) => {
    res.json({
        id: req.user.id,
        name: req.user.name,
        email: req.user.email
    })
})

module.exports = router