const router = require('express').Router()
const Restore = require('../models/restoreModel')
const mongoose = require('mongoose');
const passport = require("passport");


router.route('/')
.get(passport.authenticate("jwt", { session: false }),async(req, res, next) => {
    try {
        const restores = await Restore.find()
        res.status = 200;
        res.setHeader('Content-type', 'application/json');
        res.json(restores)
    } catch (err) {
        return res.status(500).json({msg: err.msg});
    }
  })
.post(passport.authenticate("jwt", { session: false }),async(req, res, next) => {
    try {
        const {idPeminjaman, tanggal_kembali, denda, idBuku, idAnggota, idPetugas} = req.body
        const restore = await Restore.findOne({idPeminjaman})
            if(restore){
                return res.status(400).json({msg: "This RestoreID already used by another user"}) 
            }
        const newRestore = new Restore({idPeminjaman, tanggal_kembali, denda, idBuku, idAnggota, idPetugas})
        await newRestore.save()
        res.status = 200;
        res.setHeader('Content-type', 'application/json');
        res.json({msg: "Done! Thankyou for return this book "})
    } catch (err) {
        return res.status(500).json({msg: err.msg});
    }
  })

  router.route('/:id')
  .put(passport.authenticate("jwt", { session: false }),(req, res, next) => {
      Restore.findByIdAndUpdate(req.params.id, {
          $set: req.body
      }, {
          new: true
      }).then((Restore) => {
          res.status = 200;
          res.setHeader('Content-type', 'application/json');
          res.json({msg: "Data Updated!"});
      });
  })
  .delete(passport.authenticate("jwt", { session: false }),async(req, res, next) => {
    try {
        await Restore.findByIdAndDelete(req.params.id) 
        res.status = 200;
        res.setHeader('Content-type', 'application/json');
        res.json({msg: "Done Deleting this data"}) 
    } catch (err) {
        return res.status(500).json({msg: err.msg});
    }
})



module.exports = router