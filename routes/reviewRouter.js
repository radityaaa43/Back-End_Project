const router = require('express').Router()
const Review = require('../models/reviewModel')
const mongoose = require('mongoose');
const passport = require("passport");

router.route('/')
.get(passport.authenticate("jwt", { session: false }),async(req, res, next) => {
    try {
        const reviews = await Review.find()
        res.status = 200;
        res.setHeader('Content-type', 'application/json');
        res.json(reviews)
    } catch (err) {
        return res.status(500).json({msg: err.msg});
    }
  })
.post(passport.authenticate("jwt", { session: false }),async(req, res, next) => {
    try {
        const {idPeminjaman, idBuku, idAnggota, reviewBuku} = req.body
        const newReview = new Review({idPeminjaman, idBuku, idAnggota, reviewBuku})
        await newReview.save()
        res.status = 200;
        res.setHeader('Content-type', 'application/json');
        res.json({msg: "Done! Thankyou for review this book "})
    } catch (err) {
        return res.status(500).json({msg: err.msg});
    }
  })
  router.route('/:id')
  .put(passport.authenticate("jwt", { session: false }),(req, res, next) => {
    Review.findByIdAndUpdate(req.params.id, {
        $set: req.body
    }, {
        new: true
    }).then((Review) => {
        res.status = 200;
        res.setHeader('Content-type', 'application/json');
        res.json({msg: "Data Updated!"});
    });
})
  .delete(passport.authenticate("jwt", { session: false }),async(req, res, next) => {
    try {
        await Review.findByIdAndDelete(req.params.id) 
        res.status = 200;
        res.setHeader('Content-type', 'application/json');
        res.json({msg: "Done Deleting this data"}) 
    } catch (err) {
        return res.status(500).json({msg: err.msg});
    }
})


module.exports = router