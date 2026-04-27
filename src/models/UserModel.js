const mongoose =require('mongoose')

const Schema = mongoose.Schema;

// Role enum: 1 = user, 2 = parking_owner, 3 = admin
const role = [1, 2, 3];

const userSchema = new Schema({

    firstname:{
        type:String
    },
    lastname:{
        type:String
    },
    age:{
        type:String
    },
    email:{
        type:String,
        unique:true
    },
    password:{
        type:String
    },
    phonenumber:{
        type:String
    },
    businessName:{
        type:String
    },

    role:{
        type:Number,
        enum: role,
        default: 1 // Default to user role
    },
   
   

})
module.exports =mongoose.model('users',userSchema)
