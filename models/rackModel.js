const mongoose = require('mongoose')


const RackScheema = new mongoose.Schema({
    nama_rak : {
        type : String,
        required : true
    },
    lokasi_rak : {
        type : String,
        required : true
    },
    
}, {
    timestamps : true
})

module.exports = mongoose.model('Rack', RackScheema)