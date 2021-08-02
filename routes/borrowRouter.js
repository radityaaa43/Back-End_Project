const router = require('express').Router()
const Borrow = require('../models/borrowModel')
const mongoose = require('mongoose');
const passport = require("passport");


router.route('/')
.get(passport.authenticate("jwt", { session: false }), async(req, res, next) => {
    try {
        const borrows = await Borrow.find()
        res.status = 200;
        res.setHeader('Content-type', 'application/json');
        res.json(borrows)
    } catch (err) {
        return res.status(500).json({msg: err.msg});
    }
  })
.post(passport.authenticate("jwt", { session: false }),async(req, res, next) => {
    try {
        const {idPeminjaman, tanggal_pinjam, tanggal_kembali, idBuku, idAnggota, idPetugas } = req.body
        const borrow = await Borrow.findOne({idPeminjaman})
            if(borrow){
                return res.status(400).json({msg: "This BorrowID already used by another user"}) 
            }
        const newBorrow = new Borrow({idPeminjaman, tanggal_pinjam, tanggal_kembali, idBuku, idAnggota, idPetugas })
        await newBorrow.save()
        res.status = 200;
        res.setHeader('Content-type', 'application/json');
        res.json({msg: "Done! Dont forget to return it "})
    } catch (err) {
        return res.status(500).json({msg: err.msg});
    }
  })

router.route('/:id')
.put(passport.authenticate("jwt", { session: false }),(req, res, next) => {
    Borrow.findByIdAndUpdate(req.params.id, {
        $set: req.body
    }, {
        new: true
    }).then((Borrow) => {
        res.status = 200;
        res.setHeader('Content-type', 'application/json');
        res.json({msg: "Data Updated!"});
    });
})
.delete(passport.authenticate("jwt", { session: false }), async(req, res, next) => {
    try {
        await Borrow.findByIdAndDelete(req.params.id) 
        res.status = 200;
        res.setHeader('Content-type', 'application/json');
        res.json({msg: "Done Deleting this data"}) 
    } catch (err) {
        return res.status(500).json({msg: err.msg});
    }
})



module.exports = router