import express from "express";

const app = express();

app.use(express.json());

// Shopping cart array
let cart = [
  {
    id: 1,
    productName: "Wireless Mouse",
    price: 799,
    quantity: 2,
    category: "Electronics",
  },
  {
    id: 2,
    productName: "Keyboard",
    price: 999,
    quantity: 1,
    category: "Electronics",
  },
  {
    id: 3,
    productName: "Notebook",
    price: 100,
    quantity: 5,
    category: "Stationery",
  },
];

// GET - All products
app.get("/cart", (req, res) => {
  res.status(200).json(cart);
});

// GET - Product by ID
app.get("/cart/:id", (req, res) => {
  const id = Number(req.params.id);
  const product = cart.find((item) => item.id === id);

  if (!product) {
    return res.status(404).json({ message: "Product not found" });
  }

  res.json({
    ...product,
    totalPrice: product.price * product.quantity,
  });
});

// POST - Add product
app.post("/cart", (req, res) => {
  const { id, productName, price, quantity, category } = req.body;

  if (
    id === undefined ||
    !productName ||
    price === undefined ||
    quantity === undefined ||
    !Number.isFinite(Number(price)) ||
    !Number.isFinite(Number(quantity)) ||
    Number(price) < 0 ||
    Number(quantity) < 0
  ) {
    return res.status(400).json({ message: "Invalid product details" });
  }

  if (cart.some((item) => item.id === Number(id))) {
    return res.status(409).json({ message: "Product ID already exists" });
  }

  const newProduct = {
    id: Number(id),
    productName,
    price: Number(price),
    quantity: Number(quantity),
    category: category || "Other",
  };

  cart.push(newProduct);

  res.status(201).json({
    message: "Product added successfully",
    product: {
      ...newProduct,
      totalPrice: newProduct.price * newProduct.quantity,
    },
  });
});

// PUT - Update product
app.put("/cart/:id", (req, res) => {
  const id = Number(req.params.id);
  const product = cart.find((item) => item.id === id);

  if (!product) {
    return res.status(404).json({ message: "Product not found" });
  }

  const { productName, price, quantity, category } = req.body;

  if (
    (price !== undefined &&
      (!Number.isFinite(Number(price)) || Number(price) < 0)) ||
    (quantity !== undefined &&
      (!Number.isFinite(Number(quantity)) || Number(quantity) < 0))
  ) {
    return res.status(400).json({ message: "Invalid price or quantity" });
  }

  if (productName !== undefined) product.productName = productName;
  if (price !== undefined) product.price = Number(price);
  if (quantity !== undefined) product.quantity = Number(quantity);
  if (category !== undefined) product.category = category;

  res.json({
    message: "Product updated successfully",
    product: {
      ...product,
      totalPrice: product.price * product.quantity,
    },
  });
});

// DELETE - Remove product
app.delete("/cart/:id", (req, res) => {
  const id = Number(req.params.id);
  const index = cart.findIndex((item) => item.id === id);

  if (index === -1) {
    return res.status(404).json({ message: "Product not found" });
  }

  const deletedProduct = cart.splice(index, 1);

  res.json({
    message: "Product deleted successfully",
    product: deletedProduct[0],
  });
});

// Invalid routes
app.use((req, res) => {
  res.status(404).json({ message: "Route not found" });
});

// Start server
app.listen(4000, () => {
  console.log("Express Server running at http://localhost:4000");
});
