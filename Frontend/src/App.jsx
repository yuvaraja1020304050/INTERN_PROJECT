import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Subscription from "./pages/Subscription";
import Checkout from "./pages/Checkout";
import PremiumDashboard from "./pages/PremiumDashboard";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";

const stripePromise = loadStripe("pk_test_51QvgE2PttfWc6sY22QCNXZxhr3X3pXiMTAqX5qoymMcb3o2GlGoCc2fuSJqLjzSvKMxddPapUqMSc7VChIojThTc00srKxCx4T");

const App = () => {
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [isPremiumUser, setIsPremiumUser] = useState(false);

  
  useEffect(() => {
    const premiumStatus = localStorage.getItem("isPremiumUser");
    if (premiumStatus === "true") {
      setIsPremiumUser(true);
    }
  }, []);

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Subscription setSelectedPlan={setSelectedPlan} />} />
        <Route
          path="/checkout"
          element={
            selectedPlan ? (
              <Elements stripe={stripePromise}>
                <Checkout selectedPlan={selectedPlan} setIsPremiumUser={setIsPremiumUser} />
              </Elements>
            ) : (
              <Navigate to="/" />
            )
          }
        />
        <Route path="/premium-user" element={isPremiumUser ? <PremiumDashboard /> : <Navigate to="/" />} />
      </Routes>
    </Router>
  );
};

export default App;
