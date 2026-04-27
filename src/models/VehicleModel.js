const mongoose =require('mongoose');
const Schema = mongoose.Schema;
const vehicleSchema = new Schema({
    userId:{
        type:Schema.Types.ObjectId,
        ref:"users"
    },
    registrationNumber:{
        type:String,
        require:true,
        unique:true
    },
    vehicleType:{
        type:String,
        enum:['4 Wheeler','2 Wheeler'],
        require:true
    }

},{timestamps:true})
module.exports=mongoose.model("vehicle",vehicleSchema)