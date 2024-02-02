const mongoose = require('mongoose'); 
const Schema = mongoose.Schema;             // Schema constructor provided with mongoose ODM

//MONGOOSE MODEL DOCS: https://mongoosejs.com/docs/models.html

// DESCRIPTION OF SCHEMA (BLUEPRINT)
const productSchema = new Schema({
  title: {
    type: String, 
    required: true        //require is an attribute saying that there must be an input for 'title' when instantiated
  }, 
  price: {
    type: Number,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  imageUrl: {
    type: String,
    required: true
  },
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',                        //set up relationship to User model
    required: true
  }
});

// mongoose method connects a schema with the 'Name' you want for the model and the schema.
// Mongoose automatically creates a Collection ('table') that lowercases table name and makes it plural. Product = products
module.exports = mongoose.model('Product', productSchema) 

