import React, { useState } from "react";
import { useStripe, useElements, CardElement } from "@stripe/react-stripe-js";
import { useNavigate } from "react-router-dom";

const Checkout = ({ selectedPlan }) => {
  const stripe = useStripe();
  const elements = useElements();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // Send the selected plan and phone number to your backend to create the checkout session
      const response = await fetch("http://localhost:5000/create-checkout-session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          plan: selectedPlan,  // You may want to send the full plan object
          phone: "79"  // This should be dynamically set based on the user
        }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Something went wrong");

      // Redirect the user to Stripe's checkout page
      const { error } = await stripe.redirectToCheckout({ sessionId: data.id });
      if (error) setError(error.message);
      else navigate("/premium-dashboard"); // Redirect to the premium dashboard after checkout

    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-gray-100">
      <div className="bg-white p-6 rounded-lg shadow-md w-96 text-center">
        <h2 className="text-2xl font-bold mb-4">Checkout</h2>
        <p className="text-lg font-semibold">{selectedPlan?.name} - {selectedPlan?.price}</p>
        <form onSubmit={handleSubmit} className="mt-4">
          <CardElement className="border p-2 rounded-md" />
          <button type="submit" disabled={!stripe || loading} className="bg-blue-500 text-white px-4 py-2 mt-4 rounded-lg hover:bg-blue-600">
            {loading ? "Processing..." : "Pay Now"}
          </button>
          {error && <p className="text-red-500 mt-2">{error}</p>}
        </form>
      </div>
    </div>
  );
};

export default Checkout;
