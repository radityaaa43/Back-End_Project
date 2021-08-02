const mongoose = require("mongoose");


const restoreSchema = new mongoose.Schema(
  {
    idPeminjaman: {
      type: Number,
      required: true,
      primary: true
    },
    tanggal_kembali: {
        type: Date,
        required: true,
        min: '1987-09-28',
        max: '2040-07-28'
    },
    denda:{
        type: Number,
        required: true
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

module.exports = mongoose.model("Restore", restoreSchema);