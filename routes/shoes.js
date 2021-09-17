const { Shoe , validateShoe } =  require("../models/shoe");
const auth = require("../middleware/auth");
const admin = require("../middleware/admin");
const validateObjectId = require("../middleware/validateObjectId");
const express = require('express');
const mongoose = require("mongoose");
const router = express.Router();

router.get('/', async (req ,res) => {
  
  const shoes = await Shoe.find();

  res.send(shoes);
});

//getting  a shoe with a specific id
router.get('/:id', validateObjectId , async (req,res) => {

    const shoe = await Shoe.findById(req.params.id);

    if(!shoe) return res.status(404).send("The shoe with this id doesnot exist in the database.");
    
    res.send(shoe); 
});

  
// posting requests or creating new resources

  router.post('/', [auth ,admin], async (req,res) => {
    //input validation using joi
     const { error } = validateShoe(req.body);
      if(error) return res.status(400).send(error.details[0].message);
       
       let shoe = new Shoe({
           title : req.body.title,
           price : req.body.price,
           description : req.body.description,
           category : req.body.category,
           image : req.body.image,
           numberInStock : req.body.numberInStock
        });
        
       //save shoe to the database
       shoe = await shoe.save();
      res.send(shoe);
  });

  // updating requests

  router.put('/:id' ,async (req,res) => {
     //vaidating the body sent in the request.
    const { error } = validateShoe(req.body);
    
    if(error) return res.status(400).send(error.details[0].message);

    const shoe = await Shoe.findByIdAndUpdate(req.params.id,{ 
          title : req.body.title,
           price : req.body.price,
           description : req.body.description,
           category : req.body.category,
           image : req.body.image,
           numberInStock : req.body.numberInStock
      }, {new:true});

  
    if(!shoe) res.status(404).send("The shoe with this id doesnot exist in the database.");
    
     res.send(shoe);
  });


  // deleting a resource from the database if you are an authorized user and Adninistrator.
  
  router.delete('/:id',[auth ,admin], async (req,res) => {
    //find and delete a shoe from the database
   const shoe =  await Shoe.findByIdAndRemove(req.params.id);
    if(!shoe){
       res.status(404).send("The shoe with this id doesnot exist in the database.");
    }
   
    res.send(shoe);
  });

module.exports = router;