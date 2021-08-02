const mongoose = require('mongoose');

const bookSchema = new mongoose.Schema({
    
    
    judul_buku: {
        type: String,
        required: true
    },
    id_buku:{
        type: Number,
        required: true,
        primary: true
    },
    image:{
        type: Object,
       
    },
    penulis_buku: {
        type: String,
        required: true
    },
    penerbit_buku: {
        type: String,
        
        required: true
    },
    kategori_buku: {
        type: String,
        required: true
    },
    tahun_terbit: {
        type: Date,
        require: true,
        min: '1987-09-28',
        max: '2040-07-28'
    },
    
    

},{
    timestamps: true
});
module.exports = mongoose.model("Book", bookSchema)