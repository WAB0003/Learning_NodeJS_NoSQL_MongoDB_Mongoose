const mongoose = require('mongoose'); 
const Schema = mongoose.Schema;             // Schema constructor provided with mongoose ODM

//MONGOOSE MODEL DOCS: https://mongoosejs.com/docs/models.html

// DESCRIPTION OF SCHEMA (BLUEPRINT)
const orderSchema = new Schema({
    user: {
        name: {
            type: String,
            required: true
        },
        userId: {
            type: Schema.Types.ObjectId,
            required: true
        }
    },
    products: [{
        productData: {
            type: Object,
            required: true
        },
        quantity: {
            type: Number,
            required: true
        }
    }]

    
})

// mongoose method connects a schema with the 'Name' you want for the model and the schema.
// Mongoose automatically creates a Collection ('table') that lowercases table name and makes it plural. Order = orders
module.exports = mongoose.model('Order', orderSchema);