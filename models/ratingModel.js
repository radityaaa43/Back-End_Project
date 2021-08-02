const mongoose = require("mongoose");


const ratingSchema = new mongoose.Schema(
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
    nilaiRating: {
        type: Number,
        required: true
      },

  },

  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Rating", ratingSchema);