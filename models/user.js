const mongoose = require('mongoose');
const Product = require('./product'); //bring in product model

const Schema = mongoose.Schema;

const userSchema = new Schema({
  name: {
    type: String, 
    required: true
  },
  email: {
    type: String, 
    required: true
  },
  cart: {
    items: [{ 
      productId: {                      // Create an embeded schema
        type: Schema.Types.ObjectId,    // Indicate that the product Id will be a schema Object ID
        ref: 'Product',                 // Create relationship for embeded documents
        required: true 
      }, 
      quantity: {
        type: Number, 
        required: true
      }
    }]
  }
});


// ADDING YOUR OWN UTILIITY METHODS TO SCHEMA
// https://mongoosejs.com/docs/api/schema.html#Schema.prototype.method()
userSchema.methods.addToCart = function(product) {
  // ADD YOUR OWN LOGIC HERE:
  // FIRST, FIND IF PRODUCT ALREADY EXISTS USER.CART.ITEMS
    const cartProductIndex = this.cart.items.findIndex( cp => {
      return cp.productId.toString() === product._id.toString()
    });

    let newQuantity = 1
    const updatedCartItems = [...this.cart.items];  // make a copy of original cart

    // USE INDEX. IF PRODUCT EXISTS --> UPDATE current quantity
    if (cartProductIndex >= 0) {
      newQuantity = this.cart.items[cartProductIndex].quantity + 1;
      updatedCartItems[cartProductIndex].quantity = newQuantity;

      // IF PRODUCT DOESN'T EXIST, ADD TO CART AND BEGIN QTY OF 1
    } else {
      updatedCartItems.push({
        productId: product._id, 
        quantity: newQuantity 
      });
    }

    // Update cart items
    const updatedCart = {
      items: updatedCartItems          // updates a product to have a quantity attribute
    }

    // Get User from DB and Update Cart.
    this.cart = updatedCart;
    
    return this.save();
}

userSchema.methods.removeFromCart = function(prodId) {
  const updatedCartItems = this.cart.items.filter(item => item.productId.toString() !== prodId.toString());
  
  this.cart.items = updatedCartItems;
  return this.save()
}

userSchema.methods.clearCart = function() {
  this.cart = { items:[]} 
  return this.save()

}

// mongoose method connects a schema with the 'Name' you want for the model and the schema.
// Mongoose automatically creates a Collection ('table') that lowercases table name and makes it plural. User = users
module.exports = mongoose.model('User', userSchema);

