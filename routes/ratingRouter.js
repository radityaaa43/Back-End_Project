const router = require('express').Router()
const Rating = require('../models/ratingModel')
const mongoose = require('mongoose');
const passport = require("passport");

router.route('/')
.get(passport.authenticate("jwt", { session: false }),async(req, res, next) => {
    try {
        const ratings = await Rating.find()
        res.status = 200;
        res.setHeader('Content-type', 'application/json');
        res.json(ratings)
    } catch (err) {
        return res.status(500).json({msg: err.msg});
    }
  })
.post(passport.authenticate("jwt", { session: false }),async(req, res, next) => {
    try {
        const {idPeminjaman, idBuku, idAnggota, nilaiRating} = req.body
        const newRating = new Rating({idPeminjaman, idBuku, idAnggota, nilaiRating})
        await newRating.save()
        res.status = 200;
        res.setHeader('Content-type', 'application/json');
        res.json({msg: "Done! Thankyou for rating this book "})
    } catch (err) {
        return res.status(500).json({msg: err.msg});
    }
  })
  router.route('/:id')
  .put(passport.authenticate("jwt", { session: false }),(req, res, next) => {
    Rating.findByIdAndUpdate(req.params.id, {
        $set: req.body
    }, {
        new: true
    }).then((Rating) => {
        res.status = 200;
        res.setHeader('Content-type', 'application/json');
        res.json({msg: "Data Updated!"});
    });
})
  .delete(passport.authenticate("jwt", { session: false }),async(req, res, next) => {
    try {
        await Rating.findByIdAndDelete(req.params.id) 
        res.status = 200;
        res.setHeader('Content-type', 'application/json');
        res.json({msg: "Done Deleting this data"}) 
    } catch (err) {
        return res.status(500).json({msg: err.msg});
    }
})


module.exports = router