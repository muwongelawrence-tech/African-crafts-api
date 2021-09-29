const mongoose = require("mongoose");
const Joi = require("joi");
const jwt = require("jsonwebtoken");
const config = require("config");

const userSchema = new mongoose.Schema({
    name : {
      type:String,
      required:true,
      minlength:5,
      maxlength:50
    },
    email: {
        type:String,
        required:true,
        minlength:5,
        maxlength:255,
        unique: true
      },
      password: {
        type:String,
        required:true,
        minlength:5,
        maxlength:1024
      },
      isAdmin :Boolean
  });

  userSchema.methods.generateAuthToken = function(){
    const token = jwt.sign({
      _id: this._id ,
      email:this.email,
      name:this.name, 
      isAdmin : this.isAdmin
     },config.get("jwtPrivateKey"));
    return token;
  }

  const User =  mongoose.model("User",userSchema);


function validateUser(user){
    const schema = {
        name: Joi.string().min(5).max(50).required(),
        email: Joi.string().min(5).max(255).email().required(),
        password: Joi.string().min(5).max(255).required(),

    };
 
     return result = Joi.validate(user, schema);
}

module.exports.User = User;
module.exports.validateUser = validateUser;