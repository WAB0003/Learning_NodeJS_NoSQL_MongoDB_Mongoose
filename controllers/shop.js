const Product = require('../models/product');
const Order = require('../models/order')

exports.getProducts = (req, res, next) => {
  Product.find()                  //find method in mongoose provides all products (not a cursor)
  // .select('title price -_id')  // Cool methods for specifying rules for object response
  // .populate('userId')          // Cool method for basically doing sequilize rules. Now the entire User object is in response
    .then(products => {
      res.render('shop/product-list', {
        prods: products,
        pageTitle: 'All Products',
        path: '/products'
      });
    })
    .catch(err => {
      console.log(err);
    });
};

exports.getProduct = (req, res, next) => {
  const prodId = req.params.productId;
  Product.findById(prodId)                      //Mongoose provides method
    .then(product => {
      res.render('shop/product-detail', {
        product: product,
        pageTitle: product.title,
        path: '/products'
      });
    })
    .catch(err => console.log(err));
};

exports.getIndex = (req, res, next) => {
  Product.find()
    .then(products => {
      res.render('shop/index', {
        prods: products,
        pageTitle: 'Shop',
        path: '/'
      });
    })
    .catch(err => {
      console.log(err);
    });
};

exports.getCart = (req, res, next) => {
  req.user
    .populate('cart.items.productId')
    .then(user => {
      // console.log(user.cart.items)
      res.render('shop/cart', {
        path: '/cart',
        pageTitle: 'Your Cart',
        products: user.cart.items
      });
    })
    .catch(err => console.log(err));
};

exports.postCart = (req, res, next) => {
  const prodId = req.body.productId;
  // Find Product
  Product.findById(prodId)          
    .then(product => {
      return req.user.addToCart(product);
    }).then(result => {
      res.redirect('/cart')
    })
};

exports.postCartDeleteProduct = (req, res, next) => {
  const prodId = req.body.productId;
  req.user
    .removeFromCart(prodId)
    .then(result => {
      res.redirect('/cart');
    })
    .catch(err => console.log(err));
};

exports.postOrder = (req, res, next) => {
  // get the cart for a user:
  req.user
    .populate('cart.items.productId')
    .then(user => {
      const products = user.cart.items.map(item => {
        return {
          quantity: item.quantity,
          productData: { ...item.productId._doc }         // _doc is a mongoose method that gives you all data of a document. 
        };
      });
      console.log('my order')
      console.log(products)

      const order = new Order({
        user: {
          name: req.user.name,
          userId: req.user        //Mongoose is smart enough to pick ._id out of just the user object
        },
        products: products 
      });
      // save to database
      return order.save()             
    })
    .then(result => {
      // Clear cart
      return req.user.clearCart();  // Method defined in User Model
    }).then(result => {
      res.redirect('/orders');
    })
    .catch(err => console.log(err));
};

exports.getOrders = (req, res, next) => {
  console.log(req.user._id)
  Order
  .find({ "user.userId": req.user._id })
  .then(orders => {
    res.render('shop/orders', {
      path: '/orders',
      pageTitle: 'Your Orders',
      orders: orders
    });
  })
  .catch(err => console.log(err));
};
