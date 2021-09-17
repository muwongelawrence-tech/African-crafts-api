const {  Material , validateMaterial } =  require("../models/material");
const auth = require("../middleware/auth");
const admin = require("../middleware/admin");
const validateObjectId = require("../middleware/validateObjectId");
const express = require('express');
const mongoose = require("mongoose");
const router = express.Router();

//Getting all materials from the database
router.get('/', async (req ,res) => {
  
  const materials = await Material.find();

  res.send(materials);
});

//getting  a material with a specific id
router.get('/:id', validateObjectId , async (req,res) => {

    const material = await Material.findById(req.params.id);

    if(!material) return res.status(404).send("The material with this id doesnot exist in the database.");
    
    res.send(material); 
});

  
// posting requests or creating new resources

router.post('/',[auth ,admin], async (req,res) => {
    //input validation using joi
     const { error } = validateMaterial(req.body);
     if(error) return res.status(400).send(error.details[0].message);
       
     // then create new material and save it to the database
       let material = new Material({
           title : req.body.title,
           price : req.body.price,
           description : req.body.description,
           category : req.body.category,
           image : req.body.image,
           numberInStock : req.body.numberInStock
      });
        
     //save material to the database
     material = await material.save();
    res.send(material);
});

  
// updating material

  router.put('/:id' , [auth ,admin] ,async (req,res) => {
     //vaidating the body sent in the request.
    const { error } = validateMaterial(req.body);
    if(error) return res.status(400).send(error.details[0].message);

    const material = await Material.findByIdAndUpdate(req.params.id,{ 
          title : req.body.title,
          price : req.body.price,
          description : req.body.description,
          category : req.body.category,
          image : req.body.image,
          numberInStock : req.body.numberInStock

      }, { new:true });

  
    if(!material) res.status(404).send("The material with this id doesnot exist in the database.");
    
     res.send(material);
  });


  // deleting a resource from the database if you are an authorized user and Adninistrator.
  
  router.delete('/:id',[auth ,admin], async (req,res) => {
  //find and delete a material from the database
   const material =  await Material.findByIdAndRemove(req.params.id);
    if(!material){
       res.status(404).send("The material with this id doesnot exist in the database.");
    }
   
    res.send(material);
  });

module.exports = router;