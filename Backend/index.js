require("dotenv").config();
const express = require("express");
const cors = require("cors");
const { Pool } = require("pg");
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
const bodyParser = require("body-parser");

const app = express();
const port = process.env.PORT || 5000;


console.log("Database URL:", process.env.DATABASE_URL);

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === "production" ? { rejectUnauthorized: false } : false,
});

app.use(cors());
app.use(bodyParser.json());

const createUserTable = async () => {
  const query = `
    CREATE TABLE IF NOT EXISTS users (
      id SERIAL PRIMARY KEY,
      phone_number VARCHAR(20) UNIQUE NOT NULL,
      is_premium BOOLEAN DEFAULT FALSE
    );
  `;
  try {
    await pool.query(query);
    console.log("Users table ensured.");
  } catch (error) {
    console.error("Error creating table:", error);
  }
};

createUserTable(); 

app.get("/check-premium/:phone", async (req, res) => {
  const { phone } = req.params;
  try {
    const result = await pool.query("SELECT is_premium FROM users WHERE phone_number = $1", [phone]);
    res.json({ isPremium: result.rows.length > 0 ? result.rows[0].is_premium : false });
  } catch (error) {
    console.error(" Database error:", error);
    res.status(500).json({ error: "Database error" });
  }
});

app.post("/create-checkout-session", async (req, res) => {
  const { plan, phone } = req.body;
  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "subscription",
      line_items: [{
        price_data: {
          currency: "inr",
          product_data: { name: plan.name },
          unit_amount: parseInt(plan.price.replace("₹", "").replace("/month", "")) * 100
        },
        quantity: 1
      }],
      success_url: `${process.env.CLIENT_URL}/success?phone=${phone}`,
      cancel_url: `${process.env.CLIENT_URL}/cancel`,
    });
    res.json({ id: session.id });
  } catch (error) {
    console.error(" Stripe error:", error);
    res.status(500).json({ error: "Stripe error" });
  }
});

app.post("/mark-premium", async (req, res) => {
  const { phone } = req.body;
  try {
    await pool.query(
      "INSERT INTO users (phone_number, is_premium) VALUES ($1, $2) ON CONFLICT (phone_number) DO UPDATE SET is_premium = true",
      [phone, true]
    );
    res.json({ message: "User upgraded to premium" });
  } catch (error) {
    console.error(" Database error:", error);
    res.status(500).json({ error: "Database error" });
  }
});

app.listen(port, () => console.log(` Server running on port ${port}`));
