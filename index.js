const express = require("express");
const app = express();
const path = require("path");
const stripe = require("stripe")(
  ""
);
const cors = require("cors");

const domain = "http://localhost:8080";

app.use(express.static(path.join(__dirname, "views")));

app.use(express.json());

app.use(cors());

// routes
app.post("/api/payment", async (req, res) => {
  const { product } = req.body;
  const session = await stripe.checkout.sessions.create({
    payment_method_types: ["card"],
    line_items: [
      {
        price_data: {
          currency: "brl",
          product_data: {
            name: product.name,
            images: [product.image],
          },
          unit_amount: product.amount * 100,
        },
        quantity: product.quantity,
      },
    ],
    phone_number_collection: {
      enabled: true,
    },
    mode: "payment",
    success_url: `${domain}/loja.html`,
    cancel_url: `${domain}/loja.html`,
  });
  // console.log(session);
  res.json({ id: session.id });
});

const port = process.env.PORT || 8080;
app.listen(port, () => console.log(`Listening on port ${port}...`));
