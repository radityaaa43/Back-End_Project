const mongoose = require('mongoose');

const memberSchema = new mongoose.Schema({
    
    
    name: {
        type: String,
        required: true
    },
    member_id:{
        type: Number,
        required: true,
        unique: true
    },
            
    address: {
        type: String,
        required: true
    },
    email: {
        type: String,
        
        required: true
    },
    password: {
        type: String,
        required: true
    },
    phoneNumber: {
        type: Number,
        require: true
    },
    gender:{
        type: String,
        require: true
    }
    

},{
    timestamps: true
});
module.exports = mongoose.model("Member", memberSchema)