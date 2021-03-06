const request = require("supertest");
const {  Shoe } = require("../../models/shoe");
const { User } = require("../../models/user");
const mongoose = require("mongoose");

let server;

describe("/api/shoes" ,() => {

    beforeEach(() => { server = require("../../index");});

    afterEach( async () => {
           await server.close();
         await Shoe.remove({});
         
    });

    describe("GET /" ,  () => {

        it("should return all shoes" , async () => {
           await Shoe.collection.insertMany([
                { title: "craft1"},
                { title : "craft2"},
            ]);

           const res =  await request(server).get('/api/shoes');
           expect(res.status).toBe(200);
          // expect(res.body.length).toBeGreaterThan(2);
           expect(res.body.length).toBe(2);
           expect (res.body.some(g => g.title === "craft1")).toBeTruthy();
           expect (res.body.some(g => g.title === "craft2")).toBeTruthy();

          
        });
    });

    // An integration test to agenre with a specific id.
    // Test suite for getting genre with a specific id
    describe('GET /:id' , () => {

        it('should return a genre if valid id is passed ' , async () => {
           const genre = new Shoe({ name: "genre1" });
           await genre.save();

           const res = await request(server).get('/api/genres/' + genre._id);
           expect(res.status).toBe(200);
           expect(res.body).toHaveProperty('name',genre.name);
       });

       it('should return 404 if invalid id is passed', async () => {
        const res = await request(server).get('/api/genres/1');
  
        expect(res.status).toBe(404);
      });

      it('should return 404 if no genre with the given id exists ', async () => {

        const id = mongoose.Types.ObjectId();
        const res = await request(server).get('/api/genres/' + id);
  
        expect(res.status).toBe(404);
      });
   });

   //Test suite for Post  requests
        describe('POST /' , () => {
             
          let token;
          let name;
          // this is reusable at the beginning of each test.
          const exec = async () => {
            return  await request(server)
            .post("/api/genres")
            .set("x-auth-token" ,token)
            .send({name});
          };

          beforeEach(() => {
             token = new User().generateAuthToken();
             name = "genre1";
          });

            it("should return 401 if client is not logged in" ,async () => {
                token = '';

                const res = await exec();

              expect(res.status).toBe(401);
            });

            it("should return 400 if genre is lessthan 5 characters" ,async () => {
                 name = "123"; 

                const res = await exec();

                 expect(res.status).toBe(400);
            });

            it("should return 400 if genre is morethan 50 characters" ,async () => {
                  //generate a testing long string 
                 name = new Array(52).join("a");

                const res = await exec();

                 expect(res.status).toBe(400);
            });

            it("should save the genre if it is valid " ,async () => {
                
                   await exec();
                
                   const genre = await Shoe.find({ name: "genre1" });

                  expect(genre).not.toBeNull();
            });


            it("should return the genre if it is valid " ,async () => {
            
              const res = await exec();
                
              expect(res.body).toHaveProperty("_id");
              expect(res.body).toHaveProperty('name', 'genre1');
            });

          });

    // testing put requests
          describe('PUT /:id', () => {
            let token; 
            let newName; 
            let genre; 
            let id; 
        
            const exec = async () => {
              return await request(server)
                .put('/api/genres/' + id)
                .set('x-auth-token', token)
                .send({ name: newName });
            }
        
            beforeEach(async () => {
              // Before each test we need to create a genre and 
              // put it in the database.      
              genre = new Shoe({ name: 'genre1' });
               await genre.save();
              
              token = new User().generateAuthToken();

              id = genre._id; 

              newName = 'updatedName'; 
            });
        
            it('should return 401 if client is not logged in', async () => {
              token = ''; 
        
              const res = await exec();
        
              expect(res.status).toBe(401);
            });
        
            it('should return 400 if genre is less than 5 characters', async () => {
              newName = '1234'; 
              
              const res = await exec();
        
              expect(res.status).toBe(400);
            });
        
            it('should return 400 if genre is more than 50 characters', async () => {
              newName = new Array(52).join('a');
        
              const res = await exec();
        
              expect(res.status).toBe(400);
            });
        
            it('should return 404 if id is invalid', async () => {
              id = "";
              const res = await exec();
        
              expect(res.status).toBe(404);
            });
        
            it('should return 404 if genre with the given id was not found', async () => {
              id = mongoose.Types.ObjectId();
        
              const res = await exec();
        
              expect(res.status).toBe(404);
            });
        
            it('should update the genre if input is valid', async () => {
              await exec();
        
              const updatedGenre = await Shoe.findById(genre._id);
        
              expect(updatedGenre.name).toBe(newName);
            });
        
            it('should return the updated genre if it is valid', async () => {
              const res = await exec();
        
              expect(res.body).toHaveProperty('_id');
              expect(res.body).toHaveProperty('name', newName);
            });
          });

        //Deleting Genres Tests
          describe('DELETE /:id', () => {
            let token; 
            let genre; 
            let id; 
        
            const exec = async () => {
              return await request(server)
                .delete('/api/genres/' + id)
                .set('x-auth-token', token)
                .send();
            }
        
            beforeEach(async () => {
              // Before each test we need to create a genre and 
              // put it in the database.      
              genre = new Shoe({ name: 'genre1' });
              await genre.save();
              
              id = genre._id; 

              token = new User({ isAdmin: true }).generateAuthToken();     
            });
        
            it('should return 401 if client is not logged in', async () => {
              token = ''; 
        
              const res = await exec();
        
              expect(res.status).toBe(401);
            });
        
            it('should return 403 if the user is not an admin', async () => {
              token = new User({ isAdmin: false }).generateAuthToken(); 
        
              const res = await exec();
        
              expect(res.status).toBe(403);
            });
        
            it('should return 404 if id is invalid', async () => {
              id = ""; 
              
              const res = await exec();
        
              expect(res.status).toBe(404);
            });
        
            it('should return 404 if no genre with the given id was found', async () => {
              id = mongoose.Types.ObjectId();
        
              const res = await exec();
        
              expect(res.status).toBe(404);
            });
        
            it('should delete the genre if input is valid', async () => {
              await exec();
        
              const genreInDb = await Shoe.findById(id);
        
              expect(genreInDb).toBeNull();
            });
        
            it('should return the removed genre', async () => {
              const res = await exec();
        
              expect(res.body).toHaveProperty('_id', genre._id.toHexString());
              expect(res.body).toHaveProperty('name', genre.name);
            });
          }); 
   
});