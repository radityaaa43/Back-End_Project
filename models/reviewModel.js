const mongoose = require("mongoose");


const reviewSchema = new mongoose.Schema(
  {
    idPeminjaman: {
      type: Number,
      required: true,
      primary: true
    },
    idBuku: {
      type: Number,
      required: true
    },
    idAnggota: {
      type: Number,
      required: true
    },
    reviewBuku: {
        type: String,
        required: true
      },

  },

  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Review", reviewSchema);