const mongoose = require("mongoose");
const Joi = require("joi");

const shoeSchema = new mongoose.Schema({
    title : {
      type:String,
      required:true,
      minlength:5,
      maxlength:50
    },
    price : {
        type:Number,
        required:true,
        min:5500,
        max:15000
    },
    description : {
        type:String,
        required:true,
        minlength:5,
        maxlength:255
    },
    category: {
        type:String,
        required:true,
        minlength:3,
        maxlength:50
    },
    image: {
        type:String,
        required:true,
        minlength:5,
        maxlength:70
    },
    numberInStock : {
        type:Number,
        required:true,
        min:0,
        max:200
    }
});

const Shoe =  mongoose.model("Shoe",shoeSchema);


function validateShoe(shoe){
    const schema = {
        title: Joi.string().min(5).max(50).required(),
        price: Joi.number().min(5500).max(15000).required(),
        description : Joi.string().min(5).max(255).required(),
        category : Joi.string().min(3).max(50).required(),
        image : Joi.string().min(5).max(70).required(),
        numberInStock : Joi.number().min(0).max(200).required()
  };
 
    return result = Joi.validate(shoe, schema);
}

module.exports.Shoe = Shoe;
module.exports.validateShoe = validateShoe;
module.exports.shoeSchema = shoeSchema;