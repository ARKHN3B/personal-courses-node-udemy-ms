const fs   = require("fs");
const path = require("path");

const rootDir = require("../util/path");

const p = path.join(rootDir, "data", "cart.json");

module.exports = class Cart {
  static addProduct(id, productPrice) {
    // Fetch previous cart
    fs.readFile(p, (err, fileContent) => {
      let cart = {products: [], totalPrice: 0};

      // Has already a cart
      if (!err) {
        cart = JSON.parse(fileContent);
      }

      // Analyze cart => find existing product
      const existingProductIndex = cart.products.findIndex(p => p.id === id);

      // Add new product || Increase existing one
      let updatedProduct;
      if (existingProductIndex > -1) {
        const existingProduct               = cart.products[existingProductIndex];
        updatedProduct                      = {
          ...existingProduct,
          quantity: existingProduct.quantity + 1
        };
        cart.products[existingProductIndex] = updatedProduct;
      }
      else {
        updatedProduct = {id, quantity: 1};
        cart.products  = [...cart.products, updatedProduct];
      }

      // Update total price
      cart.totalPrice += +productPrice;

      fs.writeFile(p, JSON.stringify(cart), err => {
        console.log(err);
      });
    });
  }

  static deleteProduct(id, productPrice) {
    fs.readFile(p, (err, fileContent) => {
      if (err) {
        return;
      }

      const cart = JSON.parse(fileContent);

      const productIndex = cart.products.findIndex(product => product.id === id);

      if (productIndex < 0) {
        return;
      }

      const product = cart.products[productIndex];
      cart.totalPrice -= (productPrice * product.quantity);
      cart.products.splice(productIndex, 1);

      fs.writeFile(p, JSON.stringify(cart), err => {
        console.log(err);
      });
    });
  }

  static getCart(cb) {
    fs.readFile(p, (err, fileContent) => {
      if (err) {
        cb(null);
        return;
      }
      const cart = JSON.parse(fileContent);
      cb(cart);
    });
  }
};
