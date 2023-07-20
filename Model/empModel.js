const mongoose=require('mongoose');
const empSchema=mongoose.Schema({
    name:String,
    emailid:String,
    phone:String,
    designation:String,
    salary:String,
    location:String,
    username:String,
    password:String
});
const empData=mongoose.model('empdetail',empSchema);
module.exports=empData;