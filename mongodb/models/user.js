const {getDatabaseClient} = require("../util/database");
const {ObjectId}          = require("mongodb");

class User {
  constructor(username, email, cart, id) {
    this.username = username;
    this.email    = email;
    this.cart     = cart; // {items: []}
    this._id      = new ObjectId(id);
  }

  save() {
    return getDatabaseClient()
      .db()
      .collection("users")
      .insertOne(this);
  }

  addToCart(product) {
    const cartProductIndex = this.cart.items.findIndex(cp => cp.productId.toString() === product._id.toString());

    let updatedCart = this.cart;
    if (cartProductIndex > -1) {
      updatedCart.items[cartProductIndex].quantity++;
    }
    else {
      updatedCart.items.push({productId: product._id, quantity: 1});
    }

    return getDatabaseClient()
      .db()
      .collection("users")
      .updateOne({_id: this._id}, {$set: {cart: updatedCart}});
  }

  getCart() {
    const productIds = this.cart.items.map(item => item.productId);
    // return getDatabaseClient()
    //   .db()
    //   .collection("users")
    //   .aggregate([
    //     {$match: {_id: this._id}},
    //     {$project: {cart: 1}},
    //     {$unwind: "$cart.items"},
    //     {$project: {productCart: "$cart.items"}},
    //     {
    //       $lookup: {
    //         from        : "products",
    //         localField  : "productCart.productId",
    //         foreignField: "_id",
    //         as          : "product"
    //       }
    //     },
    //     {$set: { product: { $arrayElemAt: ["$product", 0] } }},
    //     {$set: {"product.quantity": "$productCart.quantity"}},
    //     {$group: {
    //       _id: "$_id",
    //         products: { $push: "$product" }
    //       }}
    //   ]);
    return getDatabaseClient()
      .db()
      .collection("products")
      .find({_id: {$in: productIds}})
      .toArray()
      .then(products => (
        products.map(product => ({
          ...product,
          quantity: this.cart.items.find(item => item.productId.toString() === product._id.toString()).quantity,
        }))
      ));
  }

  deleteItemFromCart(productId) {
    return getDatabaseClient()
      .db()
      .collection("users")
      .updateOne({_id: this._id}, {$pull: {"cart.items": {productId: new ObjectId(productId)}}});
  }

  addOrder() {
    const db = getDatabaseClient().db();

    return this.getCart()
      .then(products => (
        // snapshot products
        db
          .collection("orders")
          .insertOne({products, userId: this._id})
      ))
      .then(() => (
        db
          .collection("users")
          .updateOne(
            {_id: this._id},
            {
              $set: {
                cart: {items: []}
              }
            }
          )
      ))
      .then(() => {
        this.cart.items = []
      });
  }

  getOrders() {
    return getDatabaseClient()
      .db()
      .collection("orders")
      .find({userId: this._id})
      .toArray();
  }

  static findById(id) {
    return getDatabaseClient()
      .db()
      .collection("users")
      .findOne({_id: new ObjectId(id)});
  }
}

module.exports = User;
