const router = require('express').Router()
const Book = require('../models/bookModel')
const mongoose = require('mongoose');
const passport = require("passport");

router.route('/')
.get(async(req, res, next) => {
    try {
        const books = await Book.find()
        res.status = 200;
        res.setHeader('Content-type', 'application/json');
        res.json(books)
    } catch (err) {
        return res.status(500).json({msg: err.msg});
    }
  })
.post(passport.authenticate("jwt", { session: false }),async(req, res, next) => {
    try {
        const {judul_buku, id_buku, image, penulis_buku, penerbit_buku, kategori_buku, tahun_terbit} = req.body
        const book = await Book.findOne({id_buku})
            if(book){
                return res.status(400).json({msg: "This Book Still not return to the library"}) 
            }
        const newBook = new Book({judul_buku, id_buku, image, penulis_buku, penerbit_buku, kategori_buku, tahun_terbit})
        await newBook.save()
        res.status = 200;
        res.setHeader('Content-type', 'application/json');
        res.json({msg: "Done! Thank you for adding this book "})
    } catch (err) {
        return res.status(500).json({msg: err.msg});
    }
  })

  router.route('/:id')
  .put((req, res, next) => {
      Book.findByIdAndUpdate(req.params.id, {
          $set: req.body
      }, {
          new: true
      }).then((Book) => {
          res.status = 200;
          res.setHeader('Content-type', 'application/json');
          res.json({msg: "Data Updated!"});
      });
  })
  .delete(passport.authenticate("jwt", { session: false }),async(req, res, next) => {
    try {
        await Book.findByIdAndDelete(req.params.id) 
        res.status = 200;
        res.setHeader('Content-type', 'application/json');
        res.json({msg: "Done Deleting this book"}) 
    } catch (err) {
        return res.status(500).json({msg: err.msg});
    }
})
.get((req, res, next) => {
    try {
        Book.findById(req.params.id, (err, book) => {
            if (err) res.send(err);
            Book.find({ "kategori_buku" : book.kategori_buku },(err,all_book)=>{
                data = []
                data.push({
                    book : book,
                    recomendation : all_book
                })
                console.log(data)
                res.status = 200;
                res.setHeader('Content-type', 'application/json');
                res.json(data);
            })
        })
    } catch (err) {
        return res.status(500).json({msg: err.msg});
    }
})



module.exports = router