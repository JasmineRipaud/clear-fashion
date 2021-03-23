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

app.get('/', (request, response) => {
  response.send("Clear fashion project");
});


app.get('/products/search', async(request, response) => {
  	let brand = request.query.brand;
	  let price = parseInt(request.query.price);
	  let limit = parseInt(request.query.limit);
  	let res = await db.find({'brand' : brand,'price' : {$lte:price}},limit);
  	let total = res.length;

  	response.send({
  		'limit':limit,
  		'total':total,
  		'results':res
  	});
})



app.listen(PORT);
console.log(`📡 Running on port ${PORT}`);
