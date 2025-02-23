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
      const response = await fetch("http://localhost:5000/create-checkout-session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ plan: selectedPlan }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Something went wrong");

      const { error } = await stripe.redirectToCheckout({ sessionId: data.id });
      if (error) setError(error.message);
      else navigate("/premium-dashboard"); 
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
