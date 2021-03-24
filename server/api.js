const cors = require('cors');
const express = require('express');
const helmet = require('helmet');
const db= require('./db/index.js')
const PORT = 8092;
const app = express();

module.exports = app;

app.use(require('body-parser').json());
app.use(cors());
app.use(helmet());
app.options('*', cors());


app.get('/', async(request, response) => {
  const query = request.query;
  try{
    if(query.size){
      if(query.page){
        const result = await db.find({},{_id:0},parseInt(query.page),parseInt(query.size))
        response.send(result)

      }else{
        const result = await db.find({},{_id:0},1,parseInt(query.size))
        response.send(result)}
    }
    else if(query.brand){
      const result = await db.find({"brand" : query.brand},{_id:0})
      response.send(result)
    }
    else if (query.price){
      const result = await db.find({"price" : {$lte : parseInt(query.price)}},{_id:0})
      response.send(result)
    }
    else if(query.brand && query.price){
      const result = await db.find({"brand" : query.brand, "price" : {$lte : parseInt(query.price)}},{_id : 0})
      response.send(result)
    }
    else if(query.brand && query.size){
      if(query.page){
        const result = await db.find({"brand" : query.brand},{_id:0},parseInt(query.page),parseInt(query.size))
        response.send(result)

      }else{
        const result = await db.find({"brand" : query.brand},{_id : 0},1,parseInt(query.size))
        response.send(result)
      }
    }
    else if(query.size && query.price){
      const result = await db.find({"price" : {$lte : parseInt(query.price)}},{_id : 0},1,parseInt(query.size))
      response.send(result)
    }
    else if(query.size && query.price && query.brand){
      if(query.page){
        const result = await db.find({"brand" : query.brand, "price" : {$lte : parseInt(query.price)}},{_id:0},parseInt(query.page),parseInt(query.size))
        response.send(result)
      }else{
        const result = await db.find({"brand" : query.brand, "price" : {$lte : parseInt(query.price)}},{_id : 0},1,parseInt(query.size))
        response.send(result)}
    }else {
			const result = await db.find({},{_id : 0});
			response.send(result);
    }
  }catch(e){
    response.send(e)
  }
})


app.listen(PORT);
console.log(`📡 Running on port ${PORT}`);
