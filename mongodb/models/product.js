const {getDatabaseClient} = require("../util/database");
const {ObjectId}          = require("mongodb");

class Product {
  constructor(title, price, imageUrl, description, userId, id) {
    this.title       = title;
    this.price       = price;
    this.imageUrl    = imageUrl;
    this.description = description;
    this.userId = new ObjectId(userId);
    this._id = new ObjectId(id);
  }

  save() {
    return getDatabaseClient()
      .db()
      .collection("products")
      .insertOne(this);
  }

  replace() {
    return getDatabaseClient()
      .db()
      .collection("products")
      .replaceOne({ _id: this._id}, {...this})
  }

  static fetchAll() {
    return getDatabaseClient()
      .db()
      .collection("products")
      .find()
      .toArray();
  }

  static findById(id) {
    return getDatabaseClient()
      .db()
      .collection("products")
      .findOne({_id: new ObjectId(id)});
  }

  static deleteById(id) {
    return getDatabaseClient()
      .db()
      .collection("products")
      .deleteOne({_id: new ObjectId(id)})
  }
}

module.exports = Product;
