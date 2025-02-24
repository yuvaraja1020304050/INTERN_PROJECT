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
  const schemaQuery = `
    CREATE SCHEMA IF NOT EXISTS my_schema;
  `;
  
  const tableQuery = `
    CREATE TABLE IF NOT EXISTS my_schema.users (
      id SERIAL PRIMARY KEY,
      phone_number VARCHAR(20) UNIQUE NOT NULL,
      is_premium BOOLEAN DEFAULT FALSE
    );
  `;
  
  try {
    await pool.query(schemaQuery);
    console.log("Schema ensured.");

    await pool.query(tableQuery);
    console.log("Users table ensured in schema 'my_schema'.");
  } catch (error) {
    console.error("Error creating schema or table:", error);
  }
};

createUserTable();

app.get("/check-premium/:phone", async (req, res) => {
  const { phone } = req.params;
  console.log(phone)
  try {
    const result = await pool.query(
      "SELECT is_premium FROM my_schema.users WHERE phone_number = $1", 
      [phone]
    );
    if (result.rows.length > 0) {
      res.json({ isPremium: result.rows[0].is_premium });
    } else {
      res.json({ isPremium: false });
    }
  } catch (error) {
    console.error("Database error:", error);
    res.status(500).json({ error: "Database error" });
  }
});

//price_1QvtfnPttfWc6sY2hsaf3cJb

app.post("/create-checkout-session", async (req, res) => {
  const { plan, phone } = req.body;  

  try {
  
    const stripePriceId = 'price_1QvtfnPttfWc6sY2hsaf3cJb';

    const priceDetails = await stripe.prices.retrieve(stripePriceId);
    const planPrice = priceDetails.unit_amount / 100;  
  
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "subscription", 
      line_items: [{
        price: stripePriceId,  
        quantity: 1,
      }],
      success_url: `${process.env.CLIENT_URL}/success?phone=${phone}`, 
      cancel_url: `${process.env.CLIENT_URL}/cancel`,
    });

   
    await pool.query(
      "INSERT INTO my_schema.users (phone_number, is_premium) VALUES ($1, $2) ON CONFLICT (phone_number) DO UPDATE SET is_premium = true",
      [phone, true]
    );
    console.log("User marked as premium");

 
    res.json({ id: session.id });

  } catch (error) {
    console.error("Stripe error:", error);
    res.status(500).json({ error: "Stripe error" });
  }
});





app.listen(port, () => console.log(`Server running on port ${port}`));
