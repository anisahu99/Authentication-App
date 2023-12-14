const mongoose=require('mongoose');
const Schema=mongoose.Schema;

const githubUserSchema=Schema({
    username:String,
    githubId:String, 
    thumbnail:String
})

const githubUser=mongoose.model('githubuser',githubUserSchema);

module.exports=githubUser;