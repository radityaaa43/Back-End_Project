const router = require('express').Router();
const Member = require('../models/memberModel');
const mongoose = require('mongoose');
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const passport = require("passport");
const { registerValidation, loginValidation } = require('../validation');

router.route('/')
.get(async(req, res, next) => {
    try {
        const members = await Member.find();
        res.status = 200;
        res.setHeader('Content-type', 'application/json');
        res.json(members)
    } catch (err) {
        return res.status(500).json({msg: err.msg});
    }
  })
.post(async(req, res, next) => {
    //Validate the data register
    const {error} = registerValidation(req.body);
    if(error) return res.status(400).send(error.details[0].message);

    try {
        const {member_id, name, email, password, address, phoneNumber, gender} = req.body;
   
        const member = await Member.findOne({member_id});
        if(member){
            return res.status(400).json({msg: "Member has exists"}); 
        }
        const newMember= new Member({
            member_id, name, email, password, address, phoneNumber, gender
        })
        bcrypt.genSalt(10, (err, salt) => {
            bcrypt.hash(newMember.password, salt, (err, hash) => {
                if (err) throw err;
                newMember.password = hash;
                newMember.save()
            })
        })
        res.status = 200;
        res.setHeader('Content-type', 'application/json');
        res.json({msg : "Created a Member success"});
    } catch (err) {
        return res.status(500).json({msg: err.msg});
    }
  })


router.route('/:id')
.put((req, res, next) => {
      Member.findByIdAndUpdate(req.params.id, {
          $set: req.body
      }, {
          new: true
      }).then((Member) => {
          res.status = 200;
          res.setHeader('Content-type', 'application/json');
          res.json({msg: "Data Updated"});
      });
  })

.delete(async(req, res, next) => {
    try {
        await Member.findByIdAndDelete(req.params.id) 
        res.status = 200;
        res.setHeader('Content-type', 'application/json');
        res.json({msg: "Member Deleted"}) 
    } catch (err) {
        return res.status(500).json({msg: err.msg});
    }
})

router.post('/auth/login', (req, res, next) => {
    //Login Validation
    const {error} = loginValidation(req.body);
    if(error) return res.status(400).send(error.details[0].message);
    
    const email = req.body.email;
    const password = req.body.password;
    Member.findOne({ email }).then(member => {
        if (!member) {
            return res.status(404).json({ error: "Email Not Found !" });
        }
        bcrypt.compare(password, member.password).then(isMatch => {
            if (isMatch) {
                //memberMatched
                const payload = { id: member.id, name: member.name }; 
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