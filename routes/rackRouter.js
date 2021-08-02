const router = require('express').Router()
const Rack = require('../models/rackModel')
const mongoose = require('mongoose');
const passport = require("passport");

router.route('/')
.get(async(req, res, next) => {
    try {
        const racks = await Rack.find()
        res.status = 200;
        res.setHeader('Content-type', 'application/json');
        res.json(racks)
    } catch (err) {
        return res.status(500).json({msg: err.msg});
    }
  })
.post(passport.authenticate("jwt", { session: false }),async(req, res, next) => {
    try {
        const {nama_rak, lokasi_rak} = req.body
        const rack = await Rack.findOne({nama_rak})
            if(rack){
                return res.status(400).json({msg: "This Rack Already Exist"}) 
            }
        const newRack = new Rack({nama_rak, lokasi_rak})
        await newRack.save()
        res.status = 200;
        res.setHeader('Content-type', 'application/json');
        res.json({msg: "Done! Thank you for adding this rack "})
    } catch (err) {
        return res.status(500).json({msg: err.msg});
    }
  })

  router.route('/:id')
  .put(passport.authenticate("jwt", { session: false }),(req, res, next) => {
      Rack.findByIdAndUpdate(req.params.id, {
          $set: req.body
      }, {
          new: true
      }).then((Rack) => {
          res.status = 200;
          res.setHeader('Content-type', 'application/json');
          res.json({msg: "Data Updated!"});
      });
  })
  .delete(passport.authenticate("jwt", { session: false }),async(req, res, next) => {
    try {
        await Rack.findByIdAndDelete(req.params.id) 
        res.status = 200;
        res.setHeader('Content-type', 'application/json');
        res.json({msg: "Done Deleting this rack"}) 
    } catch (err) {
        return res.status(500).json({msg: err.msg});
    }
})



module.exports = router