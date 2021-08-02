const mongoose = require("mongoose");


const borrowSchema = new mongoose.Schema(
  {
    idPeminjaman: {
      type: Number,
      required: true,
      primary: true,
    },
    tanggal_pinjam: {
        type: Date,
        required: true,
        min: '1987-09-28',
        max: '2040-07-28'      
    },
    tanggal_kembali: {
        type: Date,
        required: true,
        min: '1987-09-28',
        max: '2040-07-28'
    },
    idBuku: {
      type: Number,
      required: true
    },
    idAnggota: {
      type: Number,
      required: true
    },
    idPetugas:{
      type: Number,
      required: true
    },

  },

  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Checkout", borrowSchema);
