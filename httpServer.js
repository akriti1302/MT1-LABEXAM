import http from "http";
import fs from "fs";

let cart = [
  { id: 1, productName: "Wireless Mouse", price: 799, quantity: 2 },
  { id: 2, productName: "Keyboard", price: 999, quantity: 1 },
  { id: 3, productName: "Notebook", price: 100, quantity: 5 },
];

const server = http.createServer((req, res) => {
  // GET /
  if (req.url === "/" && req.method === "GET") {
    res.writeHead(200, { "Content-Type": "text/html" });
    res.end("<h1>Welcome to Shopping Cart Management</h1>");
  }

  // GET /cart
  else if (req.url === "/cart" && req.method === "GET") {
    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(JSON.stringify(cart, null, 2));
  }

  // GET /about
  else if (req.url === "/about" && req.method === "GET") {
    res.writeHead(200, { "Content-Type": "text/html" });
    res.end("<h2>Shopping Cart Application Information</h2>");
  }

  // GET /home
  else if (req.url === "/home" && req.method === "GET") {
    fs.readFile("./public/index.html", "utf8", (err, data) => {
      if (err) {
        res.writeHead(500, { "Content-Type": "text/plain" });
        res.end("Error reading file");
      } else {
        res.writeHead(200, { "Content-Type": "text/html" });
        res.end(data);
      }
    });
  }

  // POST /add-to-cart
  else if (req.url === "/add-to-cart" && req.method === "POST") {
    let body = "";

    req.on("data", (chunk) => {
      body += chunk;
    });

    req.on("end", () => {
      try {
        const product = JSON.parse(body);

        // Validate product details
        if (
          product.id === undefined ||
          !product.productName ||
          product.price === undefined ||
          product.quantity === undefined ||
          !Number.isFinite(Number(product.price)) ||
          !Number.isFinite(Number(product.quantity)) ||
          Number(product.price) < 0 ||
          Number(product.quantity) < 0
        ) {
          res.writeHead(400, {
            "Content-Type": "application/json",
          });

          res.end(
            JSON.stringify({
              message: "Invalid or missing product details",
            }),
          );

          return;
        }

        // Check duplicate ID
        if (cart.some((item) => item.id == product.id)) {
          res.writeHead(409, {
            "Content-Type": "application/json",
          });

          res.end(
            JSON.stringify({
              message: "Product ID already exists",
            }),
          );

          return;
        }

        // Add product to cart
        cart.push(product);

        res.writeHead(201, {
          "Content-Type": "application/json",
        });

        res.end(
          JSON.stringify({
            message: "Product added successfully",
            product: product,
          }),
        );
      } catch (error) {
        res.writeHead(400, {
          "Content-Type": "application/json",
        });

        res.end(
          JSON.stringify({
            message: "Invalid JSON data",
          }),
        );
      }
    });
  }

  // 404 - Invalid route
  else {
    res.writeHead(404, { "Content-Type": "text/plain" });
    res.end("404 Page Not Found");
  }
});

// Start server
console.log("Starting HTTP server...");

server.listen(3000, () => {
  console.log("HTTP Server running at http://localhost:4000");
});
