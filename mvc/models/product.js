const fs      = require("fs");
const path    = require("path");
const rootDir = require("../utils/path");

const p = path.join(rootDir, "data", "products.json");

function getProductsFromFile(cb) {
  fs.readFile(p, (err, fileContent) => {
    if (err) {
      cb([]);
    }
    else {
      cb(JSON.parse(fileContent));
    }
  });
}

module.exports = class Product {
  constructor(title, description, image, price) {
    this.title = title;
  }

  static fetchAll(cb) {
    getProductsFromFile(cb);
  }

  save() {
    getProductsFromFile(products => {
      products.push(this);
      fs.writeFile(p, JSON.stringify(products), (err) => {
        console.debug(err);
      });
    });
  }
};
