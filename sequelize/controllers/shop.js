const Product = require("../models/product");

exports.getProducts = (req, res, next) => {
  Product
    .findAll()
    .then(products => {
      res.render("shop/product-list", {
        products,
        pageTitle: "All Products",
        path     : "/products"
      });
    })
    .catch(console.error);
};

exports.getProduct = (req, res, next) => {
  const {id} = req.params;
  Product.findByPk(id)
    .then(product => {
      res.render("shop/product-detail", {
        product,
        pageTitle: "Product detail",
        path     : "/products"
      });
    })
    .catch(console.error);
};

exports.getIndex = (req, res, next) => {
  Product.findAll()
    .then(products => {
      res.render("shop/index", {
        products,
        pageTitle: "Shop",
        path     : "/"
      });
    })
    .catch(console.error);
};

exports.getCart = (req, res, next) => {
  req.user.getCart()
    .then(cart => cart?.getProducts())
    .then(products => {
      console.log(products);
      res.render("shop/cart", {
        path     : "/cart",
        pageTitle: "Your Cart",
        cart     : products,
      });
    })
    .catch(console.error);
  // Cart.getCart(cart => {
  //   Product.fetchAll(products => {
  //     const detailedCart = [];
  //     for (const product of products) {
  //       const cartProduct = cart.products.find(({id}) => id === product.id);
  //       if (cartProduct) {
  //         detailedCart.push({...product, quantity: cartProduct.quantity});
  //       }
  //     }
  //     res.render("shop/cart", {
  //       path     : "/cart",
  //       pageTitle: "Your Cart",
  //       cart     : detailedCart,
  //     });
  //   });
  // });
};

exports.postCart = (req, res, next) => {
  const {productId} = req.body;

  req.user.getCart()
    .then(async cart => {
      const products = await cart?.getProducts({where: {id: productId}});
      let product, quantity;

      // Product exists in the cart
      if (products?.length) {
        product           = products[0];
        const oldQuantity = product.cartItem.quantity;
        quantity          = oldQuantity + 1;
      }
      else {
        product  = await Product.findByPk(productId);
        quantity = 1;
      }

      // addProduct() special method adds or updates in the junction table we create and we set the extra field ("quantity") inside with the option "through".
      await cart.addProduct(product, {through: {quantity}});

      res.redirect("/cart");
    })
    .catch(console.error);
};

exports.postCardDeleteProduct = (req, res, next) => {
  const {id} = req.body;
  req.user.getCart()
    .then(cart => cart.getProducts({where: {id}}))
    .then(products => {
      const product = products[0];
      // We delete the product only in the junction table "cartItems"
      return product?.cartItem?.destroy();
    })
    .then(() => res.redirect("/cart"))
    .catch(console.error);
};

exports.getOrders = (req, res, next) => {
  req.user
    .getOrders({ include: ["products"] }) // we include all the products with the association
    .then(orders => {
      console.log(orders)
      res.render("shop/orders", {
        path     : "/orders",
        pageTitle: "Your Orders",
        orders
      });
    })
    .catch(console.error);
};

exports.postOrder = (req, res, next) => {
  req.user
    .getCart()
    .then(async cart => {
      const products = await cart.getProducts();

      const order = await req.user.createOrder();

      // Here we need to map each product to add quantity on the specific model name that represents orderItem junction table
      // to add some values for each product, like the quantity. We can't use through option because each product needs a specific field.
      // So we add them manually.
      await order.addProducts(products.map(product => {
        product.orderItem = {quantity: product.cartItem.quantity};
        return product;
      }));

      await cart.setProducts(null);
    })
    .then(result => {
      res.redirect("/orders");
    })
    .catch(console.error);
};

exports.getCheckout = (req, res, next) => {
  res.render("shop/checkout", {
    path     : "/checkout",
    pageTitle: "Checkout"
  });
};
