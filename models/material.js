const mongoose = require("mongoose");
const Joi = require("joi");

const materialSchema = new mongoose.Schema({
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
        max:100000
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
    },
    quantity : {
        type:Number,
        required:true,
        min:0,
        max:200
    }
});

const Material =  mongoose.model("Material",materialSchema);


function validateMaterial(material){
    const schema = {
        title: Joi.string().min(5).max(50).required(),
        price: Joi.number().min(5500).max(100000).required(),
        description : Joi.string().min(5).max(255).required(),
        category : Joi.string().min(3).max(50).required(),
        image : Joi.string().min(5).max(70).required(),
        numberInStock : Joi.number().min(0).max(200).required(),
        quantity : Joi.number().min(0).max(200).required(),

    };
 
    return result = Joi.validate(material, schema);
}

module.exports.Material = Material;
module.exports.validateMaterial = validateMaterial;
module.exports.materialSchema = materialSchema;